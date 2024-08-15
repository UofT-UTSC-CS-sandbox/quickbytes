import { APIProvider, Map, MapCameraChangedEvent, useMap } from '@vis.gl/react-google-maps';
import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Typography } from "@mui/material";
import styles from './SetDirectionsMap.module.css';
import { lookupBuilding } from '../utils/CampusEncode';
import { Close } from '@mui/icons-material';

interface SingleMarkerMapProps {
    orderId: string,
    initialPosition: { lat: number, lng: number },
    sendSetPickupLocation: ({ lat, lng }: { lat: number, lng: number }) => void,
    rejectLocationChange: () => void
}

export default function SingleMarkerMap({ sendSetPickupLocation, rejectLocationChange, initialPosition }: SingleMarkerMapProps) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const [markerPosition, setMarkerPosition] = useState(initialPosition);
    const [showConfirmCloseMap, setShowConfirmCloseMap] = useState(false);

    const handleConfirmPosition = () => {
        sendSetPickupLocation({
            lat: markerPosition.lat,
            lng: markerPosition.lng
        })
    };

    return (
        <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API has loaded.')}>
            <div className={styles.locationMapLayout} style={{ paddingTop: '160px' }}>
                <div className={styles.leftSideLayout}>
                    <div className={styles.markerDescrip}>
                        <Typography>Drag the red marker to the desired pickup location.</Typography>
                    </div>
                    <div className={styles.addiInfo}>
                        <div className={styles.confirmButton}>
                            <Button variant='contained' onClick={handleConfirmPosition}>Confirm Pickup Location</Button>
                        </div>
                    </div>
                </div>
                <div className={styles.map}>
                    <Map
                        defaultZoom={13}
                        defaultCenter={initialPosition}
                        onCameraChanged={(ev: MapCameraChangedEvent) =>
                            console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                        }
                        style={{ width: '100%', height: '100%' }}
                        restriction={{
                            latLngBounds: {
                                north: 43.79761628441843,
                                south: 43.775626193692666,
                                east: -79.17779162319711,
                                west: -79.19601171604556,
                            },
                            strictBounds: true,
                        }}
                        mapTypeControl={false}
                        streetViewControl={false}
                    >
                        <MarkerAtCenter setMarkerPosition={setMarkerPosition} initialPosition={initialPosition} />
                    </Map>
                </div>
                <Fab sx={{ position: 'absolute', top: 90, right: 20 }} color='error' onClick={() => setShowConfirmCloseMap(true)}>
                    <Close />
                </Fab>
                <Dialog
                    open={showConfirmCloseMap}
                    onClose={() => setShowConfirmCloseMap(false)}
                >
                    <DialogTitle>{"Discard changes?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Your new pickup location is not saved. Are you sure you want to cancel your changes?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => rejectLocationChange()} color="error">Discard</Button>
                        <Button onClick={() => setShowConfirmCloseMap(false)} autoFocus color="primary">Keep Editing</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </APIProvider >
    );
}


/* Adds a marker at the center of the map */
type MarkerAtCenterProps = {
    setMarkerPosition: React.Dispatch<React.SetStateAction<{ lat: number, lng: number }>>;
    initialPosition: { lat: number, lng: number };
};

const MarkerAtCenter: React.FC<MarkerAtCenterProps> = ({ setMarkerPosition, initialPosition }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const marker = new google.maps.Marker({
            position: initialPosition,
            map: map,
            title: 'Dropoff Marker - Drag this marker to set your delivery location.',
            draggable: true
        });

        const infoWindow = new google.maps.InfoWindow({
            content: 'Dropoff Marker - Drag this marker to set your delivery location.'
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        marker.addListener('dragend', () => {
            const position = marker.getPosition();
            if (position) {
                setMarkerPosition({ lat: position.lat(), lng: position.lng() });
            }
            infoWindow.close();
            const dropOffLat = position?.lat();
            const dropOffLng = position?.lng();
            if (dropOffLat && dropOffLng) {
                const building = lookupBuilding(dropOffLat, dropOffLng);

                infoWindow.setContent(`
                <div class=${styles.infoWindowContent}>
                    <h3>Delivery Location</h3>
                    ${building?.name || 'On campus'} <br/>
                    Coordinates: ${dropOffLat}, ${dropOffLng}
                </div>`);
            }
            infoWindow.open(map, marker);
        });

        return () => {
            marker.setMap(null); // Remove the marker if the component is unmounted
        };
    }, [map]);

    return null;
}