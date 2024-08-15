import { useEffect, useState } from 'react';
import trackingService from './trackingService';

const useCurrentLocation = (orderId: string | null) => {
    const [currentLocation, setCurrentLocation] = useState<any>(null);
    const { data, isLoading, error } = trackingService.getCurrentLocationFromOrder(orderId).useQuery();

    useEffect(() => {
        if (data) {
            setCurrentLocation(data);
        }
    }, [data, orderId]);

    return { currentLocation, isLoading, error };
};

export default useCurrentLocation;