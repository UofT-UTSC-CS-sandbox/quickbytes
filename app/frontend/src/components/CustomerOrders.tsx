import React from 'react';
import { CircularProgress, Typography, ListItem, Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './Navbar';
import OrderStatus from '../model/OrderStatus';
import { convertOrderStatusToString } from '../model/OrderStatus';
import deliveryService from '../services/deliveryService';

const CustomerOrders: React.FC<{ isDrawer?: boolean, onClose?: () => void }> = ({ isDrawer = false, onClose }) => {
    const navigate = useNavigate();
    const { data: orders, isLoading, isError } = deliveryService.getCustomerActiveOrder().useQuery();
    const [customerPin, setCustomerPin] = useState<string | null>(null);
    const { data: customerPinData, error: customerPinError, isLoading: isCustomerPinLoading, refetch: refetchPin } = deliveryService.getCustomerConfirmationPin(orders?.data?.courierId, (orders?.data?.tracking.status === OrderStatus.EN_ROUTE)).useQuery();

    useEffect(() => {
        if (customerPinData?.customerPin) {
            setCustomerPin(customerPinData.customerPin);
        } else if (!customerPin && orders?.data?.tracking.status === OrderStatus.EN_ROUTE) {
            // Refetch the pin if it's not set yet
            refetchPin();
        }
    }, [customerPinData, orders, customerPin, refetchPin]);

    useEffect(() => {
        if (orders) {
            console.log('Orders data:', orders);
        }
    }, [orders]);

    const formatDateTime = (dateTime: string | number) => {
        const date = new Date(dateTime);
        return date.toLocaleString();
    };

    const nav = useNavigate();

    const renderList = () => {
        if (isLoading) {
            return (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <CircularProgress />
                    <Typography>Loading ...</Typography>
                </Box>
            );
        } else if (isError) {
            return (
                <Typography align="center">Encountered error getting orders. Please try again.</Typography>
            );
        } else if (!orders || !orders.data) {
            return (
                <Typography align="center">There are no active orders.</Typography>
            );
        } else {
            const order = orders.data;
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
                    <Typography variant="body1">
                        <span style={{ fontWeight: 'bold' }}>Order Placed:</span> {formatDateTime(order.tracking.orderPlacedTime)}
                    </Typography>
                    <Typography variant="body2">
                        <span style={{ fontWeight: 'bold' }}>Status:</span> {convertOrderStatusToString(order.tracking?.status as OrderStatus)}
                    </Typography>
                    <Typography variant="body2">
                        <span style={{ fontWeight: 'bold' }}>Restaurant:</span> {order.restaurant.restaurantName ?? 'N/A'}
                    </Typography>
                    {order.order?.items && Object.keys(order.order.items).map((itemId) => (
                        <ListItem key={itemId} style={{ paddingLeft: 0 }}>
                            <Typography variant="body2">
                                <span style={{ fontWeight: 'bold' }}>Item:</span> {`${order.order.items[itemId].menuItemId}, Quantity: ${order.order.items[itemId].quantity}`}
                            </Typography>
                        </ListItem>
                    ))}
                    {customerPin && (
                        <Typography variant="body2" style={{ marginTop: '8px' }}>
                            <span style={{ fontWeight: 'bold' }}>Courier Confirmation Pin:</span> {customerPin}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '16px' }}
                        onClick={() => nav("/customer_tracking")} // Replace this with your desired action
                    >
                        Track Order
                    </Button>
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
                        <Button variant="contained" color="primary" onClick={() => navigate('/customer')}>
                            Back to Customer Page
                        </Button>
                    </Box>
                </>
            )}
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
                <Typography variant="h4" gutterBottom>
                    Active Orders
                </Typography>
                {renderList()}
            </Box>
        </>
    );
};

export default CustomerOrders;