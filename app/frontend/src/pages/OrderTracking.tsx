import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { database, ref, onValue } from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import DirectionsMap from '../components/DirectionsMap';
import NavBar from '../components/Navbar';
import OrderStatus from '../model/OrderStatus';
import deliveryService from '../services/deliveryService';

function OrderTracking() {
    const [userId, setUserId] = useState('');

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

    // listen to changes in the order status and show a notification
    useEffect(() => {
        if (orderData) {
            const orderId = orderData.data;
            const dataRef = ref(database, `orders/${orderId}/tracking/status`);

            const unsubscribeData = onValue(dataRef, (snapshot) => {
                const data = snapshot.val();
                showNotification(data);
                console.log('Data from Firebase:', data);
            });

            return () => unsubscribeData();
        }
    }, [orderData]);
    
    const getNotificationMessage = (data: any) => {
        if (!data) return 'New update available';

        switch (data) {
            case OrderStatus.ORDERING:
                return 'You are currently ordering. Add or remove items from your cart.';
            case OrderStatus.ORDERED:
                return 'Your order has been placed!';
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

    return (
        <div>
            <NavBar />
            <DirectionsMap />
            <ToastContainer />
        </div>
    );
}

export default OrderTracking;
