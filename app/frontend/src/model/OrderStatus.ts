enum OrderStatus {
    // The starting status for an order when created.
    // Items can be added or removed from cart
    ORDERING = 'ORDERING',
    // Once the user finishes checkout, hence placing the order. Items cannot be modified.
    ORDERED = 'ORDERED',
    // Once a courier has accepted the order.
    ACCEPTED = 'ACCEPTED',
    // Once the restaurant worker has indicated that the food is ready for pickup
    AWAITING_PICK_UP = 'AWAITING-PICK-UP',
    // Once the courier has indicated that they have arrived at the restaurant
    ARRIVED = 'ARRIVED',
    // Once a courier has picked up the order from the restaurant and is en-route to customer
    EN_ROUTE = 'EN-ROUTE',
    // Once the courier and customer have met and handed over the order.
    DELIVERED = 'DELIVERED',
    // Order is cancelled for some reason.
    CANCELLED = 'CANCELLED',
}

export function convertOrderStatusToString(orderStatus: OrderStatus) {
    switch (orderStatus) {
        case OrderStatus.ORDERING:
            return 'Order not yet placed';
        case OrderStatus.ORDERED:
            return 'Order placed and awaiting courier match';
        case OrderStatus.ACCEPTED:
            return 'Order placed and courier en-route';
        case OrderStatus.AWAITING_PICK_UP:
            return 'Waiting for courier pickup';
        case OrderStatus.EN_ROUTE:
            return 'En route to customer';
        case OrderStatus.DELIVERED:
            return 'Delivered to customer';
        case OrderStatus.CANCELLED:
            return 'Order cancelled';
        default:
            return orderStatus
    }
}

export function convertOrderStatusToStringCustomerFriendly(orderStatus: OrderStatus) {
    switch (orderStatus) {
        case OrderStatus.ORDERING:
            return 'Your order has not been placed yet.';
        case OrderStatus.ORDERED:
            return 'We are currently waiting to match a courier to your order.';
        case OrderStatus.ACCEPTED:
            return 'Your order is being prepared.';
        case OrderStatus.AWAITING_PICK_UP:
            return 'The courier is en route to pick up your order.';
        case OrderStatus.EN_ROUTE:
            return 'The courier is currently on the way to your delivery location.';
        case OrderStatus.DELIVERED:
            return 'Your order was successfully delivered.';
        case OrderStatus.CANCELLED:
            return 'Your order was cancelled.';
        default:
            return orderStatus
    }
}

export default OrderStatus;