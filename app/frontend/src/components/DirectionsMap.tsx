import { APIProvider, Map, MapCameraChangedEvent, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import './DirectionsMap.css';
import { getCourierActiveOrder, getOrder } from '../../middleware';
import CircularProgress from '@mui/material/CircularProgress';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Snackbar, Alert } from '@mui/material';

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

const responseHandler = (response: Response) => response.json();

interface DirectionProps {
  errorHandler: (error: Error) => void;
  loadHandler: (loadVal:boolean) => void;
}

/* Generates and renders directions */
function Directions({ errorHandler, loadHandler }: DirectionProps) {
  const map = useMap("map");
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [originCoord, setOriginCoord] = useState<google.maps.LatLngLiteral | null>(null);
  const [dropOffCoord, setDropOffCoord] = useState<google.maps.LatLngLiteral | null>(null);

  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map?.setCenter(pos);
          setOriginCoord(pos);
        },
        () => {
          errorHandler(new Error("Could not find your location, please try again later"));
          loadHandler(false);
        }
      );
    } else {
      errorHandler(new Error("Browser doesn't support Geolocation"));
      loadHandler(false);
    }

    getCourierActiveOrder(8).then(responseHandler)
      .then(data => {
        getOrder(data.data[0]).then(responseHandler)
          .then(locationData => {
            setDropOffCoord(locationData.data);
          })
          .catch(errorHandler);
      })
      .catch(errorHandler);
  }, [errorHandler, loadHandler, map]);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsRenderer || !directionsService || !originCoord || !dropOffCoord) return;
    directionsService.route({
      origin: originCoord,
      destination: dropOffCoord,
      travelMode: google.maps.TravelMode.WALKING,
      provideRouteAlternatives: true
    }).then(result => {
      directionsRenderer.setDirections(result);
      setRoutes(result.routes);
    });
  }, [directionsService, directionsRenderer, originCoord, dropOffCoord]);

  useEffect(() => {
    if (!directionsRenderer || !dropOffCoord || originCoord) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  useEffect(() => {
    if (leg) {
      loadHandler(false);
    }
  }, [leg, loadHandler]);

  if (!leg) return null;

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
  const [displayError, setDisplayError] = useState<Error | null>(null);
  const errorHandler = (err:Error) => {
    console.error(err);
    setDisplayError(err);
  }
  const [loading, setLoading] = useState(true);
  const loadHandler = (loadVal:boolean) => setLoading(loadVal);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: "100%", height: "100vh" }}>
          <div style={{width: "100%", height: "100vh"}}>
            <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API has loaded.')}>
              <div className='map-container'>
                <Directions loadHandler={loadHandler} errorHandler={errorHandler} />
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
            <Snackbar open={displayError != null} autoHideDuration={6000} onClose={() => setDisplayError(null)}>
              <Alert
                onClose={() => setDisplayError(null)}
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
              >
                {displayError?.message}
              </Alert>
            </Snackbar>
            {loading?
             <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6">Loading...</Typography>
                <CircularProgress />
              </div>
            </div> : null}

          </div> 
    </div>
  );
}