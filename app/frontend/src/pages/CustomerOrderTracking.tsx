import { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText, Button, Stack } from '@mui/material';
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
import { ActiveOrderItem } from '../services/deliveryService';
import MasterMap from '../components/MasterMap';


// The default pickup location if none is available from the order
const DEFAULT_PICKUP_LOCATION = { lat: 43.785171372795524, lng: -79.18748160572729 };


function CustomerOrderTracking() {
  const [orderData, setOrderData] = useState<ActiveOrderItem | null>(null);
  const [directionsAvailable, setDirectionsAvailable] = useState<Boolean>(false);
  const [updatingLocation, setUpdatingLocation] = useState<Boolean>(false);
  const { data: order, isSuccess: orderSuccess, isLoading: orderLoading } = deliveryService.getCustomerActiveOrder().useQuery();
  const { data: setPickupLocationResponse, mutate: sendSetPickupLocation } = orderService.setPickupLocation(
    orderData?.orderId as string,
    (data) => {
      setUpdatingLocation(false);
    }
  ).useMutation()
  useEffect(() => {
    console.log(order)
    if (orderSuccess) {
      setOrderData(order.data);
    }
    
  }, [order]);

  const nav = useNavigate();
  useEffect(() => {
    console.log(orderData)
    const dataRef = ref(database, `orders/${orderData?.orderId}/tracking/status`);
    const unsubscribeData = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      // can only have either one active delivery or order at one time, if no active order then don't show any notifications
      if (!data || data == OrderStatus.ORDERING) return;
      setDirectionsAvailable(data != OrderStatus.CANCELLED && data != OrderStatus.ORDERING && data != OrderStatus.ORDERED);
    });

    return () => unsubscribeData();

  }, [order, orderSuccess, orderData]);

  const { mutate: updateOrderStatus } = deliveryService.updateOrderStatus((d) => {
    // Courier returns to delivery page upon cancellation, customer to home page
    nav("/");
  }).useMutation();

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
          {Object.keys(orderData.order.items).map((itemId, index) => (
            <ListItem style={{ textAlign: 'center' }} key={index}>
              <ListItemText primary={order?.data.order.items[itemId].menuItemId} />
            </ListItem>
          ))}
        </List>
        <Typography variant="body1" gutterBottom>
          <strong>Delivery fee:</strong> ${order?.data.courierSplit}
        </Typography>

        <Typography variant="body2" style={{ marginTop: 10, textAlign: 'center', fontStyle: 'italic' }}>
          {directionsAvailable ? "Your courier is on the way with your order!" : 
                                    "Your order has been succesfully placed. Looking for a courier..."}
        </Typography>
        {directionsAvailable ? null : <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Button variant="contained" color="primary" onClick={() => setUpdatingLocation(true)}> {/* TODO add a pop-up to reselect pickup location */}
            Update pickup location
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => {
            if (order) {
              const confirmed = window.confirm('Are you sure you want to cancel this order?');
              if (confirmed) {
                const orderId = order.data.orderId;
                const newStatus = OrderStatus.CANCELLED;

                updateOrderStatus({ orderId: orderId, status: newStatus, courierRequest: false });
              }
            }
          }} style={{ marginLeft: 10 }}>
            Cancel Order
          </Button>
        </div>}

      </div>
    );
  }

  const getView = () => {
    if (orderData == null)
      return null;
    if (directionsAvailable) {
      return (
        <div style={{ height: "100vh", width: "100%", display: "flex" }}>
          <NavBar/>
          <div style={{ width: "300px", background: "#f4f4f4", padding: "10px" }}>
            {OrderSummary()}
          </div>
          <div style={{ flex: 1 }}>
            <MasterMap dest={orderData.tracking.dropOff} />
          </div>
        </div>)
    }
    if (updatingLocation) {
      return (<div style={{ height: "100vh", width: "100%", display: "flex" }}>
        <NavBar/>
      <SingleMarkerMap
        sendSetPickupLocation={sendSetPickupLocation}
        rejectLocationChange={() => setUpdatingLocation(false)}
        orderId={orderData.orderId}
        initialPosition={orderData.tracking.dropOff}
      /></div>);
    }
    return (<div style={{ height: "100vh", width: "100%", display: "flex" }}>
       <NavBar/>
      <OrderSummary />
     </div>)
  }

  return (getView())
};

export default CustomerOrderTracking;
