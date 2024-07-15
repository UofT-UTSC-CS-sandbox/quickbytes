import { MenuCategory } from "../model/Menu"
import OrderStatus from "../model/OrderStatus"
import { useGetEndpoint, usePostEndpoint } from "./base"

type AllRestaurantsResponse = {
    data: {
        name: string,
        description: string
        address: string,
        coordinateX: number,
        coordinateY: number,
        id: string
    }[]
}

/**
 * Response body for getMenu request
 */
type RestaurantMenuResponse = {
    data: {
        name: string,
        description: string
        address: string,
        categories: MenuCategory[]
    }
}

/**
 * The response body for getRestaurantActiveOrders
 */
export type ActiveOrderResponse = {
    data: ActiveOrderItem[]
}

/**
 * Represents a menu item in an order returned in the 
 * getRestaurantActiveOrders response body.
 */
export type ItemsOrdered = Record<string, {
    menuItemId: string,
    optionSelected: string,
    addOnsSelected?: Record<string, string>,
    quantity: number
}>

/**
 * Represents an active order returned in the getRestaurantActiveOrders
 */
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
    }
    orderId: string
}

/**
 * Request body for the setCourierConfirmationPin request.
 */
type SetCourierConfirmationPinRequest = {
    courierPin: string;
}

/**
 * Response body for the setCourierConfirmationPin request.
 */
type SetCourierConfirmationPinResponse = {
    success: boolean;
    message: string;
}

/**
 * Response body for the getCourierConfirmationPin request.
 */
type GetCourierConfirmationPinResponse = {
    courierPin: string;
    message: string;
}

/**
 * Request body for the updateCourierConfirmationStatus request.
 */
type UpdateCourierConfirmationStatusRequest = {}

/**
 * Response body for the updateCourierConfirmationStatus request.
 */
type UpdateCourierConfirmationStatusResponse = {
    success: boolean;
    message: string;
}

/**
 * Response body for the getCourierConfirmationStatus request.
 */
type GetCourierConfirmationStatusResponse = {
    isConfirmed: boolean;
    courierPin: string;
    message: string;
}

/**
 * All API endpoints related to retrieving and updating information related
 * to restaurants and their menus.
 */
export default {
    getAllRestaurants: () =>
        useGetEndpoint<AllRestaurantsResponse>(
            {
                inputUrl: 'restaurants',
                useAuth: false,
            },
            {
                queryKey: ['getAllRestaurants'],
            }
        ),

    /**
     * Get the basic details of a restaurant including the entire menu.
     * @param restaurantId The ID of the restaurant to get the menu for.
     * @returns Service endpoint to get restaurant information and its menu.
     */
    getMenu: (restaurantId: string | undefined) =>
        useGetEndpoint<RestaurantMenuResponse>(
            {
                inputUrl: `restaurants/${restaurantId}`,
                useAuth: false,
            },
            {
                queryKey: ['getMenu', restaurantId],
            }
        ),
    /**
     * Get active orders of the restaurant, primarily those that have been
     * marked as recent and/or in-progress.
     * @param restaurantId The ID of the restaurant to get orders for.
     * @returns Service endpoint to get active orders.
     */
    getRestaurantActiveOrders: (restaurantId: string | undefined) =>
        useGetEndpoint<ActiveOrderResponse>(
            {
                inputUrl: `staff/${restaurantId}/orders`,
                useAuth: false,
            },
            {
                queryKey: ['getRestaurantActiveOrders', restaurantId],
            }
        ),

    /**
     * Set the courier confirmation pin for the given active order.
     * 
     * When calling mutate() on the useMutation, supply the courier confirmation pin as
     * an object with courierPin.
     * 
     * @param restaurantId The ID of the restaurant to get orders for.
     * @param orderId The ID of the entire active order.
     * @param onSuccess Success callback for the request, with the response body.
     * @returns Service endpoint to set the courier confirmation pin of the active order.
     */
    setCourierConfirmationPin: (restaurantId: number, orderId: string, onSuccess: (data: SetCourierConfirmationPinResponse) => void) =>
        usePostEndpoint<SetCourierConfirmationPinResponse, Error, SetCourierConfirmationPinRequest>(
            {
                inputUrl: `staff/${restaurantId}/${orderId}/confirm-pin`,
                useAuth: false
            },
            {
                mutationKey: ['setCourierConfirmationPin', restaurantId, orderId],
                onSuccess
            }
        ),

    /**
     * Get the courier confirmation pin for the given active order.
     * 
     * @param restaurantId The ID of the restaurant to get the pin for.
     * @param orderId The ID of the entire active order.
     * @returns Service endpoint to get the courier confirmation pin of the active order.
     */
    getCourierConfirmationPin: (restaurantId: number, orderId: string) =>
        useGetEndpoint<GetCourierConfirmationPinResponse>(
            {
                inputUrl: `staff/${restaurantId}/${orderId}/get-pin`,
                useAuth: false
            },
            {
                queryKey: ['getCourierConfirmationPin', restaurantId, orderId],
            }
        ),

    /**
     * Update the courier confirmation status for the given active order.
     * 
     * @param restaurantId The ID of the restaurant to update the status for.
     * @param orderId The ID of the entire active order.
     * @param onSuccess Success callback for the request, with the response body.
     * @returns Service endpoint to update the courier confirmation status of the active order.
     */
    updateCourierConfirmationStatus: (restaurantId: number, orderId: string, onSuccess: (data: UpdateCourierConfirmationStatusResponse) => void) =>
        usePostEndpoint<UpdateCourierConfirmationStatusResponse, Error, UpdateCourierConfirmationStatusRequest>(
            {
                inputUrl: `staff/${restaurantId}/${orderId}/update-confirm-status`,
                useAuth: false
            },
            {
                mutationKey: ['updateCourierConfirmationStatus', restaurantId, orderId],
                onSuccess
            }
        ),

    /**
     * Get the courier confirmation status for the given active order.
     * 
     * @param restaurantId The ID of the restaurant to get the status for.
     * @param orderId The ID of the entire active order.
     * @returns Service endpoint to get the courier confirmation status of the active order.
     */
    getCourierConfirmationStatus: (restaurantId: number, orderId: string) =>
        useGetEndpoint<GetCourierConfirmationStatusResponse>(
            {
                inputUrl: `staff/${restaurantId}/${orderId}/confirm-status`,
                useAuth: false
            },
            {
                queryKey: ['getCourierConfirmationStatus', restaurantId, orderId],
            }
        )

}