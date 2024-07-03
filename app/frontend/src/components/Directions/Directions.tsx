import {useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useState, useEffect, useMemo, useRef } from 'react';
import Button from '@mui/material/Button';
import './DirectionsMap.css';
import { getCourierLocation} from '../../middleware';
import OrderMenu from './OrderMenu';

interface DirectionProps {
    errorHandler: (error: Error) => void;
    loadHandler: (loadVal: boolean) => void;
    setOrderId: React.Dispatch<React.SetStateAction<string>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    userId: string;
    orderId: string;
  }
  
  /* Generates and renders directions */
export default function Directions({ errorHandler, loadHandler, orderId , setOrderId, userId, setLoading}: DirectionProps) {
  console.log("reloaded");

    //const map = useMap("map");

    const map = useMemo(() => useMap("map"), []);
    console.log(map?.getZoom(), "goodbye");
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const [originCoord, setOriginCoord] = useState<google.maps.LatLngLiteral | null>(null);
    const [dropOffCoord, setDropOffCoord] = useState<google.maps.LatLngLiteral | null>(null);
    const initialOrderIdRef = useRef(null);
    
  
    console.log(map?.getZoom(), "goodbye2");
    useEffect(() => {
      // Fetch drop-off coordinates
      console.log("culprit")
      getCourierLocation(orderId).then(data => {
        setDropOffCoord(data.dropOffLocation);
      }).catch(errorHandler);
    }, [errorHandler]);
  
    useEffect(() => {
      if (!routesLibrary || !map) return;
      console.log("hello");
      setDirectionsService(new routesLibrary.DirectionsService());
      setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [routesLibrary, map]);
  
    useEffect(() => {
      if (!directionsRenderer || !directionsService || !dropOffCoord) return;
  
      const fetchLocations = async () => {
        try {
          const data = await getCourierLocation(orderId);
          //setOriginCoord(data.currentLocation);

          const mapOptions = {
            center: map.getCenter(),
            zoom: map.getZoom(),
          };

          console.log(mapOptions)
          
          directionsService.route({
            origin: data.currentLocation,
            destination: dropOffCoord,
            travelMode: google.maps.TravelMode.WALKING,
            provideRouteAlternatives: false
          }).then(result => {
            directionsRenderer.setDirections(result);

            

           //   directionsRenderer?.setOptions({ preserveViewport: true }); // Reset the zoom level
           if (initialOrderIdRef.current === orderId) {
            // Add an event listener for directions_changed
            setTimeout(() => {
              directionsRenderer.setOptions({ preserveViewport: true }); // Preserve the viewport after directions are rendered
            }, 100);
          } else {
            // Reset map settings
            directionsRenderer.setOptions({ preserveViewport: false });
            initialOrderIdRef.current = orderId;
          }
          

            //
            //map.setZoom(20);

            
            //map.setZoom(mapOptions.zoom);

            loadHandler(false); // Stop loading once the route is set
          });
          //map.setZoom(mapOptions.zoom);
          //map.setOptions(mapOptions);
          //
          console.log(map?.getZoom(), "works")
        } catch (error) {
          errorHandler(error);
        }
      };
  
      fetchLocations();
      const intervalId = setInterval(fetchLocations, 5000); // Update every 5 seconds

      console.log(map?.getZoom(), "goodbye3");
      return () => clearInterval(intervalId);
    }, [directionsService, directionsRenderer, dropOffCoord, errorHandler]);
  
    if (!dropOffCoord) return null;
    console.log(map?.getZoom(), "goodbye4");
    return (
      <div className='sidebar-container'>
        <div className='header'>
          <h3>Dropoff Location</h3>
          <OrderMenu userId={userId} setOrderId={setOrderId} setLoading={setLoading}/>
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