import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Alert, List } from '@mui/material';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useAuth } from '../AuthContext';
import deliveryService from '../services/deliveryService';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import currencyFormatter from './CurrencyFormatter';
import { DeliveryItemData } from './DeliveryItem';

interface ConfirmationPopupProps {
  open: boolean;
  onClose: () => void;
  item: DeliveryItemData
}

type Coordinates = {
  lat: string,
  lng: string
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ open, onClose, item }) => {
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const { currentUser } = useAuth();
  const handleClose = () => {
    onClose();
  };
  
  const { mutate: acceptDelivery, isPending, isError, isSuccess } = deliveryService.acceptDelivery((d) => onSuccess(d.pickupCoordinates)).useMutation();

  const handleConfirm = () => {
    if (currentUser) acceptDelivery({
      userId: currentUser.uid,
      orderId: item.id
    });
  };

  const onSuccess = (d: Coordinates) => {
    // Force the deliveries page to refresh to hide the accepted delivery
      queryClient.invalidateQueries({
        queryKey: deliveryService.getDeliveries().key
      });

    // Close the confirmation popup
    nav('/tracking/' + String(d.lng) + "_" + String(d.lat) + "?courier=true");
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

  const renderConfirmButton = () => {
    if (isSuccess) {
      return <Alert severity="success">Accepted</Alert>
    } else {
      return <>
        <Button onClick={handleConfirm} disabled={isPending} color="success" autoFocus startIcon={isPending ? <CircularProgress /> : undefined}>
          {isPending ? "Confirming ..." : "Confirm"}
        </Button>
        {isError && <Alert severity='error'>Unexpected error. Please try again.</Alert>}
      </>
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Selection</DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontWeight: 'bold' }}>Restaurant:</p>
          <p>{item.restaurant} ({item.location})</p>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontWeight: 'bold' }}>Size of Order:</p>
          <p>{item.itemCount} {item.itemCount === 1 ? 'item' : 'items'}</p>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontWeight: 'bold' }}>Pay:</p>
          <p>{currencyFormatter.format(item.pay)}</p>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontWeight: 'bold' }}>Drop-off:</p>
          <p>{item.dropOffName ?? "On Campus"}</p>
          <p>{(item.distanceText && item.timeText) && `Approx. ${item.distanceText} (${item.timeText}) from restaurant`}</p>
          <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API has loaded.')}>
            <div className='map-container'>
              <Map
                id={'map'}
                defaultZoom={17}
                style={{ width: '40%', height: '75%' }}
                defaultCenter={item.dropOff}
                mapTypeControl={false}
                streetViewControl={false}>
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
        {renderConfirmButton()}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationPopup;
