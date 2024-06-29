import { Divider, List, ListItem, Stack, Typography } from "@mui/material"
import OrderStatus, { convertOrderStatusToString } from "../model/OrderStatus"

export type ActiveOrderItem = {
    courierId: string,
    courierSplit: number,
    order: {
        items: Record<string, {
            menuItemId: string,
            optionSelected: string,
            addOnsSelected?: Record<string, string>,
            quantity: number
        }>,
        price: number,
    },
    tracking: {
        courierAcceptedTime: false | number,
        courierDropoffTime: false | number,
        courierPickupTime: false | number,
        orderPlacedTime: number,
        dropOff: { lat: number, lng: number }
        status: OrderStatus
    }
    orderId: string
}

interface StaffOrderItemProps {
    order: ActiveOrderItem
}

const StaffOrderItem = ({ order }: StaffOrderItemProps) => {

    const { order: { items } } = order;

    return (
        <>
        <ListItem>
            <Stack style={{width: '100%', textAlign: 'center'}} justifyContent='center'>
                <Typography variant="h2">Order {order.orderId}</Typography>
                <Typography variant="h3">Items</Typography>

                <List style={{margin: 'auto'}}>
                    {
                        Object.entries(items).map(([key, item]) => {

                            const { menuItemId, optionSelected, addOnsSelected, quantity } = item;

                            return <><ListItem key={key}>
                                <Stack justifyContent='center' style={{textAlign: 'left'}}>
                                    <Typography variant="h4" color="primary" fontWeight='bold'>{menuItemId} x {quantity}</Typography>
                                    <Typography variant='h5'>Option</Typography>
                                    <p style={{ margin: 0 }}>{optionSelected}</p>
                                    <Typography variant='h5'>Addons</Typography>
                                    <p style={{ margin: 0 }}>{addOnsSelected ? Object.entries(addOnsSelected).map(([key, value]) => `${key}: ${value}`).join(', ') : "None"}</p>
                                </Stack>
                                </ListItem>
                            </>
                        }
                        )
                    }
                </List>
                <Typography variant="h3">Status</Typography>
                <Typography>{convertOrderStatusToString(order.tracking.status)}</Typography>
            </Stack>
        </ListItem>
        <Divider/>
        </>
    )
}

export default StaffOrderItem;