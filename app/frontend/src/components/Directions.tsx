import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useState, useEffect, useRef } from 'react';
import { Button, Stack } from "@mui/material";
import './DirectionsMap.css';
//import useCurrentLocation from '../services/currentLocationServiceCustomer';
import OrderStatus from '../model/OrderStatus'; // Import OrderStatus

import trackingService from '../services/trackingService';

import deliveryService from '../services/deliveryService';
import { useNavigate, useLocation} from 'react-router-dom';

import { database, ref, onValue } from '../firebaseConfig';

import { toast } from 'react-toastify';


interface DirectionProps {
    errorHandler: (error: Error) => void;
    loadHandler: (loadVal: boolean) => void;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    orderInformation: React.ReactNode
    orderId: string | null;
    orderMenu: React.ReactNode;
    useCurrentLocation: (orderId: string | null) => { currentLocation: any, isLoading: boolean, error: any };
}

export default function Directions({ errorHandler, loadHandler, orderId, orderMenu, setLoading, useCurrentLocation, orderInformation }: DirectionProps) {
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
    //const { data: currLoc, isLoading: currLoading, refetch } = trackingService.getCurrentLocationFromOrder(orderId).useQuery();
    console.log("this is the orderid thats being used to grab location111:", orderId)
    const { currentLocation: currLoc, isLoading: currLoading} = useCurrentLocation(orderId);
    console.log(currLoc)
    const { data: restaurantInfo, isLoading: pickUpLoading } = trackingService.getRestaurantLocation(orderId).useQuery();
    const { data: dropOffLoc, isLoading: dropOffLocLoading } = trackingService.getOrderDropoff(orderId).useQuery();
    
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const courier = searchParams.get('courier') === "true";

    useEffect(() => {
        if (!orderId) return ;
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
        console.log("fetching")
        if (!courierMarker || !directionsService) return;
        console.log("fetching2")


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
                const mapOptions = {
                    center: courierMarker.getPosition(),
                    zoom: 19,
                };
                map.setOptions(mapOptions);
            };

            requestAnimationFrame(step);
        };

        const fetchLocations = async () => {
            try {

                console.log(orderId)
                if (currLoading || pickUpLoading || dropOffLocLoading) {
                    return (<p>Loading information...</p>);
                }




                let destination = restaurantInfo.restaurant.location;
                console.log(currLoc, "its logged")

                /*
                
                if (data.status === OrderStatus.EN_ROUTE) {
                    destination = dropOffLoc;
                } else if (data.status === OrderStatus.AWAITING_PICK_UP) {
                    destination = pickupLoc;
                }

                */
                    
                destinationMarker?.setPosition(new google.maps.LatLng(destination));
                console.log("this is the destination, could be incorrect:", destination);
                console.log("this is the current location ", currLoc)

                directionsService.route({
                    origin: currLoc.location,
                    destination: destination,
                    travelMode: google.maps.TravelMode.WALKING,
                    provideRouteAlternatives: false
                }).then(result => {



                    if (initialOrderIdRef.current === orderId) {
                        setTimeout(() => {
                            directionsRenderer.setOptions({ preserveViewport: true });
                            
                        }, 100);
                    } else {
                        console.log("this should work")
                        
                        directionsRenderer.setOptions({ preserveViewport: false });
                        courierMarker.setPosition(new google.maps.LatLng(currLoc.location));
                        initialOrderIdRef.current = orderId;
                    }


                    directionsRenderer.setDirections(result);
                    const previousLocation = courierMarker.getPosition()?.toJSON() as google.maps.LatLngLiteral || currLoc.location;
                    animateCourier(previousLocation, currLoc.location, 1000);

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
            //refetch();
            console.log("should've refetched")
        };

        fetchLocations();
        //const intervalId = setInterval(fetchLocations, 1000);
        //console.log("should be executing and showing every second")

       // return () => clearInterval(intervalId);
    }, [courierMarker, directionsService, directionsRenderer, orderId, errorHandler, currLoc,currLoading, pickUpLoading, dropOffLocLoading, currLoading]);



    


    return (
        <div className='sidebar-container' style={{ paddingTop: '80px' }}>
            <div className='header'>
                <h3>"placeholder hello"</h3>
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
            {orderInformation}
        </div>
    );
}