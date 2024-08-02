import { useEffect, useState } from 'react';
import { APIProvider, Map, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

const DEFAULT_PICKUP_LOCATION = { lat: 43.785171372795524, lng: -79.18748160572729 };
/* This is the map component responsible for rendering the map and directions, it receives the destination as
  a prop but could easily be extended to receive the origin as well */
function MasterMap({dest}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

    return (
    <APIProvider apiKey={apiKey}>
        <Directions dest={dest} />
        <Map 
          center={DEFAULT_PICKUP_LOCATION} 
          defaultZoom={9} 
          mapId="courierOrderTrackingMap" 
          fullscreenControl={false}
        />
      </APIProvider>
    );
}
function Directions({dest}) {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  
    useEffect(() => {
      if (!routesLibrary || !map) return;
      setDirectionsService(new routesLibrary.DirectionsService())
      setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [routesLibrary, map]);
  
    useEffect(() => {
      if (!directionsRenderer || !directionsService) return;
      directionsService.route({
        origin: DEFAULT_PICKUP_LOCATION,
        destination: dest,
        travelMode: google.maps.TravelMode.WALKING
      }).then(res => {
        directionsRenderer.setDirections(res);
      })
  
    }, [directionsRenderer, directionsService])
    return null;
}
export default MasterMap;