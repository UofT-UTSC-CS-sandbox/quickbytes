import { usePostEndpoint, useGetEndpoint, useDeleteEndpoint } from "./base";
import { OrderCart } from "../model/OrderCart";
import OrderStatus from "../model/OrderStatus";

/**
 * POST request body for the useCreateOrder request
 */
type CreateOrderRequest = {
    menuItemId: string,
    optionSelected: string,
    addOnsSelected: Record<string, string>,
    quantity: number,
}

/**
 * Response body for the useCreateOrder request
 */
type CreateOrderResponse = {
    data: OrderCart;
    orderKey: string;
    itemKey: string;
}

/**
 * POST request body for the useAddItem request
 */
type AddItemRequest = CreateOrderRequest;

/**
 * Response body for the useAddItem request
 */
type AddItemResponse = CreateOrderResponse;

type ItemDeleteResponse = {
    data: OrderCart;
    orderKey: string;
}

/**
 * Response body for the placeOrder request.
 */
type PlaceOrderResponse = ItemDeleteResponse;

/**
 * Request body for the setPickupLocation request.
 */
type SetPickupLocationRequest = { lat: number, lng: number }

/**
 * Response body for the setPickupLocation request.
 */
type SetPickUpLocationResponse = {
    dropOff: { lat: number, lng: number },
    dropOffName: string,
}

/* The restaurant object, used when obtaining an active order */
type Restaurant = {
    location: string;
    restaurantName: string;
    restaurantId: number
}

/**
 * Response body for the getClientActiveOrder request.
 */
type GetClientActiveOrderResponse = {
    data: {
        items: Record< string,
            {
                menuItemId: string,
                optionSelected: string,
                addOnsSelected: Record<string, string>,
                price: number,
                quantity: number,
            }>;
        restaurant: {
            address: string;
            restaurantName: string;
            restaurantId: string
        }
        price: number;
        id: string;
        status: OrderStatus;
    } | null;
}

/**
 * The response body for getUserActiveOrders
 */
export type ActiveOrderResponse = { 
    data: ActiveOrderItem
}

/**
 * Represents a menu item in an order returned in the 
 * getUserActiveOrders response body.
 */
export type ItemsOrdered = Record<string, {
    menuItemId: string,
    optionSelected: string,
    addOnsSelected?: Record<string, string>,
    quantity: number
}>

/**
 * Represents an active order returned in the getUserActiveOrders
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
    },
    restaurant: Restaurant,
    orderId: string
}

/**
 * All API endpoints related to creating and modifying a customer's menu
 * order with a restaurant.
 */
