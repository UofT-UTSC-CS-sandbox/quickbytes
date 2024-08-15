import { Alert, Badge, Button, Card, CircularProgress, Divider, Drawer, Fab, Snackbar, Stack, Typography } from "@mui/material";
import { OrderCart } from "../model/OrderCart"
import CheckoutItem from "./CheckoutItem"
import { Close, Place, ShoppingCart, ShoppingCartCheckout } from "@mui/icons-material";
import currencyFormatter from "./CurrencyFormatter";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import OrderStatus, { convertOrderStatusToStringCustomerFriendly } from "../model/OrderStatus";
import SingleMarkerMap from "./SetDirectionsMap";
import orderService from "../services/orderService";
import trackingService from '../services/trackingService';

const DEFAULT_PICKUP_LOCATION = { lat: 43.785171372795524, lng: -79.18748160572729 };

interface CheckoutCartProps {
    order: OrderCart
    setOrder: React.Dispatch<React.SetStateAction<OrderCart | null>>

    // The restaurant ID that the current page is currently displaying, not that of the order!
    pageRestaurantId: string
}

const CheckoutCart = ({ order, setOrder, pageRestaurantId }: CheckoutCartProps) => {
    const [viewMap, setViewMap] = useState(false);
    const [pickupLocation, setPickupLocation] = useState<{ lat: number, lng: number }>(DEFAULT_PICKUP_LOCATION);
    const [pickupLocationName, setPickupLocationName] = useState<string | null>(null);
    const [pickupLocationSet, setPickupLocationSet] = useState(false);
    const nav = useNavigate();

    // Fetch the pickup location using trackingService
    const { data: dropOffData, error: dropOffError, isError: isDropOffError } = trackingService.getOrderDropoff(order.id).useQuery();

    useEffect(() => {
        if (dropOffData) {
            if (dropOffData.lat === 0 && dropOffData.lng === 0) {
                setPickupLocation(DEFAULT_PICKUP_LOCATION);
                setPickupLocationName("On Campus");
            } else {
                setPickupLocation({ lat: dropOffData.lat, lng: dropOffData.lng });
                setPickupLocationName(dropOffData.dropOffName);
            }
            setPickupLocationSet(true);
        } else if (isDropOffError) {
            console.error("Error fetching drop-off location:", dropOffError);
        }
    }, [dropOffData, isDropOffError, dropOffError]);

    const deleteItemMutation = orderService.deleteItem(
        order?.id.toString() || "",
        (data) => setOrder(data.data)
    ).useMutation();

    const { isPending, mutate: placeOrder, isError } = orderService.placeOrder(
        order?.id.toString() || "",
        (data) => {
            setOrder(data.data);
            setShowSuccess(true);
            if (pickupLocation) {
                nav(`/customer_tracking`);
            }
        }).useMutation();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const { data: setPickupLocationResponse, mutate: sendSetPickupLocation } = orderService.setPickupLocation(
        order!.id,
        (data) => {
            setViewMap(false);
            setPickupLocation(data.dropOff);
            setPickupLocationName(data.dropOffName);
            setPickupLocationSet(true);
        }
    ).useMutation()

    if (!order) {
        return null;
    }

    const content = (
        <Stack spacing='20px' padding='10px'>
            <Typography variant='h4'>Your Order</Typography>
            <Typography variant='body2' margin={0}>{order.restaurant.restaurantName}</Typography>
            {
                Object.entries(order.items).map(([id, item]) =>
                    <CheckoutItem
                        key={id}
                        data={item}
                        mutation={deleteItemMutation}
                        id={id}
                        canDelete={order.status === OrderStatus.ORDERING} />
                )
            }
            <Divider />
            <Stack spacing='10px'>
                <Stack direction="row" justifyContent="space-between">
                    <Typography>Subtotal</Typography>
                    <Typography>{currencyFormatter.format(order.price)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography>Discounts</Typography>
                    <Typography>{currencyFormatter.format(0)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography>Delivery Fee</Typography>
                    <Typography>{currencyFormatter.format(0)}</Typography>
                </Stack>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
                <Typography>Total</Typography>
                <Typography>{currencyFormatter.format(order.price)}</Typography>
            </Stack>
            <Divider />
            <Stack spacing={2}>
                <Typography>
                    {(pickupLocation.lat === DEFAULT_PICKUP_LOCATION.lat && pickupLocation.lng === DEFAULT_PICKUP_LOCATION.lng) ?
                        "You have not set a pick-up location yet." :
                        <span style={{ color: 'green' }}>
                            &#10003; You have a pick-up location set.
                            <br />
                            <em style={{ fontWeight: 'bold' }}>{pickupLocationName}</em>
                        </span>
                    }
                </Typography>
                {order.status === OrderStatus.ORDERING && (
                    <Button
                        variant='contained'
                        startIcon={<Place />}
                        color='secondary'
                        onClick={() => setViewMap(true)}
                    >
                        {pickupLocationSet ? "Change Pick-up Location" : "Set Pick-up Location"}
                    </Button>
                )}
                <Drawer anchor='bottom' open={viewMap} onClose={() => setViewMap(false)}>
                    <SingleMarkerMap
                        sendSetPickupLocation={sendSetPickupLocation}
                        rejectLocationChange={() => setViewMap(false)}
                        orderId={order.id}
                        initialPosition={pickupLocation}
                    />
                </Drawer>
            </Stack>
            <Divider />
            {isPending ? (
                <Typography><CircularProgress /> Placing order ... </Typography>
            ) : (
                <>
                    {order.status === OrderStatus.ORDERING && (
                        <Button
                            variant='contained'
                            startIcon={<ShoppingCartCheckout />}
                            color='success'
                            onClick={() => placeOrder()}
                            disabled={!pickupLocationSet}
                        >
                            Checkout
                        </Button>
                    )}
                    {isError && <Alert severity="error" sx={{ display: isError ? 'flex' : 'none' }}>Something went wrong. Please try again.</Alert>}
                </>
            )}
            {
                order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.ORDERING &&
                <Alert severity="success" sx={{ maxWidth: { sm: '100%', lg: '300px' } }}>
                    This order has been placed.<br />
                    {convertOrderStatusToStringCustomerFriendly(order.status)}
                </Alert>
            }
            {showSuccess && (
                <Snackbar open={showSuccess} onClose={() => setShowSuccess(false)} autoHideDuration={3000}>
                    <Alert severity="success">Order successfully placed.</Alert>
                </Snackbar>
            )}
        </Stack>
    );

    const numCartItems = Object.entries(order.items).reduce((acc, [_, item]) => acc + item.quantity, 0);

    return (
        <>
            {/* Checkout cart on desktop */}
            <Card sx={{ display: { xs: 'none', md: 'block' }, height: 'min-content' }}>
                {content}
            </Card>
            {/* Button to show cart on mobile */}
            <Fab
                color="secondary"
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: mobileOpen ? 'none' : 'block', md: 'none', position: 'fixed', bottom: 16, right: 16 } }}
            >
                <Badge color='error' badgeContent={numCartItems}>
                    <ShoppingCart />
                </Badge>
            </Fab>
            {/* Checkout cart on mobile */}
            <Drawer
                anchor='bottom'
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                {content}
                {/* Button to close mobile cart */}
                <Fab
                    color="secondary"
                    size='medium'
                    onClick={() => setMobileOpen(false)}
                    sx={{ display: { xs: mobileOpen ? 'block' : 'none', md: 'none' }, position: 'fixed', top: 16, right: 16 }}
                >
                    <Close sx={{ marginTop: 0.5 }} />
                </Fab>
            </Drawer>
        </>
    )
}

export default CheckoutCart;