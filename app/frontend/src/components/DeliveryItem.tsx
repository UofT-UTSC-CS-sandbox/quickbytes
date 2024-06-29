import React, {useState} from 'react';
import { ListItem, ListItemText, Button } from '@mui/material';
import ConfirmationPopup from './ConfirmationPopUp';

interface Coordinate {
  lng: number;
  lat: number;
}

interface DeliveryItem {
  restaurant: string;
  id: string;
  location: string;
  pay: number;
  dropOff: Coordinate;
}

const DeliveryItem: React.FC<DeliveryItem> = ({ id, restaurant, location, pay, dropOff }) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({ id, restaurant, location, pay, dropOff });

  const handleClick = () => {
    setSelectedItem({ id, restaurant, location, pay, dropOff });
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  return (
    <>
      <ListItem
        style={{
          borderBottom: '1px solid #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={restaurant}
            secondary={`Location: ${location}`} // Displaying location as secondary text
          />
        </div>

        <div style={{ marginLeft: '16px', fontWeight: 'bold' }}>
          ${pay}
        </div>

        <Button variant="contained" color="success" onClick={handleClick}>
          Accept
        </Button>
      </ListItem>

      <ConfirmationPopup
        open={popupOpen}
        onClose={handleClosePopup}
        item={selectedItem}
      />
    </>
  );
};

export default DeliveryItem;
