import { Divider, List, ListItem, Stack, Typography } from "@mui/material"
import { convertOrderStatusToString } from "../model/OrderStatus"
import { ActiveOrderItem, ItemsOrdered } from "../services/restaurantService";

interface StaffOrderItemProps {
    order: ActiveOrderItem
}

const StaffOrderItem = ({ order }: StaffOrderItemProps) => {

    const items: ItemsOrdered = order.order.items ?? {};
    const entries = Object.entries(items);
    const { tracking: { orderPlacedTime, courierAcceptedTime, courierDropoffTime, courierPickupTime } } = order;
    const trackingInfo = [
        { label: 'Order Placed', time: orderPlacedTime },
        { label: 'Courier Accepted', time: courierAcceptedTime },
        { label: 'Courier Dropoff', time: courierDropoffTime },
        { label: 'Courier Pickup', time: courierPickupTime },
    ]

    return (
        <>
            <ListItem sx={{ padding: '40px' }}>
                <Stack spacing={1} sx={{ width: '100%', textAlign: 'left' }} justifyContent='center'>
                    <Typography sx={{ fontSize: '2rem' }} variant="h2">Order {order.orderId}</Typography>
                    <Typography sx={{ fontSize: '1.5rem', textAlign: 'center' }} variant="h3">Items</Typography>

                    <List style={{ margin: 'auto' }}>
                        {
                            entries ?
                                entries.map(([key, item]) => {

                                    const { menuItemId, optionSelected, addOnsSelected, quantity } = item;

                                    return <ListItem key={key}>
                                        <Stack spacing={1}>
                                            <Typography sx={{ fontSize: '1.2rem' }} variant="h4" color="primary" fontWeight='bold'>{menuItemId} x {quantity}</Typography>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Stack justifyContent='center' style={{ textAlign: 'left' }}>
                                                    <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }} variant='h5'>Option</Typography>
                                                    <p style={{ margin: 0, fontSize: '1rem' }}>{optionSelected}</p>
                                                </Stack>
                                                <Stack justifyContent='center' style={{ textAlign: 'left' }}>
                                                    <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }} variant='h5'>Addons</Typography>
                                                    <p style={{ margin: 0, fontSize: '1rem' }}>{addOnsSelected ? Object.entries(addOnsSelected).map(([key, value]) => `${key}: ${value}`).join(', ') : "None"}</p>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </ListItem>
                                })
                                :
                                <Typography>Error retrieving items.</Typography>
                        }
                    </List>

                    <Typography sx={{ fontSize: '1.5rem', textAlign: 'center' }} variant="h3">Tracking</Typography>
                    <Typography sx={{ fontSize: '1rem', textAlign: 'center' }}>{convertOrderStatusToString(order.tracking.status)}</Typography>
                    <Stack direction="row" justifyContent="space-between">
                        {trackingInfo.map(({ label, time }) => (
                            <Stack key={label + order.orderId}>
                                <Typography sx={{ fontSize: '1.2rem' }} color='primary' variant="h3">{label}</Typography>
                                <Typography
                                    sx={{ fontSize: '1rem' }}
                                    variant="h3"
                                    color={time ? 'success.main' : 'error'}
                                >
                                    {time ? new Date(time).toLocaleString() : 'N/A'}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </ListItem>
            <Divider />
        </>
    )
}

export default StaffOrderItem;