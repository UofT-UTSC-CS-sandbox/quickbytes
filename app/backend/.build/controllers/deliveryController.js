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
exports.acceptDelivery = exports.getAvailableDeliveries = exports.getActiveDelivery = void 0;
const firebase_config_1 = __importDefault(require("../firebase-config"));
const Order_1 = require("../schema/Order");
// Get the only in-progress delivery for the courier
function getActiveDelivery(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = firebase_config_1.default.database();
        const userId = req.query.courierID;
        const userOrdersRef = database.ref(`user/${userId}/activeDeliveries`);
        const pendingOrderQuery = userOrdersRef.limitToFirst(1);
        try {
            const snapshot = yield pendingOrderQuery.get();
            if (snapshot.exists()) {
                res.status(200).send({ data: snapshot.val() });
            }
            else {
                res.status(404).send({ data: "Something went wrong" });
            }
        }
        catch (error) {
            console.error("Error retrieving data:", error);
            res.status(500).send("Internal server error");
        }
    });
}
exports.getActiveDelivery = getActiveDelivery;
function getAvailableDeliveries(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = firebase_config_1.default.database();
        const ordersRef = database.ref('orders');
        try {
            const snapshot = yield ordersRef.orderByChild('tracking/status').equalTo(Order_1.OrderStatus.ORDERED).once('value');
            if (snapshot.exists()) {
                const orders = snapshot.val();
                res.status(200).send({ data: orders });
            }
            else {
                res.status(404).send({ data: `No orders found with status ${Order_1.OrderStatus.ORDERED}` });
            }
        }
        catch (error) {
            console.error("Error retrieving data:", error);
            res.status(500).send("Internal server error");
        }
    });
}
exports.getAvailableDeliveries = getAvailableDeliveries;
function acceptDelivery(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { orderId, userId } = req.body;
        if (!userId || !orderId) {
            return res.status(400).send({ error: 'userId, orderId, and courierId are required fields' });
        }
        const database = firebase_config_1.default.database();
        const userRef = database.ref(`user/${userId}`);
        const orderRef = database.ref(`orders/${orderId}`);
        try {
            yield userRef.update({ activeDelivery: orderId });
            yield orderRef.update({ courierId: userId });
            yield orderRef.update({
                courierId: userId,
                'tracking/status': Order_1.OrderStatus.ACCEPTED
            });
            res.status(200).send({ message: `Active deliveries for user ${userId} updated successfully` });
        }
        catch (error) {
            console.error('Error updating activeDeliveries:', error);
            res.status(500).send('Internal server error');
        }
    });
}
exports.acceptDelivery = acceptDelivery;
