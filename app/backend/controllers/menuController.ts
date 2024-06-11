import { Database, child, equalTo, get, getDatabase, limitToFirst, orderByChild, push, query, ref, update } from "firebase/database"
import { Request, Response } from 'express';
import { OrderStatus } from "../schema/Order";

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

    get(child(ref(database), `restaurants/${req.params.id}/information`)).then((snapshot) => {
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

export async function createUserOrder(req: Request, res: Response) {
    const database = getDatabase();
    // TODO: Get unique identifier of user from auth and check user is authenticated.
    const userId = 1;
    const restaurantId = req.params.id;
    const { menuItemId, optionSelected, addOnsSelected, quantity } = req.body;

    // Generate a unique identifier for the order
    const uniqueKey = push(child(ref(database), `orders`)).key;
    if (!uniqueKey) {
        res.status(500).send({ data: "Something went wrong" });
        return;
    }

    let newOrderObject = {
        userId,
        restaurantId,
        courierId: false,
        order: {
            items: {

            },
            price: 0,
        },
        tracking: {
            status: OrderStatus.ORDERING,
            dropOff: {
                "lat": 0,
                "lng": 0
            },
            courierLocation: {

            },
            orderPlacedTime: Date.now(),
            courierAcceptedTime: false,
            courierPickupTime: false,
            courierDropoffTime: false,
        },
        courierSplit: 0,
    }

    const updates = {
        // Order object with all tracking and order information
        [`orders/${uniqueKey as string}`]: newOrderObject,
        // Record order under the restaurant for easy querying
        [`restaurants/${restaurantId}/activeOrders/${uniqueKey as string}`]: true,
        // Record order under the user ordering
        [`user/${userId}/activeOrders/${uniqueKey as string}`]: true
    };

    // Create order
    update(ref(database), updates)
    // Now add the item to the order
    .then(() => {
        addItemToOrder(req, res, database, uniqueKey, {
            menuItemId,
            optionSelected,
            addOnsSelected,
            quantity
        });
    })
    .catch((error) => {
        console.error("Error creating order:", error);
        res.status(500).send("Internal server error");
    });
}

export async function addToOrder(req: Request, res: Response) {
    const database = getDatabase();
    const { orderId } = req.params;
    const { menuItemId, optionSelected, addOnsSelected, quantity } = req.body;

    // Prevent adding to order if order already placed
    const trackingRef = ref(database, `orders/${orderId}/tracking`);
    get(trackingRef).then((snapshot) => {
        if (snapshot.exists()) {
            if (snapshot.val().status != OrderStatus.ORDERING) {
                res.status(400).send({ data: "Cannot add items to an order that has already been placed" });
            }
        } else {
            res.status(404).send({ data: "Something went wrong" });
        }
    });

    // Add our menu item to the newly made order.
    addItemToOrder(req, res, database, orderId, {
        menuItemId,
        optionSelected,
        addOnsSelected,
        quantity
    })
}

async function addItemToOrder(req: Request, res: Response, database: Database, orderId: string, orderObject: {
    menuItemId: string, optionSelected: string, addOnsSelected: Record<string, string>, quantity: number
}) {
    
    // Add the item to the set of items
    const itemKey = push(child(ref(database), `orders/${orderId}/order/items`)).key;
    const itemLocation = `orders/${orderId}/order/items/${itemKey}`;

    // Push new item to order
    update(ref(database, itemLocation), orderObject)
    // Get order object from database
    .then(() => {
        const orderRef = ref(database, `orders/${orderId}/order`);
        return get(orderRef);
    })
    // Return order object in response
    .then((snapshot) => {
        if (snapshot.exists()) {
            res.status(201).send({ 
                orderKey: orderId, 
                menuKey: itemKey, 
                data: { ...snapshot.val(), id: orderId } 
            });
        } else {
            res.status(404).send({ data: "Something went wrong" });
        }
    })
    .catch((error) => {
        console.error("Error creating order:", error);
        res.status(500).send("Internal server error");
    })
}

export function getOrder(req: Request, res: Response) {
    const database = getDatabase();
    const { orderId } = req.params;

    get(child(ref(database), `orders/${orderId}`)).then((snapshot) => {
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

// Get the only in-progress order for the user
export function getActiveOrder(req: Request, res: Response) {
    const database = getDatabase();
    const userId = 1;
    const restaurantId = req.params.id;
    const userOrders = child(ref(database), `orders/${restaurantId}/customer/${userId}/order`);
    const pendingOrder = query(userOrders, orderByChild('status'), equalTo(OrderStatus.ORDERING), limitToFirst(1));

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