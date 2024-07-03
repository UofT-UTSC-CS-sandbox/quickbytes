import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import Directions from './Directions';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Snackbar, Alert } from '@mui/material';
import OrderMenu from './OrderMenu'; // Import the new OrderMenu component

export default function DirectionsMap2({ userId }: { userId: string }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
  const [displayError, setDisplayError] = useState<Error | null>(null);
  //console.log("reloaded")
  const errorHandler = (err: Error) => {
    console.error(err);
    setDisplayError(err);
  };
  const [loading, setLoading] = useState(true);
  const loadHandler = (loadVal: boolean) => setLoading(loadVal);
  const [orderId, setOrderId] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: "100%", height: "100vh" }}>
      <div style={{ width: "100%", height: "100vh" }}>
        <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API has loaded.')}>
          <div className='map-container'>
            {orderId ? (
              <Directions orderId={orderId} loadHandler={loadHandler} errorHandler={errorHandler} setOrderId={setOrderId} setLoading = {setLoading} userId={userId}/>
            ) : (
              <OrderMenu userId={userId} setOrderId={setOrderId} setLoading={setLoading}/>
            )}
            <Map
              id={'map'}
              //defaultZoom={13}
              //defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
              onCameraChanged={(ev) => console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom,'zoom2:', ev.map.getZoom())}
            >
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
        {loading ? (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6">Loading...</Typography>
              <CircularProgress />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
