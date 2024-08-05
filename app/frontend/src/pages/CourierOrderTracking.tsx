import { useEffect, useState } from 'react';
import { Box, Drawer, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import deliveryService from '../services/deliveryService';
import trackingService from '../services/trackingService';
import settingService from '../services/settingService';
import OrderStatus from '../model/OrderStatus';


// The default pickup location if none is available from the order

import { ActiveOrderItem } from '../services/deliveryService';
import MasterMap from '../components/MasterMap';


function CourierOrderTracking() {
  const [orderData, setOrderData] = useState<ActiveOrderItem | null>(null);
  const { data: order, isSuccess: orderSuccess, isLoading: orderLoading } = deliveryService.getCourierActiveOrder().useQuery();
  const { data: location, isSuccess: locationSuccess, isError } = trackingService.getRestaurantLocation(orderData?.orderId as string | null).useQuery();
  const { data: roleData } = settingService.getRoleSettings().useQuery();
  
  const {mutate: updateOrderStatus} = deliveryService.updateOrderStatus((d) => {
    console.log(d.message)
  }).useMutation();
  
  const courier = roleData.role_settings.courierRole
  const nav = useNavigate();

  const handleUpdateStatus = () => {
    if (orderData) {
      console.log(orderData)
      const orderId = orderData.orderId; 
      const newStatus = OrderStatus.EN_ROUTE; // change later to change status depending on where in the workflow
      updateOrderStatus({ orderId: orderId, status: newStatus, courierRequest: courier });
    }
  };

  const handleCancelOrder = () => {
    if (orderData) {
      const confirmed = window.confirm('Are you sure you want to cancel this order?');
      if (confirmed) {
        const orderId = orderData.orderId;
        const newStatus = OrderStatus.CANCELLED;
        /* TODO: ensure order has not been picked up. */
        updateOrderStatus({ orderId: orderId, status: newStatus, courierRequest: courier });
        nav('/deliveries')
      }
    }
  };
  
  useEffect(() => {
    if (orderSuccess) {
      setOrderData(order.data);
    }
    
  }, [order]);

  useEffect(() => {
    console.log(isError)
    if (locationSuccess)
      console.log(location);
  }, [location, locationSuccess, orderData]);


  const SidePanel = () => {
    if (!orderData) return null;
    
    return (
      <Box 
        p={2} 
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '100%' }}
      >
        <Box style={{ marginTop: '100px' }}>
          <Typography variant="h6">Order Details</Typography>
          <List>
            <ListItem>
              <ListItemText primary="Restaurant" secondary={orderData.restaurant.restaurantName} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Pickup Location" secondary={`${orderData.restaurant.location}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Delivery Fee" secondary={`$${orderData.courierSplit}`} />
            </ListItem>
          </List>
        </Box>
        <div>
          <button onClick={handleCancelOrder}>Cancel Order</button>
          {orderData.tracking.status === OrderStatus.AWAITING_PICK_UP ? (<button onClick={handleUpdateStatus}>Notify En-Route</button>) : null}
        </div>
      </Box>
    );
  };

  
  return (
    orderData == null ? <>loading</> : (
      <div style={{ height: "100vh", width: "100%", display: "flex" }}>
        <NavBar/>
        <div style={{ width: "300px", background: "#f4f4f4", padding: "10px" }}>
          {SidePanel()}
        </div>
        <div style={{ flex: 1 }}>
          <MasterMap dest={orderData.tracking.dropOff} />
        </div>
      </div>
    )
  );
};



export default CourierOrderTracking;
