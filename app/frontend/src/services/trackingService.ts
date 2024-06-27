import { useQueryEndpoint, createGet } from "./base"

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
        useQueryEndpoint<GetOrderDropoffResponse>(
            {
                queryKey: ['getOrder', orderID],
                queryFn: createGet({
                    inputUrl: `restaurants/order/${orderID}/dropOff`,
                    useAuth: false
                }),
                enabled: !!orderID,
            }
        )
}