import { Chip, Stack, Typography } from "@mui/material";
import { CartItem } from "../model/OrderCart";

const CheckoutItem = ({data}: {data: CartItem}) => {

    const { menuItemId, quantity, optionSelected, price } = data;
    const addOnsSelected = data?.addOnsSelected || {};

    return (
        <Stack
            direction="row"
            justifyContent='space-evenly'
            alignItems="center"
            spacing={2}>
            <Chip label={`x${quantity}`} color='secondary' sx={{width: 50}}/>
            <Stack alignItems="flex-start" sx={{width: '75%', textAlign: 'left'}}>
                <Typography color="success.main" fontWeight='bold'>{price}</Typography>
                <Typography color="primary" fontWeight='bold'>{menuItemId}</Typography>
                <p style={{margin: 0}}>{optionSelected}</p>
                <p style={{margin: 0}}>{Object.entries(addOnsSelected).map(([key, value]) => `${key}: ${value}`).join(', ')}</p>
            </Stack> 
            {/* <IconButton aria-label='delete'>
                <Delete color='error'/>
            </IconButton> */}
        </Stack>
    )
}

export default CheckoutItem;