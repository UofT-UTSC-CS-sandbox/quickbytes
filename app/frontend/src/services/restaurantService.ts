import { MenuCategory } from "../model/Menu"
import OrderStatus from "../model/OrderStatus"
import { useGetEndpoint } from "./base"

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
 * All API endpoints related to retrieving and updating information related
 * to restaurants and their menus.
 */
export default {
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
        )
}