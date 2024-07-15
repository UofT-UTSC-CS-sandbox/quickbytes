import OrderStatus from "../model/OrderStatus";
import { useGetEndpoint, usePostEndpoint } from "./base";

/**
 * Response body for getCourierActiveOrder request
 */
type GetCourierActiveOrderResponse = {
    data: string
}

/**
 * Response body for getCourierActiveOrder request
 */
type GetCustomerActiveOrderResponse = {
    data: string
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
            estimates?: {
                distanceMeters: number
                distance: string,
                time: string,
                timeSeconds: number
            },
            dropOffName: string,
            orderPlacedTime: number
            status: OrderStatus
        },
    }>
}

/**
 * Request body for the POST request to accept the delivery.
 */
type AcceptDeliveryRequest = {
    userId: string,
    orderId: string
}

type UpdateOrderStatusRequest = {
    orderId: string,
    status: OrderStatus
}

type Coordinates = {
    lat: string,
    lng: string
}

/**
 * Response body for the POST request to accept the delivery.
 */
type AcceptDeliveryResponse = {
    pickupCoordinates: Coordinates
    message: string
}

/**
 * Response body for the POST request to accept the delivery.
 */
type UpdateOrderStatusResponse = {
    message: string
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
    getCourierActiveOrder: (courierID: string) =>
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
     * Get the order that is currently being delivered to the customer
     * @param customerID ID of current user customer to query for.
     * @returns Service endpoint to get the active order ID of the customer.
     */
    getCustomerActiveOrder: (customerID: string) =>
        useGetEndpoint<GetCustomerActiveOrderResponse>(
            {
                inputUrl: `deliveries/activeOrder?customerID=${customerID}`,
                useAuth: true
            },
            {
                queryKey: ['customerActiveOrder', customerID],
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
                queryKey: ['getDeliveries'],
            }
        ),
    /**
     * Send the request by a user to accept a delivery for them to perform.
     * @param onSuccess Callback on successful request.
     * @returns Service endpoint for the current user to accept the given delivery
     */
    acceptDelivery: (onSuccess: (data: AcceptDeliveryResponse) => void) =>
        usePostEndpoint<AcceptDeliveryResponse, Error, AcceptDeliveryRequest>(
          {
            inputUrl: 'deliveries/accept',
            useAuth: false,
          },
          {
            onSuccess,
          }
        ),
    /**
     * Send the request by a user to update an order status.
     * @param onSuccess Callback on successful request.
     * @returns Success message of orderId and status updated to
     */
    updateOrderStatus: (onSuccess: (data: UpdateOrderStatusResponse) => void) =>
        usePostEndpoint<UpdateOrderStatusResponse, Error, UpdateOrderStatusRequest>(
          {
            inputUrl: 'deliveries/updateOrderStatus',
            useAuth: false,
          },
          {
            onSuccess,
          }
        )
}