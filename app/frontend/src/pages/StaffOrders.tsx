import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Accordion, AccordionDetails, AccordionSummary, Alert, CircularProgress, Container, Divider, List, Typography } from "@mui/material";
import StaffOrderItem from "../components/StaffOrderItem";
import NavBar from "../components/Navbar";
import OrderStatus, { convertOrderStatusToString } from "../model/OrderStatus";
import { ArrowDropDown } from "@mui/icons-material";
import restaurantService, { ActiveOrderItem } from "../services/restaurantService";
import Notification from "../components/Notification";
import PageHead from "../components/PageHead";

const StaffOrders = () => {
    const { restaurantId } = useParams();
    const { data, isLoading, isError, isSuccess } = restaurantService.getRestaurantActiveOrders(restaurantId).useQuery();
    const [orders, setOrders] = useState([] as string[]);

    useEffect(() => {
        if (data) {
            const ids = data.data.map(order => order.orderId);
            setOrders(ids);
        }
    }, [data]);

    const getNotificationMessage = (path: string, data: any) => {
        const orderId = path.split('/')[1];
        if (data !== OrderStatus.ARRIVED) return '';
        return `Courier for Order ${orderId} has arrived`;
    };

    const getNewOrderNotificationMessage = (path: string, data: any) => {
        return 'A new order has been placed';
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
        <PageHead title="Customer Orders" description="View your active orders" />
        <div style={{ width: '100%', paddingTop: '100px' }}>
            <Container sx={{ textAlign: 'left', fontSize: '1.8rem', padding: '16px' }} maxWidth="lg">
                <Typography sx={{ textAlign: 'left', fontSize: '2.5rem' }} variant="h1" gutterBottom>
                    Active Orders for Your Restaurant
                </Typography>
                <Divider />
                {renderList(ordersByStatus)}
            </Container>
        </div>
        <Notification
            subscribePaths={orders.map(orderId => `orders/${orderId}/tracking/status`)}
            getNotificationMessage={getNotificationMessage}
        />
        <Notification
            subscribePaths={[`restaurants/${restaurantId}/activeOrders`]}
            getNotificationMessage={getNewOrderNotificationMessage}
        />
    </>
}

export default StaffOrders;
