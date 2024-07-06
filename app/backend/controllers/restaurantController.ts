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
    const loadOrders = await Promise.all(
        inProgressOrderIDs.map((orderId) => {
            const orderRef = database.ref(`orders/${orderId}`);
            return orderRef.get()
                .then((snapshot: any) => snapshot.exists() ? { orderId, ...snapshot.val() } : null)
                .catch((error: Error) => null);
        })
    );

    res.send({ data: loadOrders.filter(x => x !== null) });
}

export async function createCourierConfirmationPin(req: Request, res: Response) {
    const { restaurantId, orderId } = req.params;
    const { courierPin } = req.body;

    if (!courierPin || typeof courierPin !== 'string' || courierPin.length !== 4) {
        return res.status(400).send({ message: "Invalid PIN format. It should be a 4-digit string." });
    }

    const database = admin.database();
    const orderRef = database.ref(`restaurants/${restaurantId}/activeOrders/${orderId}`);

    try {
        await orderRef.update({ confirmationPin: courierPin });
        res.status(200).send({ success: true, message: "Courier confirmation pin added successfully." });
    } catch (error) {
        console.error('Error updating confirmation pin:', error);
        res.status(500).send({ success: false, message: "Internal server error." });
    }
}

export async function getCourierConfirmationPin(req: Request, res: Response) {
    const { restaurantId, orderId } = req.params;

    const database = admin.database();
    const orderRef = database.ref(`restaurants/${restaurantId}/activeOrders/${orderId}`);

    try {
        const snapshot = await orderRef.get();
        if (!snapshot.exists()) {
            return res.status(404).send({ success: false, message: "Order not found." });
        }

        const orderData = snapshot.val();
        if (orderData && orderData.confirmationPin) {
            return res.status(200).send({ success: true, courierPin: orderData.confirmationPin });
        } else {
            return res.status(404).send({ success: false, message: "Confirmation PIN not found." });
        }
    } catch (error) {
        console.error('Error fetching confirmation PIN:', error);
        res.status(500).send({ success: false, message: "Internal server error." });
    }
}

export async function updateCourierConfirmationStatus(req: Request, res: Response) {
    const { restaurantId, orderId } = req.params;

    const database = admin.database();
    const orderRef = database.ref(`restaurants/${restaurantId}/activeOrders/${orderId}`);

    try {
        await orderRef.update({ isCourierConfirmed: true });
        res.status(200).send({ success: true, message: "Courier confirmation status updated successfully." });
    } catch (error) {
        console.error('Error updating courier confirmation status:', error);
        res.status(500).send({ success: false, message: "Internal server error." });
    }
}

export async function getCourierConfirmationStatus(req: Request, res: Response) {
    const { restaurantId, orderId } = req.params;

    const database = admin.database();
    const orderRef = database.ref(`restaurants/${restaurantId}/activeOrders/${orderId}`);

    try {
        const snapshot = await orderRef.get();
        if (!snapshot.exists()) {
            return res.status(404).send({ success: false, message: "Order not found." });
        }

        const orderData = snapshot.val();
        if (orderData && orderData.isCourierConfirmed) {
            return res.status(200).send({ success: true, isConfirmed: true, courierPin: orderData.confirmationPin || null });
        } else {
            return res.status(200).send({ success: true, isConfirmed: false, courierPin: orderData.confirmationPin || null });
        }
    } catch (error) {
        console.error('Error fetching confirmation status:', error);
        res.status(500).send({ success: false, message: "Internal server error." });
    }
}