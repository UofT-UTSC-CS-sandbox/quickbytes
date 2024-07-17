import React from 'react';
import { ListItem, ListItemText, Button, List, ListItemAvatar, Avatar, Divider, Stack, ListItemIcon } from '@mui/material';
import currencyFormatter from './CurrencyFormatter';
import { DirectionsWalkRounded, Place, Storefront } from '@mui/icons-material';

interface Coordinate {
  lng: number;
  lat: number;
}

export interface DeliveryItemData {
  restaurant: string;
  id: string;
  location: string;
  pay: number;
  dropOff: Coordinate;
  dropOffName: string;
  itemCount: number;
  distanceText: string,
  timeText: string
}

export interface DeliveryItemProps {
  handleOnClick: () => void
}

const DeliveryItem: React.FC<DeliveryItemData & DeliveryItemProps> = ({ restaurant, location, pay, itemCount, dropOffName, handleOnClick, distanceText, timeText }) => {

  return (
    <>
      <List dense sx={{ width: '100%' }}>
        <ListItem
          style={{ justifyContent: 'space-between' }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems='center' sx={{ width: '100%' }}>
            <ListItemAvatar>
              <Avatar>
                <Place />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{ width: '200px' }}
              primary={restaurant}
              secondary={<span>{`${location}`}<br/>{`${itemCount} ${itemCount > 1 ? 'items' : 'item'}`}</span>} // Displaying location as secondary text
            />

            <div style={{ fontWeight: 'bold', marginRight: '50px' }}>
              {currencyFormatter.format(pay)}
            </div>

            <Button variant="contained" color="success" onClick={handleOnClick}>
              View
            </Button>
          </Stack>
        </ListItem>

        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <Storefront />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={dropOffName ?? 'Dropoff Location'}
            secondary={`${distanceText} (${timeText})`}>
          </ListItemText>
        </ListItem>
      </List>
      <Divider />
    </>
  );
};

export default DeliveryItem;
