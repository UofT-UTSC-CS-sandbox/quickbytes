import { useGetEndpoint } from "./base"

/**
 * Response body for the getOrderDropoff request.
 */
type GetOrderDropoffResponse = {
    data: { lat: number, lng: number },
    lat: number,
    lng: number,
    dropOffName: string
}

/**
 * Response body for the getRestaurantLocation request.
 */
type GetRestaurantLocationResponse = {
    lat: number,
    lng: number,
    dropOffName: string
}


interface GetCurrentLocationResponse {
    data: {
        location: {
            lat: number,
            lng: number
        }
    }
}

/**
 * Response body for the getCustomerConfirmationPin request.
 */
type GetCustomerConfirmationPinResponse = {
    customerConfirmationPin: string
}

/**
 * All API functions related to retrieving and updating map tracking information
 * such as map coordinates, wayfinding and estimated time of arrival.
 */
export default {
    /**
     * Get the dropoff location of the given order. Only send a request if
     * the orderID is not falsy.
     * @param orderID Unique ID of the order within the database.
     * @returns Service endpoint to fetch dropoff location.
     */
    getOrderDropoff: (orderID: string | null) =>
        useGetEndpoint<GetOrderDropoffResponse>(
            {
                inputUrl: `restaurants/order/${orderID}/dropOff`,
                useAuth: true
            },
            {
                queryKey: ['getOrder', orderID],
                enabled: !!orderID,
            }
        ),

    getRestaurantLocation: (orderID: string | null) =>
        useGetEndpoint<GetRestaurantLocationResponse>(
            {
                inputUrl: `deliveries/${orderID}/restaurant-location`,
                useAuth: true
            },
            {
                queryKey: ['getRestaurantLocation', orderID],
                enabled: !!orderID,
            }
        ),

    getCurrentLocationFromOrder: (orderId: string | null) =>
        useGetEndpoint<GetCurrentLocationResponse>(
            {
                inputUrl: `deliveries/${orderId}/courier-location`,
                useAuth: true,
            },
            {
                queryKey: ['getCurrentLocationFromOrder', orderId],
                enabled: !!orderId,
                refetchInterval: 1000,
                retry: 10
            }),

    /**
     * Function for the customer to fetch the customer confirmation pin so
     * they can confirm that they are the customer to the courier.
     * 
     * @returns An object containing a function to trigger the query and its result.
     
    getCustomerConfirmationPin: () =>
        useGetEndpoint<GetCustomerConfirmationPinResponse>(
            {
                inputUrl: `user/get-confirm-pin`,
                useAuth: true,
            },
            {
                queryKey: ['getCustomerConfirmationPin'],
            }), */
}