import { useEffect, useState } from 'react';
import trackingService from './trackingService';

const useCurrentLocation = (orderId: string | null) => {
    const [currentLocation, setCurrentLocation] = useState<any>(null);
    const { data, isLoading, error, refetch } = trackingService.getCurrentLocationFromOrder(orderId).useQuery();

    useEffect(() => {
        if (data) {
            setCurrentLocation(data);
        }
    }, [data, orderId]);

    useEffect(() => {
        if (!orderId) return;

        const intervalId = setInterval(() => {
            refetch();
        }, 1000);

        return () => clearInterval(intervalId);
    }, [orderId, refetch]);

    return { currentLocation, isLoading, error };
};

export default useCurrentLocation;