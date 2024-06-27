import { createGet, useQueryEndpoint } from "./base";

/**
 * Response body for getCourierActiveOrder request
 */
type GetCourierActiveOrderResponse = {
    data: string[]
}

/**
 * All API endpoints related to retrieving and updating delivery information 
 * for a courier.
 */
export default {
    /**
     * Get the delivery that is currently being done by a courier
     * @param courierID ID of courier to query for.
     * @returns Service endpoint to get the active delivery ID of the courier.
     */
    getCourierActiveOrder: (courierID: number) =>
        useQueryEndpoint<GetCourierActiveOrderResponse>(
            {
                queryKey: ['courierActiveOrder', courierID],
                queryFn: createGet({
                    inputUrl: `deliveries/active?courierID=${courierID}`,
                    useAuth: false
                }),
            }
        )
}