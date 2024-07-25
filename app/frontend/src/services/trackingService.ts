import { useGetEndpoint } from "./base"

/**
 * Response body for the getOrderDropoff request.
 */
type GetOrderDropoffResponse = {
    data: {
        lat: number,
        lng: number
    }
}

/**
 * Response body for the getPickupLocation request.
 */
type GetPickupLocationResponse = {
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
 * Response body for the getPickupLocation request.
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
    getOrderDropoff: (orderID: string | undefined) =>
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

    /**
     * Get the pickup location of the given order. Only send a request if
     * the orderID is not falsy and if pickup location is already set .
     * @param orderID Unique ID of the order within the database.
     * @returns Service endpoint to fetch pickup location.
     */
    getPickupLocation: (orderID: string | undefined) =>
        useGetEndpoint<GetPickupLocationResponse>(
            {
                inputUrl: `restaurants/order/${orderID}/pickup-location`,
                useAuth: true
            },
            {
                queryKey: ['getPickupLocation', orderID],
                enabled: !!orderID,
            }
        ),

    getRestaurantLocation: (orderID: string | undefined) =>
        useGetEndpoint<GetPickupLocationResponse>(
            {
                inputUrl: `restaurants/order/${orderID}/restaurant-location`,
                useAuth: true
            },
            {
                queryKey: ['getRestaurantLocation', orderID],
                enabled: !!orderID,
            }
        ),

    /**
     * Function to fetch the current location of a user.
     * 
     * @param userId The ID of the user whose location is to be fetched.
     * @returns An object containing a function to trigger the query and its result.
     */
    getCurrentLocation: (userId: string | undefined) =>
        useGetEndpoint<GetCurrentLocationResponse>(
            {
                inputUrl: `user/${userId}/current-location`,
                useAuth: true,
            },
            {
                queryKey: ['getCurrentLocation', userId],
                enabled: !!userId,
            }),

    getCurrentLocationFromOrder: (orderId: string | undefined) =>
            useGetEndpoint<GetCurrentLocationResponse>(
                {
                    inputUrl: `deliveries/${orderId}/courier-location`,
                    useAuth: true,
                },
                {
                    queryKey: ['getCurrentLocationFromOrder', orderId],
                    enabled: !!orderId,
                }),    

    /**
     * Function to fetch the customer confirmation pin from the courier.
     * 
     * @param userId The ID of the courier.
     * @returns An object containing a function to trigger the query and its result.
     */
    getCustomerConfirmationPin: (userId: string | undefined) =>
        useGetEndpoint<GetCustomerConfirmationPinResponse>(
            {
                inputUrl: `user/${userId}/get-confirm-pin`,
                useAuth: true,
            },
            {
                queryKey: ['getCustomerConfirmationPin', userId],
                enabled: !!userId,
            }),
}