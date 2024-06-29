import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { database, ref, onValue } from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import DirectionsMap from '../components/DirectionsMap';
import NavBar from '../components/Navbar';
import OrderStatus from '../model/OrderStatus';
import { getCustomerActiveOrder } from '../middleware';

function OrderTracking() {
    useEffect(() => {
        const auth = getAuth();

        // get current user uid and order id then listen for changes in order status
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userid = user.uid;
                getCustomerActiveOrder(userid).then((response) => {
                    response.json().then((data) => {
                        const orderid = data.data;
                        const dataRef = ref(database, `orders/${orderid}/tracking/status`);

                        const unsubscribeData = onValue(dataRef, (snapshot) => {
                            const data = snapshot.val();
                            showNotification(data);
                            console.log('Data from Firebase:', data);
                        });

                        return () => unsubscribeData();
                    });
                });
            } else {
                console.log('No user is signed in.');
            }
        });

        return () => unsubscribeAuth();
    }, []);

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
