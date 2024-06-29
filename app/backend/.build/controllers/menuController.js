"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPickupLocation = exports.placeOrder = exports.deleteItemFromOrder = exports.getActiveOrder = exports.getOrderDropOff = exports.getOrder = exports.addItemToOrder = exports.addToOrder = exports.createUserOrder = exports.getOneRestaurant = exports.getAllRestaurants = void 0;
const Order_1 = require("../schema/Order");
const firebase_config_1 = __importDefault(require("../firebase-config"));
function getAllRestaurants(req, res) {
    const database = firebase_config_1.default.database();
    const restaurantsRef = database.ref('restaurants');
    restaurantsRef.once('value')
        .then((snapshot) => {
        if (snapshot.exists()) {
            res.send({ data: snapshot.val() });
        }
        else {
            res.status(404).send({ data: "Something went wrong" });
        }
    })
        .catch((error) => {
        console.error("Error retrieving data:", error);
        res.status(500).send("Internal server error");
    });
}
exports.getAllRestaurants = getAllRestaurants;
function getOneRestaurant(req, res) {
    const database = firebase_config_1.default.database();
    const restaurantId = req.params.id;
    const restaurantRef = database.ref(`restaurants/${restaurantId}/information`);
    restaurantRef.once('value')
        .then((snapshot) => {
        if (snapshot.exists()) {
            res.send({ data: snapshot.val() });
        }
        else {
            res.status(404).send({ data: "Restaurant not found" });
        }
    })
        .catch((error) => {
        console.error("Error retrieving restaurant:", error);
        res.status(500).send("Internal server error");
    });
}
exports.getOneRestaurant = getOneRestaurant;
function createUserOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = firebase_config_1.default.database();
        // TODO: Get unique identifier of user from auth and check user is authenticated.
        const userId = 1; // Replace with actual user ID logic
        const restaurantId = req.params.id;
        const { menuItemId, optionSelected, addOnsSelected, quantity } = req.body;
        try {
            // Generate a unique key for the order
            const ordersRef = database.ref('orders');
            const newOrderRef = ordersRef.push();
            // Ensure the unique key was generated
            if (!newOrderRef.key) {
                res.status(500).send({ data: "Something went wrong" });
                return;
            }
            const restaurantInfoRef = database.ref(`restaurants/${restaurantId}/information`);
            const restaurantInfo = yield restaurantInfoRef.get();
            if (!restaurantInfo.exists()) {
                res.status(500).send({ data: "Something went wrong" });
            }
            const restaurantInfoVal = restaurantInfo.val();
            // Construct the new order object
            let newOrderObject = {
                userId,
                restaurantId,
                restaurant: {
                    restaurantId: restaurantId,
                    location: restaurantInfoVal.address,
                    restaurantName: restaurantInfoVal.name
                },
                courierId: false,
                order: {
                    items: {},
                    price: 0,
                },
                tracking: {
                    status: Order_1.OrderStatus.ORDERING,
                    dropOff: {
                        "lat": 0,
                        "lng": 0
                    },
                    courierLocation: {},
                    orderPlacedTime: Date.now(),
                    courierAcceptedTime: false,
                    courierPickupTime: false,
                    courierDropoffTime: false,
                },
                courierSplit: 0,
            };
            // Define updates for multiple locations in the database
            const updates = {
                // Order object with all tracking and order information
                [`orders/${newOrderRef.key}`]: newOrderObject,
                // Record order under the restaurant for easy querying
                [`restaurants/${restaurantId}/ordering/${newOrderRef.key}`]: true,
                // Record order under the user ordering
                [`user/${userId}/ordering/${restaurantId}`]: newOrderRef.key
            };
            // Perform the database update
            yield database.ref().update(updates);
            yield addItemToOrder(req, res, database, newOrderRef.key, restaurantId, {
                menuItemId,
                optionSelected,
                addOnsSelected,
                quantity
            });
        }
        catch (error) {
            console.error("Error creating order:", error);
            res.status(500).send("Internal server error");
        }
    });
}
exports.createUserOrder = createUserOrder;
function addToOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = firebase_config_1.default.database();
        const { id: restaurantId, orderId } = req.params;
        const { menuItemId, optionSelected, addOnsSelected, quantity } = req.body;
        try {
            // Prevent adding to order if order already placed
            const trackingRef = database.ref(`orders/${orderId}/tracking`);
            const snapshot = yield trackingRef.get();
            if (snapshot.exists()) {
                if (snapshot.val().status !== Order_1.OrderStatus.ORDERING) {
                    res.status(400).send({ data: "Cannot add items to an order that has already been placed" });
                    return;
                }
            }
            else {
                res.status(404).send({ data: "Order not found" });
                return;
            }
            // Add menu item to the order
            yield addItemToOrder(req, res, database, orderId, restaurantId, {
                menuItemId,
                optionSelected,
                addOnsSelected,
                quantity
            });
        }
        catch (error) {
            console.error("Error adding item to order:", error);
            res.status(500).send("Internal server error");
        }
    });
}
exports.addToOrder = addToOrder;
function addItemToOrder(req, res, database, orderId, restaurantId, orderObject) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // Calculate the final price information
            const menuRef = `restaurants/${restaurantId}/information/categories`;
            const snapshot = yield firebase_config_1.default.database().ref(menuRef).get();
            if (!snapshot.exists()) {
                res.status(404).send({ data: "Something went wrong", error: "Invalid restaurant selected" });
                return;
            }
            let menuItem = undefined;
            for (const category of snapshot.val()) {
                menuItem = category.options.find((x) => x.name === orderObject.menuItemId);
                if (menuItem) {
                    break;
                }
            }
            if (!menuItem) {
                res.status(404).send({ data: "Something went wrong", error: "Invalid menu item selected" });
                return;
            }
            const selectedOptionPrice = (_a = menuItem.options.find(x => x.name === orderObject.optionSelected)) === null || _a === void 0 ? void 0 : _a.price;
            if (!selectedOptionPrice) {
                res.status(400).json({ data: "Something went wrong", error: "Invalid option selected" });
                return;
            }
            let price = selectedOptionPrice;
            if (menuItem.addOns) {
                price += menuItem.addOns.reduce((acc, addOn) => {
                    var _a;
                    const selectedOption = orderObject.addOnsSelected[addOn.name];
                    const addedPrice = ((_a = addOn.addOns.find(a => a.name === selectedOption)) === null || _a === void 0 ? void 0 : _a.additionalPrice) || 0;
                    return acc + addedPrice;
                }, 0) || 0;
            }
            // Add the item to the set of items
            const itemKey = firebase_config_1.default.database().ref(`orders/${orderId}/order/items`).push().key;
            const itemLocation = `orders/${orderId}/order/items/${itemKey}`;
            const newObject = Object.assign(Object.assign({}, orderObject), { price });
            // Push new item to order
            yield firebase_config_1.default.database().ref(itemLocation).update(newObject);
            // Update the price of the entire order
            const orderPriceRef = firebase_config_1.default.database().ref(`orders/${orderId}/order`);
            yield orderPriceRef.get().then((snapshot) => {
                const oldPrice = snapshot.exists() ? snapshot.val().price : 0;
                const newPrice = oldPrice + price;
                return orderPriceRef.update({ price: newPrice });
            });
            // Return order object in response
            const fullOrderSnapshot = yield firebase_config_1.default.database().ref(`orders/${orderId}`).get();
            if (fullOrderSnapshot.exists()) {
                const oldOrderObj = fullOrderSnapshot.val();
                res.status(201).send({
                    orderKey: orderId,
                    menuKey: itemKey,
                    data: Object.assign(Object.assign({}, oldOrderObj.order), { id: orderId, status: oldOrderObj.tracking.status })
                });
            }
            else {
                res.status(404).send({ data: "Something went wrong" });
            }
        }
        catch (error) {
            console.error("Error adding item to order:", error);
            res.status(500).send("Internal server error");
        }
    });
}
exports.addItemToOrder = addItemToOrder;
function getOrder(req, res) {
    const database = firebase_config_1.default.database();
    const { orderId } = req.params;
    firebase_config_1.default.database().ref(`orders/${orderId}`).get()
        .then((snapshot) => {
        var _a;
        if (snapshot.exists()) {
            const value = snapshot.val();
            const items = (_a = value.order.items) !== null && _a !== void 0 ? _a : {};
            res.send({ data: Object.assign(Object.assign({}, value.order), { id: orderId, items, status: value.tracking.status }) });
        }
        else {
            res.status(404).send({ data: "Something went wrong" });
        }
    })
        .catch((error) => {
        console.error("Error retrieving data:", error);
        res.status(500).send("Internal server error");
    });
}
exports.getOrder = getOrder;
function getOrderDropOff(req, res) {
    const database = firebase_config_1.default.database();
    const orderId = req.params.orderId;
    const orderRef = database.ref(`orders/${orderId}/tracking/dropOff`);
    orderRef.get()
        .then((snapshot) => {
        if (snapshot.exists()) {
            res.status(200).send({ data: snapshot.val() });
        }
        else {
            res.status(404).send({ data: "Something went wrong" });
        }
    })
        .catch((error) => {
        console.error("Error retrieving data:", error);
        res.status(500).send("Internal server error");
    });
}
exports.getOrderDropOff = getOrderDropOff;
// Get the only in-progress order for the user
function getActiveOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const database = firebase_config_1.default.database();
        const userId = 1; // Replace with actual user ID retrieval logic
        const restaurantId = req.params.id;
        const userOrderLocation = database.ref(`user/${userId}/ordering/${restaurantId}`);
        try {
            const userOrdersSnapshot = yield userOrderLocation.get();
            if (!userOrdersSnapshot.exists()) {
                res.send({ data: null });
                return;
            }
            const orderId = userOrdersSnapshot.val();
            const orderLocation = database.ref(`orders/${orderId}`);
            const orderSnapshot = yield orderLocation.get();
            if (!orderSnapshot.exists()) {
                res.send({ data: null });
                return;
            }
            else {
                const value = orderSnapshot.val();
                const items = (_a = value.order.items) !== null && _a !== void 0 ? _a : {};
                res.send({ data: Object.assign(Object.assign({}, value.order), { items, id: orderId, status: value.tracking.status }) });
                return;
            }
        }
        catch (error) {
            console.error("Error retrieving data:", error);
            res.status(500).send("Internal server error");
        }
    });
}
exports.getActiveOrder = getActiveOrder;
function deleteItemFromOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { orderId, itemId } = req.params;
        const database = firebase_config_1.default.database();
        const itemLocation = `orders/${orderId}/order/items/${itemId}`;
        // Prevent deleting item if order already placed
        const trackingRef = database.ref(`orders/${orderId}/tracking`);
        try {
            const snapshot = yield trackingRef.get();
            if (snapshot.exists()) {
                if (snapshot.val().status !== Order_1.OrderStatus.ORDERING) {
                    res.status(400).send({ data: "Cannot delete items from an order that has already been placed" });
                    return;
                }
            }
            else {
                res.status(404).send({ data: "Something went wrong" });
                return;
            }
        }
        catch (error) {
            console.error("Error checking order status:", error);
            res.status(500).send("Internal server error");
            return;
        }
        const itemPriceLocation = database.ref(`orders/${orderId}/order/items/${itemId}/price`);
        const orderPriceLocation = database.ref(`orders/${orderId}/order`);
        try {
            // Update the order price
            const itemPriceSnapshot = yield itemPriceLocation.get();
            const itemPrice = itemPriceSnapshot.val();
            const orderSnapshot = yield orderPriceLocation.get();
            const oldPrice = orderSnapshot.exists() ? orderSnapshot.val().price : 0;
            yield orderPriceLocation.update({ price: oldPrice - itemPrice });
            // Remove the item from the order
            yield database.ref(itemLocation).remove();
            // Fetch updated order data
            const orderLocation = database.ref(`orders/${orderId}`);
            const orderSnapshotAfterDelete = yield orderLocation.get();
            if (orderSnapshotAfterDelete.exists()) {
                const items = (_a = orderSnapshotAfterDelete.val().order.items) !== null && _a !== void 0 ? _a : {};
                res.send({
                    data: Object.assign(Object.assign({}, orderSnapshotAfterDelete.val().order), { items, id: orderId, status: orderSnapshotAfterDelete.val().tracking.status }),
                    orderKey: orderId
                });
            }
            else {
                res.status(500).send("Internal server error");
            }
        }
        catch (error) {
            console.error("Error deleting item:", error);
            res.status(500).send("Internal server error");
        }
    });
}
exports.deleteItemFromOrder = deleteItemFromOrder;
function placeOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const database = firebase_config_1.default.database();
        const { orderId } = req.params;
        try {
            // Find the restaurant id of the order
            const userId = 1;
            const restaurantIdLocation = database.ref(`orders/${orderId}/restaurantId`);
            const restaurantIdSnapshot = yield restaurantIdLocation.get();
            if (!restaurantIdSnapshot.exists() || !restaurantIdSnapshot.val()) {
                res.status(500).send("Internal server error");
                return;
            }
            const restaurantId = restaurantIdSnapshot.val();
            // Remove this order from the list of in-progress (not yet placed) orders under the user and the restaurant.
            const orderingLocation = database.ref(`user/${userId}/ordering/${restaurantId}`);
            yield orderingLocation.remove();
            yield database.ref(`restaurants/${restaurantId}/ordering/${orderId}`).remove();
            // Add this order as the active order saved under the user and the restaurant
            const activeOrderLocation = database.ref(`user/${userId}/activeOrders/`);
            yield activeOrderLocation.update({ [restaurantId]: orderId });
            yield database.ref(`restaurants/${restaurantId}/activeOrders/`).update({ [orderId]: true });
            // Update the order status to ORDERED
            const trackingLocation = database.ref(`orders/${orderId}/tracking`);
            yield trackingLocation.update({ status: Order_1.OrderStatus.ORDERED });
            // Send back the order in the response
            const orderLocation = database.ref(`orders/${orderId}`);
            const orderSnapshot = yield orderLocation.get();
            if (orderSnapshot.exists()) {
                const items = (_a = orderSnapshot.val().order.items) !== null && _a !== void 0 ? _a : {};
                res.send({
                    data: Object.assign(Object.assign({}, orderSnapshot.val().order), { items, id: orderId, status: orderSnapshot.val().tracking.status }),
                    orderKey: orderId
                });
            }
            else {
                res.status(500).send("Internal server error");
            }
        }
        catch (error) {
            console.error("Error placing order:", error);
            res.status(500).send("Internal server error");
        }
    });
}
exports.placeOrder = placeOrder;
function setPickupLocation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { orderId } = req.params;
        const { lat, lng } = req.body;
        const database = firebase_config_1.default.database();
        const dropOffLocation = `orders/${orderId}/tracking/dropOff`;
        const updates = {
            [`${dropOffLocation}/lat`]: lat,
            [`${dropOffLocation}/lng`]: lng
        };
        try {
            yield database.ref().update(updates);
            res.status(200).send({ message: "Pickup location updated successfully." });
        }
        catch (error) {
            console.error("Error updating pickup location:", error);
            res.status(500).send("Internal server error");
        }
    });
}
exports.setPickupLocation = setPickupLocation;
