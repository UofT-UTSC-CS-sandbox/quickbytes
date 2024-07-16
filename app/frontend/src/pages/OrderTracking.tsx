import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import { Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import NavBar from '../components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { database, ref, onValue } from '../firebaseConfig';
import OrderStatus from '../model/OrderStatus';
import deliveryService from '../services/deliveryService';
import Notification from '../components/Notification';
import orderService from '../services/orderService';

const OrderTracking = ({ directionsMapComponent }) => {
    const [userId, setUserId] = useState('');
    const { coord } = useParams();
    const [orderId, setOrderId] = useState<string | null>(null);
    const [directionsAvailable, setDirectionsAvailable] = useState(true);

    useEffect(() => {
        const auth = getAuth();

        // Get current user uid from Firebase
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                console.log('No user is signed in.');
            }
        });
        return () => unsubscribeAuth();
    }, []);

    // Get the active orderId of the customer
    const { data: orderData, error } = deliveryService.getCustomerActiveOrder(userId).useQuery();
    const { data: order } = orderService.getClientActiveOrders(userId).useQuery();

    // listen to changes in the order status and show a notification
    useEffect(() => {
        if (orderData) {
            const orderId = orderData.data;
            setOrderId(orderId);
            const dataRef = ref(database, `orders/${orderId}/tracking/status`);

            const unsubscribeData = onValue(dataRef, (snapshot) => {
                const data = snapshot.val();
                // can only have either one active delivery or order at one time, if no active order then don't show any notifications
                if (!data || data==OrderStatus.ORDERING ) return;
                showNotification(data);
                setDirectionsAvailable(data == OrderStatus.ACCEPTED);
                console.log('Data from Firebase:', data);
            });

            return () => unsubscribeData();
        }
    }, [orderData]);

    const getNotificationMessage = (path: string, data: any) => {
        switch (data) {
            case OrderStatus.ORDERED:
                return 'Waiting for a courier to accept your order.';
            case OrderStatus.ACCEPTED:
                return 'A courier has accepted your order!';
            case OrderStatus.AWAITING_PICK_UP:
                return 'Your order is now waiting for pickup!';
            case OrderStatus.EN_ROUTE:
                return 'Your order is on its way!';
            case OrderStatus.DELIVERED:
                return 'Your order has been delivered!';
            case OrderStatus.CANCELLED:
                return 'Your order has been cancelled.';
            default:
                return 'There is an update on your order.';
        }
    };

    const showNotification = (data: any) => {
        const message = getNotificationMessage("", data);
        toast.info(message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const nav = useNavigate();
    const {mutate: updateOrderStatus} = deliveryService.updateOrderStatus((d) => {
        console.log(d.message)
        // Courier returns to delivery page upon cancellation, customer to home page
        nav("/");
      }).useMutation();
      const handleCancelOrder = () => {
        if (orderData) {
          const confirmed = window.confirm('Are you sure you want to cancel this order?');
          if (confirmed) {
            const orderId = orderData.data;
            const newStatus = OrderStatus.CANCELLED;
            /* TODO: ensure order has not been picked up. */
            updateOrderStatus({ orderId: orderId, status: newStatus, courier: false });
          }
        }
      };

      /* This component will be displayed when courier tracking is not yet available */
      const OrderSummary = () => {
        return (
          <div style={{ maxWidth: 600, margin: 'auto', padding: 20, border: '1px solid #ccc', borderRadius: 5, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Restaurant:</strong> {order?.data.restaurant.restaurantName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Items:</strong>
            </Typography>
            <List style={{ textAlign: 'center' }}>
                {Object.keys(order?.data.order.items).map((itemId, index) => (
                    <ListItem style={{ textAlign: 'center' }} key={index}>
                        <ListItemText primary={order?.data.order.items[itemId].menuItemId} />
                    </ListItem>
                ))}
            </List>
            <Typography variant="body1" gutterBottom>
              <strong>Delivery fee:</strong> ${order?.data.courierSplit}
            </Typography>

            <Typography variant="body2" style={{ marginTop: 10, textAlign: 'center', fontStyle: 'italic' }}>
                Your order has been succesfully placed. Looking for a courier...
            </Typography>
      
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <Button variant="contained" color="primary" onClick={console.log}> {/* TODO add a pop-up to reselect pickup location */}
                Update pickup location
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCancelOrder} style={{ marginLeft: 10 }}>
                Cancel Order
              </Button>
            </div>
          </div>
        );
      }

    return (
        <div>
            <NavBar />
            {directionsAvailable ? directionsMapComponent : <OrderSummary />}
            {orderId && (
                <Notification
                    subscribePaths={[`orders/${orderId}/tracking/status`]}
                    getNotificationMessage={getNotificationMessage}
                />
            )}
            <ToastContainer />
        </div>
    );
};

export default OrderTracking;
