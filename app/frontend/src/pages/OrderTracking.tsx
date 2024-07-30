import { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import NavBar from '../components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { database, ref, onValue } from '../firebaseConfig';
import OrderStatus from '../model/OrderStatus';
import deliveryService from '../services/deliveryService';
import Notification from '../components/Notification';
import settingService from '../services/settingService';
import orderService from '../services/orderService';
import SingleMarkerMap from '../components/SetDirectionsMap';
import trackingService from '../services/trackingService';

// The default pickup location if none is available from the order
const DEFAULT_PICKUP_LOCATION = { lat: 43.785171372795524, lng: -79.18748160572729 };

import DirectionsMap from '../components/DirectionsMap';
import useCurrentLocation from '../services/currentLocationServiceCustomer';


function OrderTracking() {
  const [updatingLocation, setUpdatingLocation] = useState(false);
  const [pickupLocation, setPickupLocation] = useState<{ lat: number, lng: number }>(DEFAULT_PICKUP_LOCATION);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [directionsAvailable, setDirectionsAvailable] = useState(true);


  // Get the active orderId of the customer
  //const { data: orderData, error } = deliveryService.getCustomerActiveOrder().useQuery();
  //const { data: order } = orderService.getClientActiveOrders().useQuery();
  const { data: order } = deliveryService.getCustomerActiveOrder().useQuery();

  // get user role and notification settings
  const { data: settingsData, isLoading: settingLoad } = settingService.getNotificationSettings().useQuery();
  const { data: roleData, isLoading: roleLoad } = settingService.getRoleSettings().useQuery();
  // listen to changes in the order status and show a notification
  useEffect(() => {
    // only subscribe to notification if notification settings are enabled for customer
    if (settingLoad || roleLoad) {
      return;
    }
    if (order && settingsData?.notification_settings?.customerNotifications && roleData?.role_settings?.customerRole) {
      const orderId = order.data.orderId;
      setOrderId(orderId);
      const dataRef = ref(database, `orders/${orderId}/tracking/status`);

      const unsubscribeData = onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        // can only have either one active delivery or order at one time, if no active order then don't show any notifications
        if (!data || data == OrderStatus.ORDERING) return;
        showNotification(data);
        setDirectionsAvailable(data != OrderStatus.CANCELLED && data != OrderStatus.ORDERING && data != OrderStatus.ORDERED);
        console.log('Data from Firebase:', data);
      });

      return () => unsubscribeData();
    }
  }, [order]);

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
  const { mutate: updateOrderStatus } = deliveryService.updateOrderStatus((d) => {
    console.log(d.message)
    // Courier returns to delivery page upon cancellation, customer to home page
    nav("/");
  }).useMutation();
  const handleCancelOrder = () => {
    if (order) {
      const confirmed = window.confirm('Are you sure you want to cancel this order?');
      if (confirmed) {
        const orderId = order.data.orderId;
        const newStatus = OrderStatus.CANCELLED;

        updateOrderStatus({ orderId: orderId, status: newStatus, courierRequest: false });
      }
    }
  };

  // Retreive the current drop off location assigned to the order to display when user changes
  const { data: dropOffLoc, isLoading: dropOffLocLoading } = trackingService.getOrderDropoff(orderId).useQuery();
  useEffect(() => {
    if (dropOffLoc) {
      setPickupLocation({ lat: dropOffLoc.lat, lng: dropOffLoc.lng });
    }
  }, [dropOffLoc]);

  const { data: setPickupLocationResponse, mutate: sendSetPickupLocation } = orderService.setPickupLocation(
    orderId as string,
    (data) => {
      setUpdatingLocation(false);
      setPickupLocation(data.dropOff);
    }
  ).useMutation()

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
          <Button variant="contained" color="primary" onClick={() => setUpdatingLocation(true)}> {/* TODO add a pop-up to reselect pickup location */}
            Update pickup location
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancelOrder} style={{ marginLeft: 10 }}>
            Cancel Order
          </Button>
        </div>
      </div>
    );
  }
  /* The main component of the page */
  const MainView = () => {
    if (directionsAvailable) /* If tracking is available, display on map */

      //The DirectionsMap wont have the userid fixed once roles such as customer,courier,and restaurant are established
      //Additionally, the getOrders function should change to restaurantService.getRestaurantActiveOrders if the restaurant is viewing
      //And useCurrentLocation should change based on if the courier or customer/restaurant is using the view
      return <DirectionsMap getOrders={orderService.getClientActiveOrders2} useCurrentLocation={useCurrentLocation} />;
    else if (updatingLocation) // If the user is attempting to change the location, display map with marker
      return <SingleMarkerMap
        sendSetPickupLocation={sendSetPickupLocation}
        rejectLocationChange={() => setUpdatingLocation(false)}
        orderId={orderId as string}
        initialPosition={pickupLocation}
      />;
    else
      return <OrderSummary /> /* Otherwise there is no tracking available and the location is not
                                        being modified, just display a summary of the order */
  }

  return (
    <div>
      {updatingLocation ? null : <NavBar />}
      {orderId && (
        <Notification
          subscribePaths={[`orders/${orderId}/tracking/status`]}
          getNotificationMessage={getNotificationMessage}
        />
      )}
      <MainView />
      <ToastContainer />
    </div>
  );
};

export default OrderTracking;
