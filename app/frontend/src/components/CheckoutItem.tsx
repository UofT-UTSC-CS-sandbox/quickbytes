import { Chip, IconButton, Stack, Typography } from "@mui/material";
import { CartItem } from "../model/OrderCart";
import { Delete } from "@mui/icons-material";
import { UseMutationResult } from "@tanstack/react-query";

const CheckoutItem = ({data, id, mutation, canDelete }: {data: CartItem, id: string, mutation: UseMutationResult<unknown, Error, { id: string }, unknown>, canDelete: boolean}) => {

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
            { canDelete && 
            <IconButton aria-label='delete' disabled={mutation.isPending} onClick={() => mutation.mutate({ id })}>
                <Delete color='error'/>
            </IconButton> }
        </Stack>
    )
}

export default CheckoutItem;