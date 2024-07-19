import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { database, ref, onValue } from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import DirectionsMap from '../components/DirectionsMap';
import NavBar from '../components/Navbar';
import OrderStatus from '../model/OrderStatus';
import deliveryService from '../services/deliveryService';
import useCurrentLocation from '../services/currentLocationServiceCustomer';


import restaurantService from '../services/restaurantService';
import orderService from '../services/orderService';

function OrderTracking() {
    const [userId, setUserId] = useState('');
    const { coord } = useParams();




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
    console.log(userId, "this is the current user id logged in")
    
    //The DirectionsMap wont have the userid fixed once roles such as customer,courier,and restaurant are established
    //Additionally, the getOrders function should change to restaurantService.getRestaurantActiveOrders if the restaurant is viewing
    //And useCurrentLocation should change based on if the courier or customer/restaurant is using the view
    return (
        <div>
            <NavBar />
            <DirectionsMap id={"1"} getOrders={orderService.getClientActiveOrders} useCurrentLocation={useCurrentLocation} />
            <ToastContainer />
        </div>
    );
}

export default OrderTracking;
