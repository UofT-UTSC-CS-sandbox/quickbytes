import { Alert, Badge, Button, Card, CircularProgress, Divider, Drawer, Fab, Snackbar, Stack, Typography } from "@mui/material";
import { OrderCart } from "../model/OrderCart"
import CheckoutItem, { ItemDeleteResponse } from "./CheckoutItem"
import { Close, Place, ShoppingCart, ShoppingCartCheckout } from "@mui/icons-material";
import currencyFormatter from "./CurrencyFormatter";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { apiUrl } from "./APIUrl";
import OrderStatus from "../model/OrderStatus";

const CheckoutCart = ({ order, setOrder }: { order: OrderCart | null, setOrder: React.Dispatch<React.SetStateAction<OrderCart | null>> }) => {

    const deleteItemMutation = useMutation({
        mutationKey: ['deleteItem', order?.id],
        mutationFn: (id: string): Promise<ItemDeleteResponse> => {
            if (!order) {
                return Promise.reject();
            }
            return fetch(`${apiUrl}/restaurants/order/${order.id}/items/${id}`, {
                method: 'DELETE',
            }).then(res => res.json())
        },
        onSuccess: (data) => {
            setOrder(data.data);
        },
    });

    const { isPending, mutate: placeOrder, isError } = useMutation({
        mutationKey: ['placeOrder', order?.id],
        mutationFn: (): Promise<ItemDeleteResponse> => {
            if (!order) {
                return Promise.reject();
            }
            return fetch(`${apiUrl}/restaurants/order/${order.id}/place`, {
                method: 'POST',
            }).then(res => res.json())
        },
        onSuccess: (data) => {
            setOrder(data.data);
            setShowSuccess(true);
        }
    });

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const [showSuccess, setShowSuccess] = React.useState(false);

    if (!order) {
        return null;
    }

    const content = <Stack spacing='20px' padding='10px'>
        <Typography variant='h4'>Your Order</Typography>
        {
            Object.entries(order.items).map(([id, item]) =>
                <CheckoutItem
                    key={id}
                    data={item}
                    mutation={deleteItemMutation} id={id}
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
            <Typography>You have not set a pick-up location yet.</Typography>
            {order.status === OrderStatus.ORDERING && <Button variant='contained' startIcon={<Place />} color='secondary'> Set Pick-up Location</Button>}
        </Stack>
        <Divider />
        {
            isPending ?
                <Typography><CircularProgress /> Placing order ... </Typography>
                :
                <>
                    {order.status === OrderStatus.ORDERING && <Button variant='contained' startIcon={<ShoppingCartCheckout />} color='success' onClick={() => placeOrder()}>Checkout</Button>}
                    {isError && <Alert severity="error" sx={{ display: isError ? 'flex' : 'none' }}>Something went wrong. Please try again.</Alert>}
                </>
        }
        {(order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.ORDERING) && <Alert severity="success">Order successfully placed.</Alert>}
        {showSuccess && <Snackbar open={showSuccess} onClose={() => setShowSuccess(false)} autoHideDuration={3000}><Alert severity="success">Order successfully placed.</Alert></Snackbar>}
    </Stack>

    const numCartItems = Object.entries(order.items).reduce((acc, [_, item]) => acc + item.quantity, 0);

    return (
        <>
            {/* Checkout cart on desktop */}
            <Card sx={{display: { xs: 'none', md: 'block' }, height: 'min-content' }}>
                {content}
            </Card>
            {/* Button to show cart on mobile */}
            <Fab
                color="secondary"
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: mobileOpen ? 'none' : 'block', md: 'none', position: 'fixed', bottom: 16, right: 16 } }}>
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
                        <Close sx={{ marginTop: 0.5}}/>
                </Fab>
            </Drawer>
        </>
    )
}

export default CheckoutCart;