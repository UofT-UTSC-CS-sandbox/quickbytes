import { apiUrl } from "./components/APIUrl";

export async function getCourierActiveOrder(courierID: number): Promise<Response> {
    const url = `${apiUrl}/deliveries/active?courierID=${courierID}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

/* Retreives the order with the given orderID */
export async function getOrder(orderID: string): Promise<Response> {
    const url = `${apiUrl}/restaurants/order/${orderID}/dropOff`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function getCourierLocation(orderID: string): Promise<{ currentLocation: google.maps.LatLngLiteral, dropOffLocation: google.maps.LatLngLiteral }> {
    const url = `${apiUrl}/deliveries/${orderID}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return {
            currentLocation: data.currentLocation,
            dropOffLocation: data.tracking.dropOff
        };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}