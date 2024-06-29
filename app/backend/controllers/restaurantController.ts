import { Request, Response } from 'express';
import admin from "../firebase-config";

// Get all active orders for the given restaurantId
export async function getInProgressOrders(req: Request, res: Response) {
    const database = admin.database();
    const { restaurantId } = req.params;

    const activeOrdersRef = database.ref(`restaurants/${restaurantId}/activeOrders`);
    const activeOrdersSnapshot = await activeOrdersRef.get();
    if (!activeOrdersSnapshot.exists()) {
        res.status(404).send({ data: "No active orders found" });
        return;
    }

    const activeOrders = activeOrdersSnapshot.val();
    const inProgressOrderIDs = Object.keys(activeOrders);

    // Fetch all orders by ID in parallel
    const loadOrders = await Promise.all(inProgressOrderIDs.map((orderId) => {
        const orderRef = database.ref(`orders/${orderId}`);
        return orderRef.get().then((snapshot: any) => snapshot.exists() ? { orderId, ...snapshot.val()} : null)
        .catch((error: Error) => null);
    }));

    res.send({ data: loadOrders.filter(x => x !== null) });
}