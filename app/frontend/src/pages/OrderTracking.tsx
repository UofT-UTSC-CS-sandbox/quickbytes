import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import DirectionsMap from '../components/DirectionsMap';
import NavBar from '../components/Navbar';
import OrderStatus from '../model/OrderStatus';
import deliveryService from '../services/deliveryService';
import Notification from '../components/Notification';

const OrderTracking = ({ directionsMapComponent }) => {
    const [userId, setUserId] = useState('');
    const { coord } = useParams();
    const [orderId, setOrderId] = useState<string | null>(null);

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

    useEffect(() => {
        if (orderData) {
            setOrderId(orderData.data);
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

    return (
        <div>
            <NavBar />
            {directionsMapComponent}
            {orderId && (
                <Notification
                    subscribePaths={[`orders/${orderId}/tracking/status`]}
                    getNotificationMessage={getNotificationMessage}
                />
            )}
        </div>
    );
};

export default OrderTracking;
