import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';
import Directions from './Directions';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Snackbar, Alert } from '@mui/material';
import OrderMenu from './OrderMenu'; // Import the new OrderMenu component
import uberMapStyle from './mapStyles.json';
import orderService from "../services/orderService"
import restaurantService from '../services/restaurantService';

interface DirectionsMapProps {
  id: string;
  getOrders: (userId: string) => any;
}

export default function DirectionsMap2({ id, getOrders }: DirectionsMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
  const [displayError, setDisplayError] = useState<Error | null>(null);
  const errorHandler = (err: Error) => {
    console.error(err);
    setDisplayError(err);
  };
  const [loading, setLoading] = useState(true);
  const loadHandler = (loadVal: boolean) => setLoading(loadVal);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderIds, setOrderIds] = useState<string[]>([]);

  const {  data, isLoading, isError} = getOrders(id).useQuery();

  if (isLoading) {
    console.log("stillloading")
}

  useEffect(() => {
    console.log("isloadingggg")
    if (!isLoading && data) {
      console.log(data.data)
      try {
        console.log(data.data.map(orderItem => orderItem.orderId), "id lists ")
          setOrderIds(data.data.map(orderItem => orderItem.orderId));
          setOrderId(data.data.map(orderItem => orderItem.orderId)[0]); // Safely access the second item
          setLoading(false);
      } catch (err) {
          //setDisplayError(err);
          console.log("broken")
          setLoading(false);
      }
  }

    /*

    getOrders(id)
      .then(data => {
        setOrderIds(data);
        // For now, it defaults to selecting the order at index 1
        setOrderId(data[1]);
        setLoading(false);
      })
      .catch(err => {
        setDisplayError(err);
        setLoading(false);
      });
      
*/

  }, [isLoading, id, getOrders, data]);

  console.log(isLoading)
  if (isLoading) {
    return <div>Loading...</div>;
}


 

  const orderMenu = <OrderMenu orderIds={orderIds} setOrderId={setOrderId} setLoading={setLoading} />;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: "100%", height: "100vh" }}>
      <div style={{ width: "100%", height: "100vh" }}>
        <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API has loaded.')}>
          <div className='map-container'>
            <Directions orderId={orderId} loadHandler={loadHandler} errorHandler={errorHandler} setLoading={setLoading} orderMenu={orderMenu} />
            <Map
              id={'map'}
              options={{
                styles: uberMapStyle,
              }}
              defaultZoom={13}
              defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
              onCameraChanged={(ev) => console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom, 'zoom2:', ev.map.getZoom())}
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
