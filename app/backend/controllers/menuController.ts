import { child, get, getDatabase, ref } from "firebase/database"
import { Request, Response } from 'express';

export function getAllRestaurants(req: Request, res: Response) {
    const database = getDatabase();

    get(child(ref(database), `restaurants`)).then((snapshot) => {
        if (snapshot.exists()) {
            res.send({ data: snapshot.val() });
        } else {
            res.status(404).send({ data: "Something went wrong" });
        }
    }).catch((error) => {
        console.error("Error retrieving data:", error);
        res.status(500).send("Internal server error");
    });
}

export function getOneRestaurant(req: Request, res: Response) {
    const database = getDatabase();
    
    get(child(ref(database), `restaurants/${req.params.id}`)).then((snapshot) => {
        if (snapshot.exists()) {
            res.send({ data: snapshot.val() });
        } else {
            res.status(404).send({ data: "Something went wrong" });
        }
    }).catch((error) => {
        console.error("Error retrieving data:", error);
        res.status(500).send("Internal server error");
    });
}