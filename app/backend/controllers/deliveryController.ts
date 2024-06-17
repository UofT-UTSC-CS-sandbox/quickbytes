//import { Database, child, get, getDatabase, ref, limitToFirst, query } from "firebase/database"
import { Request, Response } from 'express';
import admin from '../firebase-config'
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