import { Alert, Badge, Button, Card, CircularProgress, Divider, Drawer, Fab, Snackbar, Stack, Typography } from "@mui/material";
import { OrderCart } from "../model/OrderCart"
import CheckoutItem from "./CheckoutItem"
import { Close, Place, ShoppingCart, ShoppingCartCheckout } from "@mui/icons-material";
import currencyFormatter from "./CurrencyFormatter";
import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiUrl } from "./APIUrl";
import { useNavigate } from 'react-router-dom';
import OrderStatus from "../model/OrderStatus";
import SingleMarkerMap from "./SetDirectionsMap";
import orderService from "../services/orderService";
import trackingService from '../services/trackingService';

const CheckoutCart = ({ order, setOrder }: { order: OrderCart | null, setOrder: React.Dispatch<React.SetStateAction<OrderCart | null>> }) => {
    const [viewMap, setViewMap] = useState(false);
    const [pickupLocation, setPickupLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [pickupLocationSet, setPickupLocationSet] = useState(false);
    const nav = useNavigate();
    
    // Fetch the pickup location using trackingService
    const { data: pickupData, error: pickupError, isError: isPickupError } = trackingService.getPickupLocation(order?.id).useQuery();

    useEffect(() => {
        if (pickupData && pickupData.lat && pickupData.lng) {
            setPickupLocation({ lat: pickupData.lat, lng: pickupData.lng });
            setPickupLocationSet(true);
        } else if (isPickupError) {
            console.error("Error fetching pickup location:", pickupError);
        }
    }, [pickupData, isPickupError, pickupError]);

    const deleteItemMutation = orderService.deleteItem(
        order?.id.toString() || "",
        (data) => setOrder(data.data)
    ).useMutation();

    const { isPending, mutate: placeOrder, isError } = orderService.placeOrder(
        order?.id.toString() || "",
        (data) => {
            setOrder(data.data);
            setShowSuccess(true);
            if(pickupLocation) {
                nav(`/tracking/${pickupLocation.lng}_${pickupLocation.lat}`);
            }
        }).useMutation();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    if (!order) {
        return null;
    }

    const handleConfirmPickupLocation = (position: { lat: number, lng: number }) => {
        setViewMap(false);
        setPickupLocation(position);
        setPickupLocationSet(true);
        console.log(`Pickup location set to: ${position.lat}, ${position.lng}`);
    };

    const defaultLocation = { lat: 43.7845, lng: -79.1876 }; // Default location to be used if no pickup location is set

    const content = (
        <Stack spacing='20px' padding='10px'>
            <Typography variant='h4'>Your Order</Typography>
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
                    {pickupLocationSet ?
                        <span style={{ color: 'green' }}>&#10003; You have successfully set a pick-up location.</span> :
                        "You have not set a pick-up location yet."
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
                        onConfirmPickupLocation={handleConfirmPickupLocation}
                        orderId={order.id}
                        initialPosition={pickupLocation || defaultLocation}
                    />
                    <Fab sx={{ position: 'absolute', top: 8, right: 8 }} color='secondary' onClick={() => setViewMap(false)}>
                        <Close />
                    </Fab>
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
            {order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.ORDERING && <Alert severity="success">Order successfully placed.</Alert>}
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
