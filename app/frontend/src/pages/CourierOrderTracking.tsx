import { useEffect, useState } from 'react';
import { Box, Drawer, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import NavBar from '../components/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import deliveryService from '../services/deliveryService';
import trackingService from '../services/trackingService';


// The default pickup location if none is available from the order

import { ActiveOrderItem } from '../services/deliveryService';
import MasterMap from '../components/MasterMap';


function CourierOrderTracking() {
  const [orderData, setOrderData] = useState<ActiveOrderItem | null>(null);
  const { data: order, isSuccess: orderSuccess, isLoading: orderLoading } = deliveryService.getCourierActiveOrder().useQuery();
  const { data: location, isSuccess: locationSuccess, isError } = trackingService.getRestaurantLocation(orderData?.orderId as string | null).useQuery();

  
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
