import { APIProvider, Map, MapCameraChangedEvent, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';
import './DirectionsMap.css';

export default function DirectionsMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return (
    <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API has loaded.')}>
      <div className='map-container'>
        <Directions />
        <Map
          id={'map'}
          defaultZoom={13}
          defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
          onCameraChanged={(ev: MapCameraChangedEvent) =>
            console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
          }>
        </Map>
      </div>
    </APIProvider>
  );
}

/* Generates and renders directions */
function Directions() {
  const map = useMap("map");
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);

  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsRenderer || !directionsService) return;
    directionsService.route({
      origin: "1265 Military Trail, Scarborough, ON M1C 1A4",
      destination: "755 Morningside Ave, Scarborough, ON M1C 4Z4",
      travelMode: google.maps.TravelMode.WALKING,
      provideRouteAlternatives: true
    }).then(result => {
      directionsRenderer.setDirections(result);
      setRoutes(result.routes);
    });
  }, [directionsService, directionsRenderer]);

  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return null;

  return (
    <div>
      <h2>{selected.summary}</h2>
      <p>{leg.start_address.split(',')[0]} to {leg.end_address.split(',')[0]}</p>
      <p>Distance {leg.distance?.text}</p>
      <p>Duration {leg.duration?.text}</p>
      <h2>Other Routes</h2>
      <ul>
        {routes.map((route, index) => {
          return (
            <li key={index}>
              <button onClick={() => setRouteIndex(index)}>{route.summary}</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
