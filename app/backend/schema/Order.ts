export enum OrderStatus {
    ORDERING = 'ORDERING',
    ORDERED = 'ORDERED',
    WAITING = 'WAITING',
    ACCEPTED = 'ACCEPTED',
    AWAITING_PICK_UP = 'AWAITING-PICK-UP',
    EN_ROUTE = 'EN-ROUTE',
    DELIVERED = 'DELIVERED',
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