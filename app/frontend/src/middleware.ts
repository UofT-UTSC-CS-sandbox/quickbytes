import { apiUrl } from "./components/APIUrl";

export async function getDeliveries(): Promise<Response> {
    const url = `${apiUrl}/deliveries/ordering`;
    
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
        console.log(response);
        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function acceptDelivery(userId: string, orderId: string): Promise<Response> {
    const url = `${apiUrl}/deliveries/accept`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderId, userId })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        console.log(response);
        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}