import React from 'react';
import { CircularProgress, List, Typography } from '@mui/material';
import DeliveryItem from '../components/DeliveryItem';
import deliveryService from '../services/deliveryService';

const Deliveries: React.FC = () => {
  interface Coordinate {
    lng: number,
    lat: number
  }
  interface DeliveryItem {
    id: string;
    restaurant: string;
    pay: number;
    location: string;
    dropOff: Coordinate;
  }

  const { data: deliveriesData, isSuccess, isLoading, isError } = deliveryService.getDeliveries().useQuery();
  const items: DeliveryItem[] = !isSuccess ? [] :
    Object.keys(deliveriesData.data).map(d => {
      let item = deliveriesData.data[d];
      return {
        restaurant: item.restaurant.restaurantName,
        pay: item.courierSplit,
        location: item.restaurant.location,
        dropOff: item.tracking.dropOff,
        id: d
      }
    })

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
        {items.map((item, index) => (
          <DeliveryItem
            id={item.id}
            key={index}
            restaurant={item.restaurant}
            location={item.location}
            pay={item.pay}
            dropOff={item.dropOff}
          />
        ))}
      </List>
    } else {
      return <><CircularProgress /> Retrieving delivery data ...</>
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Available Orders
      </Typography>
      {renderList()}
    </div >
  );
};

export default Deliveries;
