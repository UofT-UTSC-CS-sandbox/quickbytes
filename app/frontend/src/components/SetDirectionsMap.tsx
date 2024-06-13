import { APIProvider, Map, MapCameraChangedEvent, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

export default function SingleMarkerMap() {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const [markerPosition, setMarkerPosition] = useState({ lat: 43.7845, lng: -79.1876 });
    const [confirmedPosition, setConfirmedPosition] = useState(null);

    const handleConfirmPosition = () => {
        setConfirmedPosition(markerPosition);
        alert(`Confirmed position: ${markerPosition.lat}, ${markerPosition.lng}`);
    };

    return (
        <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API has loaded.')}>
            <div className='location-map-layout'>
                <div className='left-side-layout'>
                    <div className='marker-descrip'>
                        <p>Drag the red marker to the desired pickup location.</p>
                    </div>
                    <div className='addi-info'>
                        <p>Additional Pickup Location Info:</p><input type="text" placeholder="Enter room #"></input>
                    </div>
                    <div className='confirm-button'>
                        <button onClick={handleConfirmPosition}>Confirm Pickup Location</button>
                    </div>
                </div>
                <div className='map'>
                    <Map
                        defaultZoom={13}
                        defaultCenter={{ lat: 43.7845, lng: -79.1876 }}
                        onCameraChanged={(ev: MapCameraChangedEvent) =>
                            console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                        }
                        style={{ width: '100%', height: '100%' }}
                        options={{
                            restriction: {
                                latLngBounds: {
                                    north: 43.79761628441843,
                                    south: 43.775626193692666,
                                    east: -79.17779162319711,
                                    west: -79.19601171604556,
                                },
                                strictBounds: true,
                            },
                        }}>
                        <MarkerAtCenter setMarkerPosition={setMarkerPosition} />
                    </Map>
                </div>
            </div>

            {confirmedPosition && (
                <div style={{ position: 'absolute', top: 50, right: 10, zIndex: 1000 }}>
                    <p>Confirmed Position: {confirmedPosition.lat}, {confirmedPosition.lng}</p>
                </div>
            )}
        </APIProvider>
    );
}

/* Adds a marker at the center of the map */
function MarkerAtCenter({ setMarkerPosition }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const center = { lat: 43.7845, lng: -79.1876 };

        const marker = new google.maps.Marker({
            position: center,
            map: map,
            title: 'Center Marker - This marker is draggable and can be moved to a different location.',
            draggable: true
        });

        const infoWindow = new google.maps.InfoWindow({
            content: 'Center Marker - This marker is draggable and can be moved to a different location.'
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        marker.addListener('dragend', () => {
            const position = marker.getPosition();
            setMarkerPosition({ lat: position.lat(), lng: position.lng() });
            infoWindow.close();
            infoWindow.setContent(`Pin dropped at: ${position.lat()}, ${position.lng()}`);
            infoWindow.open(map, marker);
        });

        return () => {
            marker.setMap(null); // Remove the marker if the component is unmounted
        };
    }, [map]);

    return null;
}
