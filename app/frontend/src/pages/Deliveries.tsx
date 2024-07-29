import React, { useState, useEffect, useRef } from 'react';
import { CircularProgress, List, Typography, AppBar, CssBaseline, Box } from '@mui/material';
import { Snackbar, Alert } from "@mui/material";
import DeliveryItem, { DeliveryItemData } from '../components/DeliveryItem';
import deliveryService from '../services/deliveryService';
import '@turf/boolean-point-in-polygon';
import ConfirmationPopup from '../components/ConfirmationPopUp';
import NavBar from '../components/Navbar';
import settingService from '../services/settingService';

const Deliveries: React.FC = () => {
  const { data: deliveriesData, isSuccess, isLoading, isError } = deliveryService.getDeliveries().useQuery();
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DeliveryItemData | null>(null);
  const [snackbars, setSnackbars] = useState<{ key: number; message: string }[]>([]);
  const previousItemsRef = useRef<DeliveryItemData[]>([]);
  const isFirstRenderRef = useRef(true);

  const items: DeliveryItemData[] = !isSuccess ? [] :
    Object.keys(deliveriesData.data).map(d => {
      let item = deliveriesData.data[d];
      return {
        restaurant: item.restaurant.restaurantName,
        pay: item.courierSplit,
        location: item.restaurant.location,
        dropOff: item.tracking.dropOff,
        dropOffName: item.tracking.dropOffName,
        itemCount: Object.entries(item.order.items).length,
        distanceText: item.estimates?.distance ?? 'Distance unknown',
        timeText: item.estimates?.time ?? 'No time estimate',
        id: d
      }
    })

  const parseDistanceText = (distanceText: string): number => {
    const distance = parseFloat(distanceText);
    return distanceText.includes('km') ? distance * 1000 : 0;
  };

  // get user role and notification settings
  const { data: settingsData, isLoading: settingLoad } = settingService.getNotificationSettings().useQuery();
  const { data: roleData, isLoading: roleLoad } = settingService.getRoleSettings().useQuery();

  useEffect(() => {
    // only subscribe to notification if notification and role settings are enabled for courier
    if (!settingsData?.notification_settings?.courierNotifications || !roleData?.role_settings?.courierRole) {
      return
    }
    if (isSuccess) {
      // prevent notification on first render
      if (isFirstRenderRef.current) {
        isFirstRenderRef.current = false;
      } else {
        const previousItems = previousItemsRef.current;
        // prevent notification on item removals
        if (items.length > previousItems.length) {
          const newItem = items[items.length - 1];
          const distance = parseDistanceText(newItem.distanceText);
          
          // notify if distance is less than 100m
          if (distance <= 100) {
            setSnackbars((prev) => [
              ...prev,
              { key: new Date().getTime(), message: `New delivery from ${newItem.restaurant}, ${newItem.distanceText} (${newItem.timeText}) away has been placed` }
            ]);
          }
        }
      }
      previousItemsRef.current = items;
    }
  }, [items, isSuccess]);

  const handleItemClick = (item: DeliveryItemData) => {
    setSelectedItem(item);
    setPopupOpen(true)
  }

  const handleClose = (key: number) => () => {
    setSnackbars((prev) => prev.filter((snackbar) => snackbar.key !== key));
  };

  const renderList = () => {
    if (isLoading) {
      return <>
        <CircularProgress />
        <Typography>Loading ...</Typography>
      </>
    } else if (isError) {
      return <>Encountered error getting deliveries. Please try again.</>
    } else if (isSuccess) {
      return <List>
        {items.map((item, index) => <DeliveryItem key={index} {...item} handleOnClick={() => handleItemClick(item)} />)}
      </List>
    } else {
      return <><CircularProgress /> Retrieving delivery data ...</>
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <NavBar />
        </AppBar>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '110px' }}>
        <Typography variant="h4" gutterBottom>
          Available Orders
        </Typography>
        {renderList()}
        {selectedItem && <ConfirmationPopup
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          item={selectedItem}
        />}
        {snackbars.map((snackbar, index) => (
          <Snackbar
            key={snackbar.key}
            open={true}
            autoHideDuration={5000}
            onClose={handleClose(snackbar.key)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{ top: `${index * 100}px` }}
          >
            <Alert onClose={handleClose(snackbar.key)} severity="info" sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        ))}
      </div >
        </Box>
    </>
  );
};

export default Deliveries;
