import React from 'react';
import { CircularProgress, List, Typography, ListItem, Box, Button } from '@mui/material';
import orderService from '../services/orderService';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './Navbar';
import OrderStatus from '../model/OrderStatus';
import { convertOrderStatusToString } from '../model/OrderStatus';

const CourierDelivery: React.FC<{ isDrawer?: boolean, onClose?: () => void }> = ({ isDrawer = false, onClose }) => {
    const navigate = useNavigate();

    const { data: deliveries, isLoading, isError } = orderService.getUserActiveDelivery().useQuery();

    useEffect(() => {
        if (deliveries) {
            console.log('Delivery data:', deliveries);
        }
    }, [deliveries]);

    const formatDateTime = (dateTime: string | number) => {
        const date = new Date(dateTime);
        return date.toLocaleString();
    };

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
                <Typography align="center">Encountered error getting delivery. Please try again.</Typography>
            );
        } else if (deliveries && deliveries.data) {
            const deliveryItems = Array.isArray(deliveries.data) ? deliveries.data : [deliveries.data];
            return (
                <List>
                    {deliveryItems.map((delivery) => (
                        <Box
                            key={delivery.orderId}
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
                            <List>
                                {delivery.order?.items && Object.keys(delivery.order.items).map((itemId) => (
                                    <ListItem key={itemId} style={{ paddingLeft: 0 }}>
                                        <Typography variant="body2">
                                            <span style={{ fontWeight: 'bold' }}>Item:</span> {`${delivery.order.items[itemId].menuItemId}, Quantity: ${delivery.order.items[itemId].quantity}`}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    ))}
                </List>
            );
        } else {
            return (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <CircularProgress />
                    <Typography>Retrieving delivery data ...</Typography>
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