export default {
    /**
     * Create a new order for the current user at the given restaurant.
     * @param restaurantId ID of the restaurant to create order at.
     * @param onSuccess Success callback for the request, containing the response body
     * @returns Service endpoint to create an order.
     */
    useCreateOrder: (restaurantId: string, onSuccess: (data: CreateOrderResponse) => void) => 
        usePostEndpoint<CreateOrderResponse, Error, CreateOrderRequest>(
            {
                inputUrl: `restaurants/${restaurantId}/order`, 
                useAuth: false,
            },
            {
                mutationKey: ['createOrder', restaurantId],
                onSuccess
            }
        )
    ,
    /**
     * Add an existing item to the order matching the given order ID and restaurant.
     * @param restaurantId ID of the restaurant which the order is for.
     * @param orderId ID of the order to add the item to.
     * @param onSuccess Success callback for the request, containing the response body
     * @returns Service endpoint to add an item to a cart.
     */
    useAddItem: (restaurantId: string | undefined, orderId: string | undefined, onSuccess: (data: AddItemResponse) => void) => 
        usePostEndpoint<AddItemResponse, Error, AddItemRequest>(
            { 
                inputUrl: `restaurants/${restaurantId}/order/${orderId}`,
                useAuth: true
            },
            {
                mutationKey: ['order', orderId, restaurantId],
                onSuccess,
            }
        ),
    /**
     * Delete an existing item from the order.
     * @param orderId The ID of the entire order.
     * @param onSuccess Success callback for the request, containing the response body
     * @returns Service endpoint to delete an item from a order.
     */
    deleteItem: (orderId: string, onSuccess: (data: ItemDeleteResponse) => void) => 
        useDeleteEndpoint<ItemDeleteResponse, Error, {id: string}>(
            {
                inputUrl: ({id}) => `restaurants/order/${orderId}/items/${id}`,
                useAuth: false
            },
            {
                mutationKey: ['deleteItem', orderId],
                onSuccess
            }
        ),
    /**
     * Set the pickup location for the given order.
     * 
     * When calling mutate() on the useMutation, supply the pickup location as
     * an object with lat (latitude) and lng (longitude).
     * 
     * @param orderId The ID of the entire order.
     * @param onSuccess Success callback for the request, with the response body.
     * @returns Service endpoint to set the pickup location of the order.
     */
    setPickupLocation: (orderId: string, onSuccess: (data: SetPickUpLocationResponse) => void) => 
        usePostEndpoint<SetPickUpLocationResponse, Error, SetPickupLocationRequest>(
            {
                inputUrl: `restaurants/order/${orderId}/pickup-location`,
                useAuth: false
            },
            {
                mutationKey: ['setPickupLocation', orderId],
                onSuccess,
            }
        ),
    /**
     * Place the order given so that the order can be moved to next stage. 
     * @param orderId The ID of an order in the ordering stage which will now be placed.
     * @param onSuccess The success callback of the request, containing the response body
     * @returns Service endpoint to place an item with a restaurant.
     */
    placeOrder: (orderId: string, onSuccess: (data: PlaceOrderResponse) => void) =>
        usePostEndpoint<PlaceOrderResponse>(
            {
                inputUrl: `restaurants/order/${orderId}/place`,
                useAuth: false
            },
            {
                mutationKey: ['placeOrder', orderId],
                onSuccess
            }
        ),
    /**
     * Get the order that is in-progress and has not been placed, which
     * belongs to the current user at the given restaurant
     * @param restaurantId The ID of the restaurant to check for in-progress orders.
     * @returns Service endpoint to get the current non-placed order for the user.
     */
    getClientActiveOrder: (restaurantId: string | undefined) => 
        useGetEndpoint<GetClientActiveOrderResponse>(
            {
                inputUrl: `restaurants/${restaurantId}/order`,
                useAuth: false,
            },
            {
                queryKey: ['getClientActiveOrder', restaurantId],
                enabled: !!restaurantId,
            }
        ),
    // TODO: Consider merging getClientActiveOrder and getClientInProgressOrder once
    // the directions map component is refactored, since the 
    // customer is not allowed to have two active orders at the same time,
    // especially involving different restaurants.
    
    /**
     * Get the sole order that the user is currently editing or awaiting delivery
     * for as a customer. This differs from getClientActiveOrders in that it
     * can also return an order that is being created but not yet placed.
     * @returns Service endpoint to get the current non-placed order for the user.
     */
    getClientInProgressOrder: () => 
        useGetEndpoint<GetClientActiveOrderResponse>(
            {
                inputUrl: `restaurants/my-order`,
                useAuth: false,
            },
            {
                queryKey: ['getSingleClientActiveOrder'],
            }
        ),
     /**
     * Get the array of active orders corresponding to the particular user.
     * @param userId The ID of the user to get orders for.
     * @returns Service endpoint to get the orders for the user.
     */
    getClientActiveOrders: (userId: string) => 
        useGetEndpoint<ActiveOrderResponse>(
            {
                inputUrl: `user/${userId}/orders`,
                useAuth: false,
            },
            {
                queryKey: ['getUserOrders', userId],
                enabled: !!userId,
            }
        )
}