//import { Database, child, get, getDatabase, ref, limitToFirst, query } from "firebase/database"
import { Request, Response } from 'express';
import admin from '../firebase-config'
import { OrderStatus } from '../schema/Order';
// Get the only in-progress delivery for the courier
export async function getActiveDelivery(req: Request, res: Response) {
    const database = admin.database();
    const userId = req.query.courierID as string;
    const userOrdersRef = database.ref(`user/${userId}/activeDeliveries`);
    const pendingOrderQuery = userOrdersRef.limitToFirst(1);

    try {
        const snapshot = await pendingOrderQuery.get();
        if (snapshot.exists()) {
            res.status(200).send({ data: snapshot.val() });
        } else {
            res.status(404).send({ data: "Something went wrong" });
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).send("Internal server error");
    }
}

export async function getAvailableDeliveries(req: Request, res: Response) {
    const database = admin.database();
    const ordersRef = database.ref('orders');
  
    try {
      const snapshot = await ordersRef.orderByChild('tracking/status').equalTo(OrderStatus.ORDERED).once('value');
  
      if (snapshot.exists()) {
        const orders = snapshot.val();
        res.status(200).send({ data: orders });
      } else {
        res.status(404).send({ data: `No orders found with status ${OrderStatus.ORDERED}` });
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      res.status(500).send("Internal server error");
    }
}

export async function acceptDelivery(req: Request, res: Response) {
  const { orderId, userId } = req.body; 
  if (!userId || !orderId ) {
    return res.status(400).send({ error: 'userId, orderId, and courierId are required fields' });
  }

  const database = admin.database();
  const userRef = database.ref(`user/${userId}`);
  const orderRef = database.ref(`orders/${orderId}`);

  try {
    await userRef.update({ activeDelivery: orderId });

    await orderRef.update({ courierId: userId });

    await orderRef.update({
      courierId: userId,
      'tracking/status': OrderStatus.ACCEPTED
    });

    res.status(200).send({ message: `Active deliveries for user ${userId} updated successfully` });
  } catch (error) {
    console.error('Error updating activeDeliveries:', error);
    res.status(500).send('Internal server error');
  }
}