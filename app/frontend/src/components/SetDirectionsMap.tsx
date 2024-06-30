import { APIProvider, Map, MapCameraChangedEvent, useMap } from '@vis.gl/react-google-maps';
import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from "@mui/material";
import styles from './SetDirectionsMap.module.css';
import orderService from '../services/orderService';

export default function SingleMarkerMap({ onConfirmPickupLocation, orderId, initialPosition }: { onConfirmPickupLocation: (position: { lat: number, lng: number }) => void, orderId: string, initialPosition: { lat: number, lng: number } }) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const [markerPosition, setMarkerPosition] = useState(initialPosition);
    const [additionalInfo, setAdditionalInfo] = useState("");

    const { mutate: setPickupLocation } = orderService.setPickupLocation(
        orderId,
        () => onConfirmPickupLocation(markerPosition)
    ).useMutation()

    const handleConfirmPosition = () => {
        setPickupLocation({
            lat: markerPosition.lat,
            lng: markerPosition.lng
        })
    };

    return (
        <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API has loaded.')}>
            <div className={styles.locationMapLayout}>
                <div className={styles.leftSideLayout}>
                    <div className={styles.markerDescrip}>
                        <Typography>Drag the red marker to the desired pickup location.</Typography>
                    </div>
                    <div className={styles.addiInfo}>
                        <Typography>Additional Pickup Location Info:</Typography>
                        <TextField
                            inputProps={{ inputMode: 'text', className: styles.textFieldInput }}
                            placeholder="Enter room # / Other info"
                            value={additionalInfo}
                            size="small"
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            fullWidth
                        />
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
                        >
                    <MarkerAtCenter setMarkerPosition={setMarkerPosition} initialPosition={initialPosition} />
                </Map>
            </div>
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
            title: 'Center Marker - This marker is draggable and can be moved to a different location.',
            draggable: true
        });

        const infoWindow = new google.maps.InfoWindow({
            content: 'Center Marker - This marker is draggable and can be moved to a different location.'
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
            infoWindow.setContent(`<div class=${styles.infoWindowContent}>Pin dropped at: ${position?.lat()}, ${position?.lng()}</div>`);
            infoWindow.open(map, marker);
        });

        return () => {
            marker.setMap(null);
        };
    }, [map]);

    return null;
}
