/**
 * Screen for staff workers to view all activeOrders
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { database, ref, onValue } from '../firebaseConfig';
import { Accordion, AccordionDetails, AccordionSummary, Alert, CircularProgress, Container, Divider, List, Typography, Snackbar } from "@mui/material";
import StaffOrderItem from "../components/StaffOrderItem";
import NavBar from "../components/Navbar";
import OrderStatus, { convertOrderStatusToString } from "../model/OrderStatus";
import { ArrowDropDown } from "@mui/icons-material";
import restaurantService, { ActiveOrderItem } from "../services/restaurantService";
import { Unsubscribe } from "firebase/database";

const StaffOrders = () => {

    const { restaurantId } = useParams();
    const { data, isLoading, isError, isSuccess } = restaurantService.getRestaurantActiveOrders(restaurantId).useQuery();
    const [notifications, setNotifications] = useState<string[]>([]);
    const [orders, setOrders] = useState([] as string[]);

    useEffect(() => {
        if (data) {
            const ids = data.data.map(order => order.orderId);
            setOrders(ids);
        }
    }, [data]);

    useEffect(() => {
        const unsubscribeFunctions: Unsubscribe[] = [];
        if (orders.length > 0) {
            orders.forEach(orderId => {
                const dataRef = ref(database, `orders/${orderId}/tracking/status`);

                const unsubscribeData = onValue(dataRef, (snapshot) => {
                    const data = snapshot.val();
                    if (!data || data != OrderStatus.ARRIVED) return;
                    showNotification(orderId);
                    console.log('Data from Firebase:', data);
                });

                unsubscribeFunctions.push(unsubscribeData);
            });
        }

        return () => {
            unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
        };
    }, [orders]);

    const getNotificationMessage = (orderId: string) => {
        return `Courier for Order ${orderId} has arrived`;
    };

    const showNotification = (orderId: string) => {
        const message = getNotificationMessage(orderId);
        setNotifications((prev) => [...prev, message]);
    };

    const handleClose = (index: number) => (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setNotifications((prev) => prev.filter((_, i) => i !== index));
    };

    const ordersByStatus: Record<string, ActiveOrderItem[]> = data?.data.reduce((acc: Record<string, ActiveOrderItem[]>, order: ActiveOrderItem) => {
        acc[order.tracking.status] = acc[order.tracking.status] || [];
        acc[order.tracking.status].push(order);
        return acc;
    }, Object.create(null)) ?? Object.create(null);

    const renderEntries = (orders: ActiveOrderItem[]) => {
        return <List>
            {orders.map((order: ActiveOrderItem) => <StaffOrderItem key={order.orderId} order={order} restaurantId={restaurantId} />)}
        </List>
    }

    const renderList = (orders: Record<string, ActiveOrderItem[]>) => {
        if (isLoading) {
            return <>
                <CircularProgress /> <Typography>Loading ...</Typography>
            </>
        } else if (isError) {
            return <Alert severity="error">Error fetching orders</Alert>
        } else if (isSuccess) {
            const desiredOrder: string[] = [OrderStatus.CANCELLED, OrderStatus.ORDERED, OrderStatus.ACCEPTED, OrderStatus.AWAITING_PICK_UP, OrderStatus.EN_ROUTE, OrderStatus.DELIVERED, OrderStatus.ORDERING];
            const sortedOrder = Object.entries(orders).sort((a, b) => desiredOrder.indexOf(a[0]) - desiredOrder.indexOf(b[0]));
            return sortedOrder.map(([key, value]) => {
                return <Accordion defaultExpanded key={`${key}list`}>
                    <AccordionSummary sx={{ textAlign: 'left', fontSize: '1.4rem', padding: '16px' }} expandIcon={<ArrowDropDown />}>
                        {convertOrderStatusToString(key as OrderStatus)}
                    </AccordionSummary>
                    <AccordionDetails>
                        {renderEntries(value)}
                    </AccordionDetails>
                </Accordion>
            })

        }
    }

    return <>
        <NavBar />
        <div style={{ width: '100%' }}>
            <Container sx={{ textAlign: 'left', fontSize: '1.8rem', padding: '16px' }} maxWidth="lg">
                <Typography sx={{ textAlign: 'left', fontSize: '2.5rem' }} variant="h1" gutterBottom>
                    Active Orders for Your Restaurant
                </Typography>
                <Divider />
                {renderList(ordersByStatus)}
            </Container>
        </div>
        {notifications.map((message, index) => (
            <Snackbar
                key={index}
                open={true}
                autoHideDuration={5000}
                onClose={handleClose(index)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                sx={{ top: `${index * 100}px` }} 
            >
                <Alert onClose={handleClose(index)} severity="info" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        ))}
    </>
}

export default StaffOrders;
