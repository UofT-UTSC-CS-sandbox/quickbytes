import OrderStatus from "../model/OrderStatus";
import { useGetEndpoint } from "./base";

/**
 * Response body for getCourierActiveOrder request
 */
type GetCourierActiveOrderResponse = {
    data: string[]
}

/**
 * Response body for the getDeliveries request
 */
type GetDeliveriesResponse = {
    data: Record<string, {
        courierId: boolean | string | number,
        courierSplit: number,
        order: {
            items: Record<string, any>
            price: number
        },
        restaurant: {
            location: string,
            restaurantId: number,
            restaurantName: string
        },
        tracking: {
            courierAcceptedTime: false | number,
            courierDropoffTime: false | number,
            courierPickupTime: false | number,
            dropOff: {
                lat: number,
                lng: number
            },
            orderPlacedTime: number
            status: OrderStatus
        },
        userId: number | string
    }>
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
        useGetEndpoint<GetCourierActiveOrderResponse>(
            {
                inputUrl: `deliveries/active?courierID=${courierID}`,
                useAuth: false
            },
            {
                queryKey: ['courierActiveOrder', courierID],
            }
        ),
    /**
     * Get deliveries acceptable by the user as a courier
     * @returns Service endpoint to get the response containing all acceptable deliveries
     */
    getDeliveries: () =>
        useGetEndpoint<GetDeliveriesResponse, unknown>(
            {
                inputUrl: 'deliveries/ordering',
                useAuth: false
            },
            {
                queryKey: ['getDeliveries']
            }
        )
}