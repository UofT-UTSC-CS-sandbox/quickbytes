import React, { useEffect, useState, useRef } from 'react';
import { Stack, TextField, CircularProgress, Typography, ListItem, Box, Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { CheckCircle } from "@mui/icons-material";
import deliveryService from '../services/deliveryService';
import restaurantService from '../services/restaurantService';
import { useNavigate } from 'react-router-dom';
import NavBar from './Navbar';
import OrderStatus from '../model/OrderStatus';
import { convertOrderStatusToString } from '../model/OrderStatus';

const CourierDelivery: React.FC<{ isDrawer?: boolean, onClose?: () => void }> = ({ isDrawer = false, onClose }) => {
    const navigate = useNavigate();

    const { data: deliveries, isLoading: isDeliveriesLoading, isError: isDeliveriesError } = deliveryService.getCourierActiveOrder().useQuery();
    const [courierPin, setCourierPin] = useState<string | null>(null);
    const customerPinRef = useRef<string | null>(null);
    const [enteredCustomerPin, setEnteredCustomerPin] = useState('');
    const [open, setOpen] = useState(false); // State to control the dialog
    const [isCustomerConfirmed, setIsCustomerConfirmed] = useState(false); // State to track if the customer has been confirmed

    const generateRandomPin = () => {
        return Math.floor(1000 + Math.random() * 9000).toString();
    };

    const { data: pinData, error: pinError, isLoading: isPinLoading, refetch: refetchPin } = restaurantService.getCourierConfirmationPin(
        deliveries?.data?.restaurant.restaurantId,
        deliveries?.data?.orderId,
        deliveries?.data?.tracking.status === OrderStatus.AWAITING_PICK_UP
    ).useQuery();

    const { mutate: setCustomerConfirmationPin } = deliveryService.setCustomerConfirmationPin(
        (data) => {
            if (data.success) {
                console.log('Customer confirmation pin added successfully.');
                customerPinRef.current = data.customerPin;
            } else {
                console.error('Failed to add customer confirmation pin:', data.message);
            }
        }
    ).useMutation();

    const { data: customerPinData, error: customerPinError, isLoading: isCustomerPinLoading } = deliveryService.getCustomerConfirmationPin(undefined, deliveries?.data?.tracking.status === OrderStatus.EN_ROUTE && customerPinRef.current === null).useQuery();

    const { mutate: updateCustomerConfirmationStatus } = deliveryService.updateCustomerConfirmationStatus(
        (data) => {
            if (data.success) {
                console.log('Customer confirmation status updated successfully.');
            } else {
                console.error('Failed to update customer confirmation status:', data.message);
            }
        }
    ).useMutation();

    const { data: statusData, isLoading: isStatusLoading } = deliveryService.getCustomerConfirmationStatus().useQuery();

    useEffect(() => {
        if (!isCustomerPinLoading && deliveries?.data?.tracking.status === OrderStatus.EN_ROUTE) {
            if (customerPinData && customerPinData.customerPin) {
                customerPinRef.current = customerPinData.customerPin;
            } else if (customerPinRef.current === null) {
                const newPin = generateRandomPin();
                setCustomerConfirmationPin({ customerPin: newPin });
            }
        }
    }, [isCustomerPinLoading, customerPinData, setCustomerConfirmationPin, deliveries?.data?.tracking.status]);

    useEffect(() => {
        if (statusData && statusData.isConfirmed) {
            setIsCustomerConfirmed(true);
        }
    }, [statusData]);

    useEffect(() => {
        if (pinData?.courierPin) {
            setCourierPin(pinData.courierPin);
        } else if (!courierPin && deliveries?.data?.tracking.status === OrderStatus.AWAITING_PICK_UP) {
            // Refetch the pin if it's not set yet
            refetchPin();
        }
    }, [pinData, deliveries, courierPin, refetchPin]);

    useEffect(() => {
        if (deliveries) {
            console.log('Delivery data:', deliveries);
        }
    }, [deliveries]);

    const formatDateTime = (dateTime: string | number) => {
        const date = new Date(dateTime);
        return date.toLocaleString();
    };

    const handlePinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnteredCustomerPin(event.target.value);
    };

    const handlePinConfirm = () => {
        if (enteredCustomerPin === customerPinRef.current) {
            setIsCustomerConfirmed(true); // Update the state to indicate customer has been confirmed
            setOpen(false); // Close the dialog
            updateCustomerConfirmationStatus({});
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

    const renderList = () => {
        if (isDeliveriesLoading || isPinLoading) {
            return (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <CircularProgress />
                    <Typography>Loading ...</Typography>
                </Box>
            );
        } else if (isDeliveriesError || pinError) {
            return (
                <Typography align="center">Encountered error getting delivery. Please try again.</Typography>
            );
        } else if (!deliveries || !deliveries.data) {
            return (
                <Typography align="center">There are no active deliveries.</Typography>
            );
        } else {
            const delivery = deliveries.data;
            return (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    justifyContent="center"
                    mb={2}
                    p={2}
                    border={1}
                    borderColor="grey.300"
                    borderRadius={4}
                >
                    <Typography variant="body2">
                        <span style={{ fontWeight: 'bold' }}>Status:</span> {convertOrderStatusToString(delivery.tracking?.status as OrderStatus)}
                    </Typography>
                    <Typography variant="body2">
                        <span style={{ fontWeight: 'bold' }}>Restaurant:</span> {delivery.restaurant.restaurantName ?? 'N/A'}
                    </Typography>
                    {delivery.order?.items && Object.keys(delivery.order.items).map((itemId) => (
                        <ListItem key={itemId} style={{ paddingLeft: 0 }}>
                            <Typography variant="body2">
                                <span style={{ fontWeight: 'bold' }}>Items:</span> {`${delivery.order.items[itemId].menuItemId}, Quantity: ${delivery.order.items[itemId].quantity}`}
                            </Typography>
                        </ListItem>
                    ))}
                    {courierPin && (
                        <Typography variant="body2" style={{ marginTop: '8px' }}>
                            <span style={{ fontWeight: 'bold' }}>Restaurant Confirmation Pin:</span> {courierPin}
                        </Typography>
                    )}
                    {isCustomerConfirmed ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <CheckCircle color="success" />
                            <Typography sx={{ fontSize: '1.2rem', color: 'green' }}>The customer has been confirmed</Typography>
                        </Stack>
                    ) : (
                        deliveries.data.tracking.status === OrderStatus.EN_ROUTE && (
                            <Stack direction="row" justifyContent="center">
                                <Button variant="contained" color="primary" onClick={handleClickOpen} size="small" sx={{ width: 'fit-content' }}>
                                    Confirm the Customer
                                </Button>
                            </Stack>
                        )
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '16px' }}
                        onClick={() => navigate("/courier_tracking")}
                    >
                        Track Delivery
                    </Button>

                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Enter Customer Confirmation PIN</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please enter the 4-digit PIN provided by the customer to confirm the pickup.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Enter PIN"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={enteredCustomerPin}
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
                </Box>
            );
        }
    };

    return (
        <>
            {!isDrawer && (
                <>
                    <NavBar />
                    <Box display="flex" justifyContent="flex-start" width="100%" position="absolute" top={80} left={0} p={2}>
                        <Button variant="contained" color="primary" onClick={() => navigate('/courier')}>
                            Back to Courier Page
                        </Button>
                    </Box>
                </>
            )}
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
                <Typography variant="h4" gutterBottom>
                    Active Deliveries
                </Typography>
                {renderList()}
            </Box>
        </>
    );
};

export default CourierDelivery;
