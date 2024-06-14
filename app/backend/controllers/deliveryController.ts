import { Database, child, get, getDatabase, ref, limitToFirst, query } from "firebase/database"
import { Request, Response } from 'express';
// Get the only in-progress delivery for the courier
export function getActiveDelivery(req: Request, res: Response) {
    const database = getDatabase();
    const userId = req.query.courierID;
    const userOrders = child(ref(database), `user/${userId}/activeDeliveries`);
    const pendingOrder = query(userOrders, limitToFirst(1));
  
    get(pendingOrder).then((snapshot) => {
        if (snapshot.exists()) {
            res.status(200).send({ data: snapshot.val() });
        } else {
            res.status(404).send({ data: "Something went wrong" });
        }
    }).catch((error) => {
        console.error("Error retrieving data:", error);
        res.status(500).send("Internal server error");
    });
}