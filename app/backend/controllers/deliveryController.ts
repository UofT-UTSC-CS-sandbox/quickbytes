//import { Database, child, get, getDatabase, ref, limitToFirst, query } from "firebase/database"
import { Request, Response } from 'express';
import admin from '../firebase-config'
// Get the only in-progress delivery for the courier

const database = admin.database();

export async function getActiveDelivery(req: Request, res: Response) {
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


export const getDeliveryStatus = async (req: Request, res: Response) => {
    const orderId = req.params.id;
    try {
      const snapshot = await database.ref(`deliveries/${orderId}`).once('value');
      if (snapshot.exists()) {
        const deliveryData = snapshot.val();
        res.status(200).json({
            ...deliveryData,
            currentLocation: deliveryData.location // Include current location
          });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  };
  
  export const updateDeliveryLocation = async (req: Request, res: Response) => {
    const { orderId, location } = req.body;
    try {
      await database.ref(`deliveries/${orderId}`).update({ location });
      res.status(200).json({ message: 'Location updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  };