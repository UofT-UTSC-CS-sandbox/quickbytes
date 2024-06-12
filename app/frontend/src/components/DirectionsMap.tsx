import { APIProvider, Map, MapCameraChangedEvent, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import './DirectionsMap.css';

interface DirectionsRoute {
  summary: string;
  legs: google.maps.DirectionsLeg[];
}

interface BasicMenuProps {
  routes: DirectionsRoute[];
  setRouteIndex: React.Dispatch<React.SetStateAction<number>>;
}

/* Generates and renders basic drop menu for routes*/
function BasicMenu({ routes, setRouteIndex }: BasicMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (index: number) => {
    setRouteIndex(index);
    handleClose();
  };

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ color: 'black', backgroundColor: 'white', '&:hover': { backgroundColor: 'lightgray' } }} // Added styles
      >
        Other Routes
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {routes.map((route, index) => (
          <MenuItem key={index} onClick={() => handleMenuItemClick(index)}>
            <p>{route.legs[0].distance?.text} route</p>
          </MenuItem>
        ))}
      </Menu>
    </>
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
  console.log(routes)
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  /* Initialize origin and destination from fetched order (customer, courier, and restaurant location)
     Store some state to update and re-render origin from courier's queried realtime location in database
  */
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

  /* Render header, status, and buttons based on input parameters, update header and buttons workflow*/
  return (
    <div className='sidebar-container'>
      <div className='header'>
        <h3>{leg.end_address.split(',')[0]}</h3>
        <BasicMenu routes={routes} setRouteIndex={setRouteIndex} />
      </div>
      <div className='status'>
        <h2>Placeholder status text...</h2>
        <p>Estimated arrival in <b>{leg.duration?.text} or {leg.distance?.text}</b></p>
      </div>
      <div className='buttons'>
        <Button variant="contained" sx={{ backgroundColor: 'rgba(163, 0, 0, 1)', color: 'white' }} size="large">one</Button>
        <Button variant="contained" sx={{ backgroundColor: 'rgba(0, 127, 163, 1)', color: 'white' }} size="large">two</Button>
      </div>
    </div>
  );
}

export default function DirectionsMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
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
