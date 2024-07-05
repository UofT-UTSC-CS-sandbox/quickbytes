import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useState, useEffect, useMemo, useRef } from 'react';
import Button from '@mui/material/Button';
import './DirectionsMap.css';
import OrderStatus from '../model/OrderStatus'; // Import OrderStatus

import restaurantService from '../services/restaurantService';
import orderService from '../services/orderService';
import trackingService from '../services/trackingService';

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
    const [routeInfo, setRouteInfo] = useState<{ distance: string, duration: string } | null>(null);


    //const [dropOffCoord, setDropOffCoord] = useState<google.maps.LatLngLiteral | null>(null);
    //const [restaurantName, setRestaurantName] = useState<string | null>(null);
    const initialOrderIdRef = useRef<string | null>(null);
    const {data: currLoc, isLoading :currLoading, refetch }=trackingService.getCurrentLocation("7gPDsXFo8WaI9awl87qlbcJsJBx2").useQuery();

    console.log(currLoc)
    const {data: pickupLoc, isLoading: pickUpLoading } = trackingService.getPickupLocation(orderId).useQuery();
    const {data: dropOffLoc, isLoading: dropOffLocLoading } = trackingService.getOrderDropoff(orderId).useQuery();

    useEffect(() => {
        if (!orderId) return;
        //getCourierLocation(orderId).then(data => {
            //setDropOffCoord(data.dropOffLocation);
            //setRestaurantName(data.name);
        //}).catch(errorHandler);
    }, [orderId, errorHandler]);

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map, suppressMarkers: true }));
        setCourierMarker(new google.maps.Marker({ map, title: "Courier" }));
        setDestinationMarker(new google.maps.Marker({ map, title: "Destination" }));

    }, [routesLibrary, map]);

    useEffect(() => {
        if (!courierMarker || !directionsService) return;

        

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
                if(currLoading || pickUpLoading || dropOffLocLoading){
                    return (<p>Loading information...</p>);
                }
                

                const mapOptions = {
                    center: map.getCenter(),
                    zoom: map.getZoom(),
                };

                let destination = pickupLoc;
                console.log(currLoc)
                /*
                if (data.status === OrderStatus.EN_ROUTE) {
                    destination = dropOffLoc;
                } else if (data.status === OrderStatus.AWAITING_PICK_UP) {
                    destination = pickupLoc;
                }
                    */
                destinationMarker?.setPosition(new google.maps.LatLng(destination));

                directionsService.route({
                    origin: currLoc.location,
                    destination: destination,
                    travelMode: google.maps.TravelMode.WALKING,
                    provideRouteAlternatives: false
                }).then(result => {
                    directionsRenderer.setDirections(result);
                    const previousLocation = courierMarker.getPosition()?.toJSON() as google.maps.LatLngLiteral || currLoc.location;
                    animateCourier(previousLocation, currLoc.location, 1000);

                    if (initialOrderIdRef.current === orderId) {
                        setTimeout(() => {
                            directionsRenderer.setOptions({ preserveViewport: true });
                        }, 100);
                    } else {
                        directionsRenderer.setOptions({ preserveViewport: false });
                        initialOrderIdRef.current = orderId;
                    }

                    const routeLeg = result.routes[0].legs[0];
                    setRouteInfo({
                        distance: routeLeg.distance.text,
                        duration: routeLeg.duration.text
                    });

                    loadHandler(false);
                });
            } catch (error) {
                errorHandler(error);
            }
            refetch();
        };

        fetchLocations();
        const intervalId = setInterval(fetchLocations, 1000);

        return () => clearInterval(intervalId);
    }, [courierMarker, directionsService, directionsRenderer, orderId, errorHandler, currLoc]);

    return (
        <div className='sidebar-container'>
            <div className='header'>
                <h3>"placeholder"</h3>
                {orderMenu}
            </div>
            <div className='status'>
                <h2>Placeholder status text...</h2>

                {routeInfo ? (
                    <p>Estimated arrival in <b>{routeInfo.duration} or {routeInfo.distance}</b></p>
                ) : (
                    <p>Loading route information...</p>
                )}
            </div>
            <div className='buttons'>
                <Button variant="contained" sx={{ backgroundColor: 'rgba(163, 0, 0, 1)', color: 'white' }} size="large">one</Button>
                <Button variant="contained" sx={{ backgroundColor: 'rgba(0, 127, 163, 1)', color: 'white' }} size="large">two</Button>
            </div>
        </div>
    );
}
