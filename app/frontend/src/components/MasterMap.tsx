import { useEffect, useState, useRef } from 'react';
import { APIProvider, Map, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import trackingService from '../services/trackingService';


const DEFAULT_PICKUP_LOCATION = { lat: 43.785171372795524, lng: -79.18748160572729 };
/* This is the map component responsible for rendering the map and directions, it receives the destination as
  a prop but could easily be extended to receive the origin as well */
function MasterMap({dest, orderId}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
  //const { data: currentLocation, isLoading, isSuccess, error } = trackingService.getCurrentLocationFromOrder(orderId).useQuery();
  let centered = DEFAULT_PICKUP_LOCATION;
  //if(isSuccess){
    //centered = currentLocation.location;
  //}

    return (
    <APIProvider apiKey={apiKey}>
        <Directions dest={dest} orderId={orderId} />
        <Map 
          defaultCenter={DEFAULT_PICKUP_LOCATION} 
          defaultZoom={18} 
          mapId="courierOrderTrackingMap" 
          fullscreenControl={false}
        />
      </APIProvider>
    );
}
function Directions({dest, orderId}) {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const initialOrderIdRef = useRef<string | null>(null);
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const { data: currentLocation, isLoading, isSuccess, error } = trackingService.getCurrentLocationFromOrder(orderId).useQuery();

    
    const [courierMarker, setCourierMarker] = useState<google.maps.Marker | null>(null);
    const [destinationMarker, setDestinationMarker] = useState<google.maps.Marker | null>(null);
  
    useEffect(() => {
      if (!routesLibrary || !map) return;
      setDirectionsService(new routesLibrary.DirectionsService())
      //setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
      setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map, suppressMarkers: true }));
      setCourierMarker(new google.maps.Marker({ map, title: "Courier" }));
      setDestinationMarker(new google.maps.Marker({ map, title: "Destination" }));
      //courierMarker.setPosition(new google.maps.LatLng(currentLocation?.location));
    }, [routesLibrary, map]);
  
    useEffect(() => {
      if (!directionsRenderer || !directionsService || isLoading) return;

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
                  zoom: 20,
              };
              map.setOptions(mapOptions);
          };

          requestAnimationFrame(step);
      };

      console.log(currentLocation.location)
      map.setCenter(currentLocation?.location)
      const mapOptions = {
        center: currentLocation?.location,
        zoom: 20,
      };

      destinationMarker?.setPosition(new google.maps.LatLng(dest));

      directionsService.route({
        origin: currentLocation?.location,
        destination: dest,
        travelMode: google.maps.TravelMode.WALKING,
        //provideRouteAlternatives: false
      }).then(res => {

        if (initialOrderIdRef.current != "1") {
          courierMarker.setPosition(new google.maps.LatLng(currentLocation?.location));
          initialOrderIdRef.current = "1";
        }


        directionsRenderer.setDirections(res);
        directionsRenderer.setOptions({ preserveViewport: true });
        const previousLocation = courierMarker.getPosition()?.toJSON() as google.maps.LatLngLiteral || currLoc.location;
        animateCourier(previousLocation, currentLocation?.location, 1000);
        //map.setOptions(mapOptions);
        //map.setCenter(currentLocation?.location)
      })
      //map.setOptions(mapOptions);
  
    }, [directionsRenderer, directionsService, currentLocation])
    return null;
}
export default MasterMap;