import OrderStatus from "../model/OrderStatus";
import { useGetEndpoint, usePostEndpoint } from "./base";

type Restaurant = {
    location: string;
    restaurantName: string;
    restaurantId: number
}

export type ItemsOrdered = Record<string, {
    menuItemId: string,
    optionSelected: string,
    addOnsSelected?: Record<string, string>,
    quantity: number
}>

export type ActiveOrderItem = {
    courierId: string,
    courierSplit: number,
    order: {
        items: ItemsOrdered,
        price: number,
    },
    tracking: {
        courierAcceptedTime: false | number,
        courierDropoffTime: false | number,
        courierPickupTime: false | number,
        orderPlacedTime: number,
        dropOff: { lat: number, lng: number }
        status: OrderStatus
    },
    restaurant: Restaurant,
    orderId: string
}

/**
 * Response body for getCourierActiveOrder request
 */
type GetCourierActiveOrderResponse = {
    data: ActiveOrderItem
}

/**
 * Response body for getCourierActiveOrder request
 */
type GetCustomerActiveOrderResponse = {
    data: ActiveOrderItem
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
            dropOffName: string,
            orderPlacedTime: number
            status: OrderStatus
        },
        estimates?: {
            distanceMeters: number
            distance: string,
            time: string,
            timeSeconds: number
        },
    }>
}

/**
 * Request body for the POST request to accept the delivery.
 */
type AcceptDeliveryRequest = {
    orderId: string
}

type UpdateOrderStatusRequest = {
    orderId: string,
    status: OrderStatus,
    courierRequest: boolean
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
 * Request body for the setCustomerConfirmationPin request.
 */
type SetCustomerConfirmationPinRequest = {
    customerPin: string;
}

/**
 * Response body for the setCourierConfirmationPin request.
 */
type SetCustomerConfirmationPinResponse = {
    success: boolean;
    message: string;
    customerPin: string;
}

/**
 * Response body for the getCourierConfirmationPin request.
 */
type GetCustomerConfirmationPinResponse = {
    customerPin: string;
    message: string;
}

/**
 * Request body for the updateCourierConfirmationStatus request.
 */
type UpdateCustomerConfirmationStatusRequest = {}

/**
 * Response body for the updateCourierConfirmationStatus request.
 */
type UpdateCustomerConfirmationStatusResponse = {
    success: boolean;
    message: string;
}

/**
 * Response body for the getCourierConfirmationStatus request.
 */
type GetCustomerConfirmationStatusResponse = {
    isConfirmed: boolean;
    customerPin: string;
    message: string;
}

/**
 * All API endpoints related to retrieving and updating delivery information 
 * for a courier.
 */
export default {
    /**
     * Get the delivery that is currently being done by the logged in user as a courier
     * @returns Service endpoint to get the active delivery ID of the courier.
     */
    getCourierActiveOrder: () =>
        useGetEndpoint<GetCourierActiveOrderResponse>(
            {
                inputUrl: `deliveries/byMe`,
                useAuth: true
            },
            {
                queryKey: ['courierActiveOrder'],
            }
        ),
    /**
     * Get the order that is currently being delivered to the user that is logged in
     * @returns Service endpoint to get the active order ID of the customer.
     */
    getCustomerActiveOrder: () =>
        useGetEndpoint<GetCustomerActiveOrderResponse>(
            {
                inputUrl: `deliveries/toMe`,
                useAuth: true
            },
            {
                queryKey: ['customerActiveOrder'],
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
                useAuth: true
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
                useAuth: true,
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
                useAuth: true,
            },
            {
                onSuccess,
            }
        ),

    /**
     * Set the customer confirmation pin for the given active order.
     * 
     * When calling mutate() on the useMutation, supply the customer confirmation pin as
     * an object with customerPin.
     * 
     * @param onSuccess Success callback for the request, with the response body.
     * @returns Service endpoint to set the customer confirmation pin of the active order.
     */
    setCustomerConfirmationPin: (onSuccess: (data: SetCustomerConfirmationPinResponse) => void) =>
        usePostEndpoint<SetCustomerConfirmationPinResponse, Error, SetCustomerConfirmationPinRequest>(
            {
                inputUrl: `user/create-customer-confirm-pin`,
                useAuth: true
            },
            {
                mutationKey: ['setCustomerConfirmationPin'],
                onSuccess
            }
        ),

    /**
     * Get the customer confirmation pin for the given active order.
     * 
     * @returns Service endpoint to get the customer confirmation pin of the active order.
     */
    getCustomerConfirmationPin: (courierId?: string, enabled: boolean) =>
        useGetEndpoint<GetCustomerConfirmationPinResponse>(
            {
                inputUrl: `user/${courierId}/get-customer-confirm-pin`,
                useAuth: true
            },
            {
                queryKey: ['getCustomerConfirmationPin', courierId],
                enabled, // This will control whether the query is executed or not
            }
        ),

    /**
     * Update the customer confirmation status for the given active order.
     * 
     * @param onSuccess Success callback for the request, with the response body.
     * @returns Service endpoint to update the customer confirmation status of the active order.
     */
    updateCustomerConfirmationStatus: (onSuccess: (data: UpdateCustomerConfirmationStatusResponse) => void) =>
        usePostEndpoint<UpdateCustomerConfirmationStatusResponse, Error, UpdateCustomerConfirmationStatusRequest>(
            {
                inputUrl: `user/update-customer-confirm-status`,
                useAuth: true
            },
            {
                mutationKey: ['updateCustomerConfirmationStatus'],
                onSuccess
            }
        ),

    /**
     * Get the customer confirmation status for the given active order.
     * 
     * @returns Service endpoint to get the customer confirmation status of the active order.
     */
    getCustomerConfirmationStatus: () =>
        useGetEndpoint<GetCustomerConfirmationStatusResponse>(
            {
                inputUrl: `user/get-customer-confirm-status`,
                useAuth: true
            },
            {
                queryKey: ['getCustomerConfirmationStatus'],
            }
        )
}