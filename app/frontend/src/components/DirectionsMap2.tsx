import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const DirectionsMap2 = ({ orderId }) => {
  const [response, setResponse] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [courierLocation, setCourierLocation] = useState(null);

  useEffect(() => {
    const fetchDeliveryStatus = async () => {
      try {
        const res = await fetch(`/deliveries/${orderId}`);
        const data = await res.json();
        //might need to make api provide origin
        setOrigin(data.origin); 
        //might need to make api provide destination
        setDestination(data.destination); 
        setCourierLocation(data.currentLocation); 
      } catch (error) {
        console.error('Error fetching delivery status:', error);
      }
    };

    //get delivery status initially
    fetchDeliveryStatus();

    //get delivery status periodically
    const intervalId = setInterval(fetchDeliveryStatus, 10000);

    //clear interval on component unmount
    return () => clearInterval(intervalId); 
  }, [orderId]);

  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setResponse(response);
      } else {
        console.log('response: ', response);
      }
    }
  };
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        id="direction-example"
        mapContainerStyle={{ height: "400px", width: "800px" }}
        zoom={14}
        // this centers the map on the courier's location
        center={courierLocation || { lat: 0, lng: 0 }} 
      >
        {origin !== '' && destination !== '' && (
          <DirectionsService
            options={{ destination: destination, origin: origin, travelMode: 'DRIVING' }}
            callback={directionsCallback}
          />
        )}
        {response !== null && (
          <DirectionsRenderer options={{ directions: response }} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default DirectionsMap2;
