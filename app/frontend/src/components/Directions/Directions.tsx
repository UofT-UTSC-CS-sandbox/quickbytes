import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useState, useEffect, useMemo, useRef } from 'react';
import Button from '@mui/material/Button';
import './DirectionsMap.css';
import { getCourierLocation, getOrderStatus } from '../../middleware';
import OrderMenu from './OrderMenu';
import { OrderStatus } from '../../../../shared/Order'; // Import OrderStatus

interface DirectionProps {
    errorHandler: (error: Error) => void;
    loadHandler: (loadVal: boolean) => void;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    orderId: string | null;
    orderMenu: React.ReactNode;
}

export default function Directions({ errorHandler, loadHandler, orderId, orderMenu, setLoading }: DirectionProps) {
    const map = useMap("map");
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const [originCoord, setOriginCoord] = useState<google.maps.LatLngLiteral | null>(null);
    const [dropOffCoord, setDropOffCoord] = useState<google.maps.LatLngLiteral | null>(null);
    const [pickUpCoord, setPickUpCoord] = useState<google.maps.LatLngLiteral | null>(null);
    const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);

    const initialOrderIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!orderId) return;
        //setLoading(true);
        getCourierLocation(orderId).then(data => {
            setDropOffCoord(data.dropOffLocation);
            setPickUpCoord(data.pickUpLocation);
            setOrderStatus(data.status);
            //setLoading(false);
        }).catch(errorHandler);
    }, [orderId, errorHandler]);

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [routesLibrary, map]);

    useEffect(() => {
        if (!directionsRenderer || !directionsService || !dropOffCoord) return;

        const fetchLocations = async () => {
            try {
                const data = await getCourierLocation(orderId!);
                const mapOptions = {
                    center: map.getCenter(),
                    zoom: map.getZoom(),
                };

                let destination = data.pickUpLocation;

                if (data.status === OrderStatus.EN_ROUTE) {
                    destination = data.dropOffLocation;
                } else if (data.status === OrderStatus.AWAITING_PICK_UP) {
                    destination = data.pickUpLocation;
                }

                directionsService.route({
                    origin: data.currentLocation,
                    destination: destination,
                    travelMode: google.maps.TravelMode.WALKING,
                    provideRouteAlternatives: false
                }).then(result => {
                    directionsRenderer.setDirections(result);

                    if (initialOrderIdRef.current === orderId) {
                        setTimeout(() => {
                            directionsRenderer.setOptions({ preserveViewport: true });
                        }, 100);
                    } else {
                        directionsRenderer.setOptions({ preserveViewport: false });
                        initialOrderIdRef.current = orderId;
                    }

                    loadHandler(false); // Stop loading once the route is set
                });
            } catch (error) {
                errorHandler(error);
            }
        };

        fetchLocations();
        const intervalId = setInterval(fetchLocations, 5000); // Update every 5 seconds

        return () => clearInterval(intervalId);
    }, [directionsService, directionsRenderer, dropOffCoord, orderId, errorHandler]);

    return (
        <div className='sidebar-container'>
            <div className='header'>
                <h3>Dropoff Location</h3>
                {orderMenu}
            </div>
            <div className='status'>
                <h2>Placeholder status text...</h2>
            </div>
            <div className='buttons'>
                <Button variant="contained" sx={{ backgroundColor: 'rgba(163, 0, 0, 1)', color: 'white' }} size="large">one</Button>
                <Button variant="contained" sx={{ backgroundColor: 'rgba(0, 127, 163, 1)', color: 'white' }} size="large">two</Button>
            </div>
        </div>
    );
}
