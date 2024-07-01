import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const DirectionsMap2 = ({ orderId }) => {
  const [response, setResponse] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [courierLocation, setCourierLocation] = useState(null);

  useEffect(() => {
    // Function to fetch delivery status
    const fetchDeliveryStatus = async () => {
      try {
        const res = await fetch(`/deliveries/${orderId}`);
        const data = await res.json();
        if (data.tracking.dropOff && data.currentLocation) {
          setOrigin(data.currentLocation);
          setDestination(data.tracking.dropOff);
          setCourierLocation(data.currentLocation);
        } else {
          console.error('Invalid delivery data');
        }
      } catch (error) {
        console.error('Error fetching delivery status:', error);
      }
    };

    // Fetch delivery status initially
    fetchDeliveryStatus();

    // Fetch delivery status periodically
    const intervalId = setInterval(fetchDeliveryStatus, 10000); // Every 10 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
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
        center={courierLocation || { lat: 0, lng: 0 }} // Center map on courier's location
      >
        {origin && destination && (
          <DirectionsService
            options=
            {{ 
              destination: destination, 
              origin: origin, 
              travelMode: window.google.maps.TravelMode.DRIVING
             }}
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
