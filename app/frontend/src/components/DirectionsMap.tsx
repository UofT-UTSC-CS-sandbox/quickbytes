import { APIProvider, Map, MapCameraChangedEvent, useMap } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';

export default function LocationMap() {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    return (
        <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API has loaded.')}>
            <Map
                defaultZoom={13}
                defaultCenter={{ lat: 43.78324306123592, lng: - 79.18725118577679 }}
                onCameraChanged={(ev: MapCameraChangedEvent) =>
                    console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                }>
                <Geocode />
            </Map>
        </APIProvider>
    );
}

/* Handles geocoding and centering the map on the entered address */
function Geocode() {
    const map = useMap();
    const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();
    const [address, setAddress] = useState<string>('');

    useEffect(() => {
        if (!map) return;
        setGeocoder(new google.maps.Geocoder());
    }, [map]);

    const handleGeocode = () => {
        if (!geocoder || !address) return;
        geocoder.geocode({ address }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results[0]) {
                const location = results[0].geometry.location;
                map.setCenter(location);
                map.setZoom(14);
            } else {
                console.error('Geocode was not successful for the following reason: ' + status);
            }
        });
    };

    return (
        <div className='geocode'>
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter an address"
            />
            <button onClick={handleGeocode}>Show Location</button>
        </div>
    );
}
