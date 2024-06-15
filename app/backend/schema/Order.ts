export enum OrderStatus {
    // The starting status for an order when created.
    // Items can be added or removed from cart
    ORDERING = 'ORDERING',
    // Once the user finishes checkout, hence placing the order. Items cannot be modified.
    ORDERED = 'ORDERED',
    // Once a courier has accepted the order.
    ACCEPTED = 'ACCEPTED',
    // Once the restaurant worker has indicated that the food is ready for pickup
    AWAITING_PICK_UP = 'AWAITING-PICK-UP',
    // Once a courier has picked up the order from the restaurant and is en-route to customer
    EN_ROUTE = 'EN-ROUTE',
    // Once the courier and customer have met and handed over the order.
    DELIVERED = 'DELIVERED',
    // Order is cancelled for some reason.
    CANCELLED = 'CANCELLED',
}

export type Order = {
    userId: number;
    orderId: number;
    restaurantId: number;
    status: OrderStatus;
    items: {
        option: string;
        quantity: number;
        addOnOptions: { [key: string]: string };
        price: number;
    }[];
}