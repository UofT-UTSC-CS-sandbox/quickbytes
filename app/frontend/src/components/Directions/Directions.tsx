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
    const [courierMarker, setCourierMarker] = useState<google.maps.Marker | null>(null);
    const [destinationMarker, setDestinationMarker] = useState<google.maps.Marker | null>(null);
    const [dropOffCoord, setDropOffCoord] = useState<google.maps.LatLngLiteral | null>(null);
    const [pickUpCoord, setPickUpCoord] = useState<google.maps.LatLngLiteral | null>(null);
    const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
    const initialOrderIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!orderId) return;
        getCourierLocation(orderId).then(data => {
            setDropOffCoord(data.dropOffLocation);
            setPickUpCoord(data.pickUpLocation);
            setOrderStatus(data.status);
        }).catch(errorHandler);
    }, [orderId, errorHandler]);

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        //setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map, suppressMarkers: true }));
        setCourierMarker(new google.maps.Marker({ map, title: "Courier" }));
        setDestinationMarker(new google.maps.Marker({ map, title: "Destination" }));

    }, [routesLibrary, map]);

    useEffect(() => {
        if (!courierMarker || !directionsService || !dropOffCoord) return;

        const interpolatePosition = (start: google.maps.LatLngLiteral, end: google.maps.LatLngLiteral, fraction: number) => {
            return {
                lat: start.lat + (end.lat - start.lat) * fraction,
                lng: start.lng + (end.lng - start.lng) * fraction,
            };
        };

        const animateCourier = (start: google.maps.LatLngLiteral, end: google.maps.LatLngLiteral, duration: number) => {
            const startTime = performance.now();

            const step = (currentTime: number) => {
                const elapsedTime = currentTime - startTime;
                const fraction = elapsedTime / duration;
                if (fraction <= 1) {
                    const newPos = interpolatePosition(start, end, fraction);
                    courierMarker.setPosition(new google.maps.LatLng(newPos));
                    requestAnimationFrame(step);
                } else {
                    courierMarker.setPosition(new google.maps.LatLng(end));
                }
            };

            requestAnimationFrame(step);
        };

        const fetchLocations = async () => {
            try {
                console.log(courierMarker.getPosition()?.toJSON() as google.maps.LatLngLiteral)
        
                const data = await getCourierLocation(orderId!);

                console.log(data.currentLocation, "hello")
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
                destinationMarker?.setPosition(new google.maps.LatLng(destination));

                directionsService.route({
                    origin: data.currentLocation,
                    destination: destination,
                    travelMode: google.maps.TravelMode.WALKING,
                    provideRouteAlternatives: false
                }).then(result => {
                    directionsRenderer.setDirections(result);
                    const previousLocation = courierMarker.getPosition()?.toJSON() as google.maps.LatLngLiteral || data.currentLocation;
                    animateCourier(previousLocation, data.currentLocation, 1000);

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
        const intervalId = setInterval(fetchLocations, 1000); // Update every 1 second

        return () => clearInterval(intervalId);
    }, [courierMarker, directionsService, directionsRenderer, dropOffCoord, orderId, errorHandler]);

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
