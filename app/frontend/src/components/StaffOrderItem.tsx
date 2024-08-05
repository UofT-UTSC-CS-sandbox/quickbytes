import { useState, useEffect } from "react";
import { Divider, List, ListItem, Stack, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { CheckCircle } from "@mui/icons-material";
import { convertOrderStatusToString } from "../model/OrderStatus"
import { ActiveOrderItem, ItemsOrdered } from "../services/restaurantService";
import restaurantService from '../services/restaurantService';
import OrderStatus from "../model/OrderStatus";

interface StaffOrderItemProps {
    order: ActiveOrderItem;
    restaurantId: number;
}

const StaffOrderItem = ({ order, restaurantId }: StaffOrderItemProps) => {

    const items: ItemsOrdered = order.order.items ?? {};
    const entries = Object.entries(items);
    const { tracking: { orderPlacedTime, courierAcceptedTime, courierDropoffTime, courierPickupTime, status } } = order;
    const trackingInfo = [
        { label: 'Order Placed', time: orderPlacedTime },
        { label: 'Courier Accepted', time: courierAcceptedTime },
        { label: 'Courier Dropoff', time: courierDropoffTime },
        { label: 'Courier Pickup', time: courierPickupTime },
    ];
    const generateRandomPin = () => {
        return Math.floor(1000 + Math.random() * 9000).toString();
    };
    const [pin, setPin] = useState<string | null>(null);
    const [enteredPin, setEnteredPin] = useState('');
    const [open, setOpen] = useState(false); // State to control the dialog
    const [isCourierConfirmed, setIsCourierConfirmed] = useState(false); // State to track if the courier has been confirmed

    const { mutate: setCourierConfirmationPin } = restaurantService.setCourierConfirmationPin(
        restaurantId,
        order.orderId,
        (data) => {
            if (data.success) {
                console.log('Courier confirmation pin added successfully.');
            } else {
                console.error('Failed to add courier confirmation pin:', data.message);
            }
        }
    ).useMutation();

    const { data, error, isLoading } = restaurantService.getCourierConfirmationPin(restaurantId, order.orderId, order.tracking.status === OrderStatus.AWAITING_PICK_UP).useQuery();

    const { mutate: updateCourierConfirmationStatus } = restaurantService.updateCourierConfirmationStatus(
        restaurantId,
        order.orderId,
        (data) => {
            if (data.success) {
                console.log('Courier confirmation status updated successfully.');
            } else {
                console.error('Failed to update courier confirmation status:', data.message);
            }
        }
    ).useMutation();

    const { data: statusData, isLoading: isStatusLoading } = restaurantService.getCourierConfirmationStatus(restaurantId, order.orderId).useQuery();

    useEffect(() => {
        const fetchPin = async () => {
            if (!isLoading && order.tracking.status === OrderStatus.AWAITING_PICK_UP) {
                if (data && data.courierPin) {
                    setPin(data.courierPin);
                } else {
                    const newPin = generateRandomPin();
                    setPin(newPin);
                    setCourierConfirmationPin({ courierPin: newPin });
                }
            }
        };

        fetchPin();
    }, [isLoading, data, setCourierConfirmationPin, order.tracking.status, pin, restaurantId, order.orderId]);

    useEffect(() => {
        if (statusData && statusData.isConfirmed) {
            setIsCourierConfirmed(true);
        }
    }, [statusData]);

    const handlePinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnteredPin(event.target.value);
    };

    const handlePinConfirm = () => {
        if (enteredPin === pin) {
            setIsCourierConfirmed(true); // Update the state to indicate courier has been confirmed
            setOpen(false); // Close the dialog
            updateCourierConfirmationStatus({}, {
                onSuccess: (data) => {
                    if (data.success) {
                        console.log('Courier confirmation status updated successfully.');
                    } else {
                        console.error('Failed to update courier confirmation status:', data.message);
                    }
                }
            });
        } else {
            alert('Incorrect PIN. Please try again.');
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                    {isCourierConfirmed ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <CheckCircle color="success" />
                            <Typography sx={{ fontSize: '1.2rem', color: 'green' }}>The courier has been confirmed</Typography>
                        </Stack>
                    ) : (
                        order.tracking.status === OrderStatus.AWAITING_PICK_UP && (
                            <Stack direction="row" justifyContent="center">
                                <Button variant="contained" color="primary" onClick={handleClickOpen} size="small" sx={{ width: 'fit-content' }}>
                                    Confirm the Courier
                                </Button>
                            </Stack>
                        )
                    )}
                </Stack>
            </ListItem>
            <Divider />

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Enter Courier PIN</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the 4-digit PIN provided by the courier to confirm the pickup.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Enter PIN"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={enteredPin}
                        onChange={handlePinChange}
                        inputProps={{ maxLength: 4 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handlePinConfirm} color="primary">
                        Confirm PIN
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default StaffOrderItem;