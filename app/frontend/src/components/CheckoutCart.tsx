import { Button, Card, Divider, Stack, Typography } from "@mui/material";
import { OrderCart } from "../model/OrderCart"
import CheckoutItem from "./CheckoutItem"
import { Place, ShoppingCartCheckout } from "@mui/icons-material";
import currencyFormatter from "./CurrencyFormatter";

const CheckoutCart = ({order}: {order: OrderCart | null }) => {

    console.log('cart sees', order)
    if (!order) {
        return null;
    }
    

    return (
        <Card style={{height: 'min-content'}}>
            <Stack spacing='20px' padding='10px'>
                <Typography variant='h4'>Your Order</Typography>
                {Object.entries(order.items).map(([id, item]) => <CheckoutItem key={id} data={item} />)}
                <Divider/>
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
                <Divider/>
                <Stack direction="row" justifyContent="space-between">
                    <Typography>Total</Typography>
                    <Typography>{currencyFormatter.format(order.price)}</Typography>
                </Stack>
                <Divider/>
                <Stack spacing={2}>
                    <Typography>You have not set a pick-up location yet.</Typography>
                    <Button variant='contained' startIcon={<Place/>} color='secondary'> Set Pick-up Location</Button>
                </Stack>
                <Divider/>
                <Button variant='contained' startIcon={<ShoppingCartCheckout/>} color='success'>Checkout</Button>
            </Stack>
        </Card>
    )
}

export default CheckoutCart;