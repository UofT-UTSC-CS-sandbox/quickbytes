import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useAuth } from '../AuthContext';
import { acceptDelivery } from '../middleware';

interface Coordinate {
    lng: number;
    lat: number;
}

interface DeliveryItem  {
    id: string;
    restaurant: string;
    pay: number;
    location: string;
    dropOff: Coordinate
}

interface ConfirmationPopupProps {
    open: boolean;
    onClose: ()=>void;
    item: DeliveryItem
}



const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ open, onClose, item }) => {
    const { currentUser } = useAuth();
    const handleClose = () => {
        onClose();
    };

    const handleConfirm = () => {
        console.log(item);
        console.log(currentUser?.uid);
        if (currentUser) acceptDelivery(currentUser.uid, item.id);
        
        onClose();
    };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Selection</DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontWeight: 'bold' }}>Restaurant:</p>
          <p>{item.restaurant}</p>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontWeight: 'bold' }}>Location:</p>
          <p>{item.location}</p>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontWeight: 'bold' }}>Pay:</p>
          <p>${item.pay}</p>
        </div>
        <div style={{ marginBottom: '16px' }}>
            <p style={{ fontWeight: 'bold' }}>Drop-off:</p>
            <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API has loaded.')}>
                <div className='map-container'>
                    <Map
                    id={'map'}
                    defaultZoom={17}
                    style={{ width: '40%', height: '75%' }}
                    defaultCenter={item.dropOff}>
                        <Marker
                            position={item.dropOff}>
                        </Marker>
                    </Map>
                </div>
                </APIProvider>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="success" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationPopup;
