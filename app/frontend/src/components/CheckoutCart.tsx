import { Alert, Button, Card, CircularProgress, Divider, Snackbar, Stack, Typography } from "@mui/material";
import { OrderCart } from "../model/OrderCart"
import CheckoutItem, { ItemDeleteResponse } from "./CheckoutItem"
import { Place, ShoppingCartCheckout } from "@mui/icons-material";
import currencyFormatter from "./CurrencyFormatter";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { apiUrl } from "./APIUrl";

const CheckoutCart = ({ order, setOrder }: { order: OrderCart | null, setOrder: React.Dispatch<React.SetStateAction<OrderCart | null>> }) => {

    if (!order) {
        return null;
    }

    const deleteItemMutation = useMutation({
        mutationKey: ['deleteItem', order?.id],
        mutationFn: (id: string): Promise<ItemDeleteResponse> => {
            return fetch(`${apiUrl}/restaurants/order/${order.id}/items/${id}`, {
                method: 'DELETE',
            }).then(res => res.json())
        },
        onSuccess: (data) => {
            setOrder(data.data);
        }
    });

    const { isPending, mutate: placeOrder, isError } = useMutation({
        mutationKey: ['placeOrder', order?.id],
        mutationFn: (): Promise<ItemDeleteResponse> => {
            return fetch(`${apiUrl}/restaurants/order/${order.id}/place`, {
                method: 'POST',
            }).then(res => res.json())
        },
        onSuccess: (data) => {
            setOrder(data.data);
            setShowSuccess(true);
        }
    });

    const [showSuccess, setShowSuccess] = React.useState(false);

    const isOrderInProgress = order.status === 'ORDERING';
    const isOrderPlaced = order.status === 'ORDERED';

    return (
        <Card style={{ height: 'min-content' }}>
            <Stack spacing='20px' padding='10px'>
                <Typography variant='h4'>Your Order</Typography>
                {
                    Object.entries(order.items).map(([id, item]) =>
                        <CheckoutItem
                            key={id}
                            data={item}
                            mutation={deleteItemMutation} id={id}
                            canDelete={isOrderInProgress} />
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
                    {isOrderInProgress && <Button variant='contained' startIcon={<Place />} color='secondary'> Set Pick-up Location</Button>}
                </Stack>
                <Divider />
                {
                    isPending ?
                        <Typography><CircularProgress /> Placing order ... </Typography>
                        :
                        <>
                            {isOrderInProgress && <Button variant='contained' startIcon={<ShoppingCartCheckout />} color='success' onClick={() => placeOrder()}>Checkout</Button>}
                            {isError && <Alert severity="error" sx={{ display: isError ? 'flex' : 'none' }}>Something went wrong. Please try again.</Alert>}
                            {isOrderPlaced && <Alert severity="success">Order successfully placed.</Alert>}
                        </>
                }
                { showSuccess && <Snackbar open={showSuccess} onClose={() => setShowSuccess(false)} autoHideDuration={3000}><Alert severity="success">Order successfully placed.</Alert></Snackbar> }
            </Stack>
        </Card>
    )
}

export default CheckoutCart;