import { Database, child, get, getDatabase, push, ref, remove, update } from "firebase/database"
import { Request, Response } from 'express';
import { OrderStatus } from "../schema/Order";
import { MenuItem } from "../schema/Restaurant";

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
        [`restaurants/${restaurantId}/ordering/${uniqueKey as string}`]: true,
        // Record order under the user ordering
        [`user/${userId}/ordering/${restaurantId}`]: uniqueKey as string
    };

    update(ref(database), updates)
    // Now add the item to the order
    .then(() => {
        return addItemToOrder(req, res, database, uniqueKey, restaurantId, {
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
    const { id: restaurantId, orderId } = req.params;
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
    addItemToOrder(req, res, database, orderId, restaurantId, {
        menuItemId, 
        optionSelected,
        addOnsSelected,
        quantity
    })
}

async function addItemToOrder(req: Request, res: Response, database: Database, orderId: string, restaurantId: string, orderObject: {
    menuItemId: string, optionSelected: string, addOnsSelected: Record<string, string>, quantity: number
}) {
    // Calculate the final price information
    const menuRef = `restaurants/${restaurantId}/information/categories`;
    const snapshot = await get(child(ref(getDatabase()), menuRef));
    if (!snapshot.exists()) {
        res.status(404).send({ data: "Something went wrong", error: "Invalid restaurant selected" });
        return;
    }
    let menuItem: MenuItem | undefined = undefined;
    for (const category of snapshot.val()) {
        menuItem = category.options.find((x: MenuItem) => x.name === orderObject.menuItemId);
        if (menuItem) {
            break;
        }
    }
    if (!menuItem) {
        res.status(404).send({ data: "Something went wrong", error: "Invalid menu item selected" });
        return;
    }
    const selectedOptionPrice = menuItem.options.find(x => x.name === orderObject.optionSelected)?.price;
    if (!selectedOptionPrice) {
        res.status(400).json({ data: "Something went wrong", error: "Invalid option selected" });
        return;
    }

    let price = selectedOptionPrice;
    if (menuItem.addOns) {
        price += menuItem.addOns.reduce((acc, addOn) => {
            // Find what add option the user has selected           
            const selectedOption = orderObject.addOnsSelected[addOn.name];
            // if (!selectedOption) {
            //     throw new Error("Invalid add on option selected");
            // }
            // Find the price of the selected add on option
            const addedPrice = addOn.addOns.find(a => a.name === selectedOption)?.additionalPrice || 0;
            return acc + addedPrice;
        }, 0) || 0;
    }

    // Add the item to the set of items
    const itemKey = push(child(ref(database), `orders/${orderId}/order/items`)).key;
    const itemLocation = `orders/${orderId}/order/items/${itemKey}`;
    const newObject = {
        ...orderObject,
        price,
    }
    // Push new item to order
    await update(ref(database, itemLocation), newObject)

    // Update the price of the entire order 
    // Get order object from database
    await get(ref(database, `orders/${orderId}/order/price`))
    .then((snapshot) => {
        const oldPrice = snapshot.exists() ? snapshot.val() : 0;
        const newPrice = oldPrice + price;
        update(ref(database, `orders/${orderId}/order`), { price: newPrice });
    })

    // Return order object in response
    const fullOrderSnapshot = await get(ref(database, `orders/${orderId}`))
    if (fullOrderSnapshot.exists()) { 
        const oldOrderObj = fullOrderSnapshot.val();
        res.status(201).send({ 
            orderKey: orderId, 
            menuKey: itemKey, 
            data: { ...oldOrderObj.order, id: orderId, status: oldOrderObj.tracking.status } 
        });
        return;
    } else {
        res.status(404).send({ data: "Something went wrong" });
        return;
    }
}

export function getOrder(req: Request, res: Response) {
    const database = getDatabase();
    const { orderId } = req.params;

    get(child(ref(database), `orders/${orderId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const value = snapshot.val();
            const items = value.order.items ?? {};
            res.send({ data: { ...value.order, id: orderId, items, status: value.tracking.status } });
            return;
        } else {
            res.status(404).send({ data: "Something went wrong" });
            return;
        }
    }).catch((error) => {
        console.error("Error retrieving data:", error);
        res.status(500).send("Internal server error");
    });
}

// Get the only in-progress order for the user
export async function getActiveOrder(req: Request, res: Response) {
    const database = getDatabase();
    const userId = 1;
    const restaurantId = req.params.id;
    const userOrderLocation = child(ref(database), `user/${userId}/ordering/${restaurantId}`);
    const userOrdersSnapshot = await get(userOrderLocation);
    if (!userOrdersSnapshot.exists()) {
        res.send({ data: null });
        return;
    }

    const orderId = userOrdersSnapshot.val();
    
    const orderLocation = child(ref(database), `orders/${orderId}`);
    const orderSnapshot = await get(orderLocation);
    if (!orderSnapshot.exists()) {
        res.send({ data: null });
        return;
    } else {
        const value = orderSnapshot.val();
        const items = value.order.items ?? {};
        res.send({ data: {...value.order, items, id: orderId, status: value.tracking.status } });
        return;
    }
}

export async function deleteItemFromOrder(req: Request, res: Response) {
    const { orderId, itemId } = req.params;

    const itemLocation = `orders/${orderId}/order/items/${itemId}`;
    const database = getDatabase();

    // Prevent deleting item if order already placed
    const trackingRef = ref(database, `orders/${orderId}/tracking`);
    get(trackingRef).then((snapshot) => {
        if (snapshot.exists()) {
            if (snapshot.val().status != OrderStatus.ORDERING) {
                res.status(400).send({ data: "Cannot delete items from an order that has already been placed" });
                return;
            }
        } else {
            res.status(404).send({ data: "Something went wrong" });
            return;
        }
    });

    const itemPriceLocation = child(ref(database), `orders/${orderId}/order/items/${itemId}/price`);
    const orderPriceLocation = child(ref(database), `orders/${orderId}/order`);

    // Update the price 
    const itemPrice = (await get(itemPriceLocation)).val()
    const order = await get(orderPriceLocation);
    const oldPrice = order.exists() ? order.val().price : 0;
    await update(orderPriceLocation, { price: oldPrice - itemPrice });

    // Remove the item
    remove(ref(database, itemLocation))
    .then(() => {
        const orderLocation = child(ref(database), `orders/${orderId}`);
        return get(orderLocation);
    }) 
    .then((orderSnapshot) => {
        if (!orderSnapshot.exists()) {
            res.status(500).send("Internal server error");
            return;
        } else {
            const items = orderSnapshot.val().order.items ?? {};
            res.send({ data: {...orderSnapshot.val().order, items, id: orderId, status: orderSnapshot.val().tracking.status }, orderKey: orderId });
            return;
        }
    })
    .catch((error) => {
        console.error("Error deleting item:", error);
        res.status(500).send("Internal server error");
    });
}

export async function placeOrder(req: Request, res: Response) {
    const database = getDatabase();
    const { orderId } = req.params;
    
    // Find the restaurant id of the order
    const userId = 1;
    const restaurantIdLocation = child(ref(database), `orders/${orderId}/restaurantId`);
    const restaurantIdSnapshot = await get(restaurantIdLocation);
    if (!restaurantIdSnapshot.exists() || !restaurantIdSnapshot.val()) {
        res.status(500).send("Internal server error");
        return;
    }
    // Remove this order from the list of in-progress (not yet placed) orders under the user and the restaurant.
    const restaurantId = restaurantIdSnapshot.val();
    const orderingLocation = child(ref(database), `user/${userId}/ordering/${restaurantId}`);
    await remove(orderingLocation);
    await remove(child(ref(database), `restaurants/${restaurantId}/ordering/${orderId}`));

    // Add this order as the active order saved under the user and the restaurant
    const activeOrderLocation = child(ref(database), `user/${userId}/activeOrders/`);
    await update(activeOrderLocation, { [restaurantId]: orderId } )
    await update(child(ref(database), `restaurants/${restaurantId}/activeOrders/`), { [orderId]: true });

    // Update the order status to ORDERED
    const trackingLocation = child(ref(database), `orders/${orderId}/tracking`);

    // Send back the order in the response
    await update(trackingLocation, { status: OrderStatus.ORDERED } )
    .then(() => {
        const orderLocation = child(ref(database), `orders/${orderId}`);
        return get(orderLocation);
    })
    .then((orderSnapshot) => {
        if (!orderSnapshot.exists()) {
            res.status(500).send("Internal server error");
            return;
        } else {
            const items = orderSnapshot.val().order.items ?? {};
            res.send({ data: {...orderSnapshot.val().order, items, id: orderId, status: orderSnapshot.val().tracking.status }, orderKey: orderId });
            return;
        }
    })
    .catch((error) => {
        console.error("Error placing order:", error);
        res.status(500).send("Internal server error");
    });
}