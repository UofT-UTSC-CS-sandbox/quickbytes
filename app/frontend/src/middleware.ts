import { apiUrl } from "./components/APIUrl";
import { OrderStatus } from '../../shared/Order';

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


export async function getCourierLocation(orderID: string): Promise<{ currentLocation: google.maps.LatLngLiteral, 
    dropOffLocation: google.maps.LatLngLiteral, pickUpLocation: google.maps.LatLngLiteral, status: OrderStatus}> {
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
            dropOffLocation: data.tracking.dropOff,
            pickUpLocation: data.pickUp,
            status: data.tracking.status
        };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


//Returns the array of orders corresponding to the particular user
export async function getUserOrders(userId: string): Promise<string[]> {
    const url = `${apiUrl}/user/${userId}/orders`;

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
        console.log(data.orders);
        return data.orders; // The response contains the orders array
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function getRestaurantOrders(restaurantId: string): Promise<string[]> {
    const url = `${apiUrl}/restaurants/${restaurantId}/orders`;
  
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
      console.log(data.orderIds);
      return data.orderIds; // The response contains the orderIds array
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  
