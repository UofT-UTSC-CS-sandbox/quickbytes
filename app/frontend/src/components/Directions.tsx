import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Button, Stack } from "@mui/material";
import './DirectionsMap.css';
//import useCurrentLocation from '../services/currentLocationServiceCustomer';
import OrderStatus from '../model/OrderStatus'; // Import OrderStatus

import restaurantService from '../services/restaurantService';
import orderService from '../services/orderService';
import trackingService from '../services/trackingService';

import deliveryService from '../services/deliveryService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useLocation} from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';


interface DirectionProps {
    errorHandler: (error: Error) => void;
    loadHandler: (loadVal: boolean) => void;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    orderId: string | null;
    orderMenu: React.ReactNode;
    useCurrentLocation: (orderId: string | null) => { currentLocation: any, isLoading: boolean, error: any };
}

export default function Directions({ errorHandler, loadHandler, orderId, orderMenu, setLoading, useCurrentLocation }: DirectionProps) {
    const map = useMap("map");
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const [courierMarker, setCourierMarker] = useState<google.maps.Marker | null>(null);
    const [destinationMarker, setDestinationMarker] = useState<google.maps.Marker | null>(null);
    const [routeInfo, setRouteInfo] = useState<{ distance: string, duration: string } | null>(null);
    const [confirmationPin, setConfirmationPin] = useState<string | null>(null);

    //const [dropOffCoord, setDropOffCoord] = useState<google.maps.LatLngLiteral | null>(null);
    //const [restaurantName, setRestaurantName] = useState<string | null>(null);
    const initialOrderIdRef = useRef<string | null>(null);
    //const { data: currLoc, isLoading: currLoading, refetch } = trackingService.getCurrentLocationFromOrder(orderId).useQuery();

    const { currentLocation: currLoc, isLoading: currLoading, error } = useCurrentLocation(orderId);
    console.log(currLoc)
    const { data: pickupLoc, isLoading: pickUpLoading } = trackingService.getRestaurantLocation(orderId).useQuery();
    const { data: dropOffLoc, isLoading: dropOffLocLoading } = trackingService.getOrderDropoff(orderId).useQuery();
    const { data: confirmationPinData, isLoading: confirmationPinLoading } = trackingService.getCustomerConfirmationPin("7gPDsXFo8WaI9awl87qlbcJsJBx2").useQuery();

    
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const courier = searchParams.get('courier') === "true";
    


    useEffect(() => {
        if (confirmationPinData) {
            setConfirmationPin(confirmationPinData.customerConfirmationPin);
        }
    }, [confirmationPinData]);

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




                let destination = pickupLoc;
                console.log(currLoc, "its logged")

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
    }, [courierMarker, directionsService, directionsRenderer, orderId, errorHandler, currLoc,currLoading, pickUpLoading, dropOffLocLoading, currLoading, confirmationPinLoading]);

    const handleConfirmationPinClick = () => {
        // Show the customer confirmation pin in the alert message
        alert(`This is your 4 digit confirmation pin: ${confirmationPin}`);
    };



  
    const {mutate: updateOrderStatus} = deliveryService.updateOrderStatus((d) => {
      console.log(d.message)
      // Courier returns to delivery page upon cancellation, customer to home page
      nav(courier ? '/deliveries' : "/");
    }).useMutation();
    
    const showNotification = (data: any) => {
      const message = "The user has cancelled this order"
      toast.info(message, {
          position: "top-center",
          autoClose: AUTO_CLOSE_TIME,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => {
            nav("/deliveries");
          }
      });
    };
                                              
    // listen to changes in the order status and show a notification
    useEffect(() => {
        if (orderId) {
            const dataRef = ref(database, `orders/${orderId}/tracking/status`);
  
            const unsubscribeData = onValue(dataRef, (snapshot) => {
                const data = snapshot.val();
                // We only care for order cancellations for now
                if (!data || data!=OrderStatus.CANCELLED || data != OrderStatus.ORDERED) return;
                console.log("order cancelled");
                showNotification(data);
            });
  
            return () => unsubscribeData();
        }
    }, [orderId]);
  
  
    const nav = useNavigate();
    const handleUpdateStatus = () => {
      if (orderId) {
        const newStatus = OrderStatus.EN_ROUTE; // change later to change status depending on where in the workflow
        updateOrderStatus({ orderId: orderId, status: newStatus, courierRequest: courier });
      }
    };
  
    const handleCancelOrder = () => {
      if (orderId) {
        const confirmed = window.confirm('Are you sure you want to cancel this order?');
        if (confirmed) {
          const newStatus = OrderStatus.CANCELLED;
          /* TODO: ensure order has not been picked up. */
          updateOrderStatus({ orderId: orderId, status: newStatus, courierRequest: courier });
        }
      }
    };

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
            <Stack direction="row" justifyContent="center">
                <Button variant="contained" color="primary" size="large" onClick={handleConfirmationPinClick}>Confirmation Pin</Button>
            </Stack>
            <div className='buttons'>
                <Button variant="contained" sx={{ backgroundColor: 'rgba(163, 0, 0, 1)', color: 'white' }} size="large" onClick={handleCancelOrder}>Cancel Order</Button>
                {
                    courier ? <Button variant="contained" sx={{ backgroundColor: 'rgba(0, 127, 163, 1)', color: 'white' }} size="large" onClick={handleUpdateStatus}>Notify</Button> : null
                }   
            </div>
        </div>
    );
}