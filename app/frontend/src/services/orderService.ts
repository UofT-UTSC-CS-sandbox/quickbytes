import { useMutationEndpoint, createPost, useQueryEndpoint, createGet, createDelete } from "./base";
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
type SetPickUpLocationResponse = {}

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
        price: number;
        id: string;
        status: OrderStatus;
    }
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
        useMutationEndpoint<CreateOrderResponse, Error, CreateOrderRequest>(
            {
                mutationKey: ['createOrder', restaurantId],
                mutationFn: createPost({
                    inputUrl: `restaurants/${restaurantId}/order`, 
                    useAuth: false,
                }),
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
        useMutationEndpoint<AddItemResponse, Error, AddItemRequest>(
            {
                mutationKey: ['order', orderId, restaurantId],
                mutationFn: createPost({
                    inputUrl: `restaurants/${restaurantId}/order/${orderId}`,
                    useAuth: false,
                }),
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
        useMutationEndpoint<ItemDeleteResponse, Error, {id: string}>(
            {
                mutationKey: ['deleteItem', orderId],
                mutationFn: createDelete({
                    inputUrl: ({id}) => `restaurants/order/${orderId}/items/${id}`,
                    useAuth: false
                }),
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
        useMutationEndpoint<SetPickUpLocationResponse, Error, SetPickupLocationRequest>(
            {
                mutationKey: ['setPickupLocation', orderId],
                mutationFn: createPost({
                    inputUrl: `restaurants/order/${orderId}/pickup-location`,
                    useAuth: false
                }),
                onSuccess
            }
        ),
    /**
     * Place the order given so that the order can be moved to next stage. 
     * @param orderId The ID of an order in the ordering stage which will now be placed.
     * @param onSuccess The success callback of the request, containing the response body
     * @returns Service endpoint to place an item with a restaurant.
     */
    placeOrder: (orderId: string, onSuccess: (data: PlaceOrderResponse) => void) =>
        useMutationEndpoint<PlaceOrderResponse>(
            {
                mutationKey: ['placeOrder', orderId],
                mutationFn: createPost({
                    inputUrl: `restaurants/order/${orderId}/place`,
                    useAuth: false
                }),
                onSuccess
            }
        ),
    /**
     * Get the order that is in-progress and has not been placed, which
     * belongs to the current user at the given restaurant
     * @param restaurantId The ID of the restaurant to check for in-progress orders.
     * @returns 
     */
    getClientActiveOrder: (restaurantId: string | undefined) => 
        useQueryEndpoint<GetClientActiveOrderResponse>(
            {
                queryKey: ['getClientActiveOrder', restaurantId],
                queryFn: createGet({
                    inputUrl: `restaurants/${restaurantId}/order`,
                    useAuth: false,
                }),
                enabled: !!restaurantId,
            }
        )
}