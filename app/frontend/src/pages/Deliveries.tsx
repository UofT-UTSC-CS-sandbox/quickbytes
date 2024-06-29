import React, { useEffect, useState } from 'react';
import { List, Typography } from '@mui/material';
import DeliveryItem from '../components/DeliveryItem';
import { getDeliveries } from '../middleware';

const Deliveries: React.FC = () => {
  interface Coordinate {
    lng: number,
    lat: number
  }
  interface DeliveryItem  {
    id: string;
    restaurant: string;
    pay: number;
    location: string;
    dropOff: Coordinate;
  }
  const [items, setItems] = useState<DeliveryItem[]>([]);

  useEffect(() => {
    getDeliveries().then((res) => res.json())
    .then(data => {
      let deliveryItems: DeliveryItem[] = [];
      console.log(data.data);
      Object.keys(data.data).forEach(d => {
        let item = data.data[d];
        deliveryItems.push({
          restaurant: item.restaurant.restaurantName,
          pay: item.courierSplit,
          location: item.restaurant.location,
          dropOff: item.tracking.dropOff,
          id: d
        })
      });
      console.log(deliveryItems);
      setItems(deliveryItems);
    })
  }, []);

  return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Available Orders
      </Typography>
      <List>
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
    </div>
  );
};

export default Deliveries;
