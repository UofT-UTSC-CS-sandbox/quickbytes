const baseURL = 'http://localhost:3000/';

export async function getCourierActiveOrder(courierID: number): Promise<Response> {
    const url = `${baseURL}deliveries`;
    
    const requestBody = {
        courierID: courierID
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
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
    const url = `${baseURL}order`;
    
    const requestBody = {
        orderID: orderID
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
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