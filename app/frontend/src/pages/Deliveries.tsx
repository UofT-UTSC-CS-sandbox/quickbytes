import React, { useState } from 'react';
import { CircularProgress, List, Typography } from '@mui/material';
import DeliveryItem, { DeliveryItemData } from '../components/DeliveryItem';
import deliveryService from '../services/deliveryService';
import '@turf/boolean-point-in-polygon';
import ConfirmationPopup from '../components/ConfirmationPopUp';
import NavBar from '../components/Navbar';

const Deliveries: React.FC = () => {
  const { data: deliveriesData, isSuccess, isLoading, isError } = deliveryService.getDeliveries().useQuery();
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DeliveryItemData | null>(null);

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

  const handleItemClick = (item: DeliveryItemData) => {
    setSelectedItem(item);
    setPopupOpen(true)
  }

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
      <NavBar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Available Orders
        </Typography>
        {renderList()}
        {selectedItem && <ConfirmationPopup
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          item={selectedItem}
        />}
      </div >
    </>
  );
};

export default Deliveries;
