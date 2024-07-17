import { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { database, ref, onValue } from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import DirectionsMap from '../components/DirectionsMap';
import NavBar from '../components/Navbar';
import OrderStatus from '../model/OrderStatus';
import deliveryService from '../services/deliveryService';
import settingService from '../services/settingService';
import restaurantService from '../services/restaurantService';
import orderService from '../services/orderService';

function OrderTracking({ directionsMapComponent }) {
    const [userId, setUserId] = useState('');
    const { coord } = useParams();
    const [open, setOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    useEffect(() => {
        const auth = getAuth();

        // get current user uid from firebase
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                console.log('No user is signed in.');
            }
        });
        return () => unsubscribeAuth();
    }, []);

    // get the active orderId of the customer
    const { data: orderData, error } = deliveryService.getCustomerActiveOrder(userId).useQuery();

    // get user notification settings
    const { data: settingsData } = settingService.getNotificationSettings(userId).useQuery();
    // listen to changes in the order status and show a notification
    useEffect(() => {
        // only subscribe to notification if notification settings are enabled for customer
        if (orderData && settingsData.notification_settings.customerNotifications) {
            const orderId = orderData.data;
            const dataRef = ref(database, `orders/${orderId}/tracking/status`);

            const unsubscribeData = onValue(dataRef, (snapshot) => {
                const data = snapshot.val();
                // can only have either one active delivery or order at one time, if no active order then don't show any notifications
                if (!data || data==OrderStatus.ORDERING ) return;
                showNotification(data);
                console.log('Data from Firebase:', data);
            });

            return () => unsubscribeData();
        }
    }, [orderData]);
    
    const getNotificationMessage = (data: any) => {
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
        const message = getNotificationMessage(data);
        setNotificationMessage (message);
        setOpen(true);
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    return (
        <div>
            <NavBar />
            {directionsMapComponent}
            <Snackbar 
                open={open} 
                autoHideDuration={5000} 
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                    {notificationMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default OrderTracking;
