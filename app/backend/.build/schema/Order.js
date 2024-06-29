"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    // The starting status for an order when created.
    // Items can be added or removed from cart
    OrderStatus["ORDERING"] = "ORDERING";
    // Once the user finishes checkout, hence placing the order. Items cannot be modified.
    OrderStatus["ORDERED"] = "ORDERED";
    // Once a courier has accepted the order.
    OrderStatus["ACCEPTED"] = "ACCEPTED";
    // Once the restaurant worker has indicated that the food is ready for pickup
    OrderStatus["AWAITING_PICK_UP"] = "AWAITING-PICK-UP";
    // Once a courier has picked up the order from the restaurant and is en-route to customer
    OrderStatus["EN_ROUTE"] = "EN-ROUTE";
    // Once the courier and customer have met and handed over the order.
    OrderStatus["DELIVERED"] = "DELIVERED";
    // Order is cancelled for some reason.
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
