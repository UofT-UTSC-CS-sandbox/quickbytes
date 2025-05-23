import { Request, Response } from 'express';
import { OrderStatus } from "../schema/Order";
import { MenuItem } from "../schema/Restaurant";
import admin from "../firebase-config";
import { DataSnapshot, Database } from 'firebase-admin/database';
import { lookupBuilding } from '../utils/lookupBuilding';

export function getAllRestaurants(req: Request, res: Response) {
    const database = admin.database();
    const restaurantsRef = database.ref('restaurants');

    restaurantsRef.get()
        .then((snapshot: DataSnapshot) => {
            if (snapshot.exists()) {
                const restaurants = snapshot.val();
                const data = restaurants
                    // The restaurants list is actually an array, so need to add ID and filter out null indices
                    .map((restaurant: any, index: number) => ({ ...restaurant, id: index }))
                    .filter((restaurant: any) => typeof restaurant.information !== 'undefined')
                    // Only return the general information, not menu info
                    .map((restaurant: any) => {
                        const { categories, ...rest } = restaurant.information;
                        const id = typeof restaurant.id === 'string' ? restaurant.id : restaurant.id.toString();
                        return { ...rest, id }
                    });
                res.send({ data });
            } else {
                res.status(404).send({ data: "Something went wrong" });
            }
        })
        .catch((error: Error) => {
            console.error("Error retrieving data:", error);
            res.status(500).send("Internal server error");
        });
}

export function getOneRestaurant(req: Request, res: Response) {
    const database = admin.database();
    const restaurantId = req.params.id;
    const restaurantRef = database.ref(`restaurants/${restaurantId}/information`);

    restaurantRef.get()
        .then((snapshot: DataSnapshot) => {
            if (snapshot.exists()) {
                res.send({ data: snapshot.val() });
            } else {
                res.status(404).send({ data: "Restaurant not found" });
            }
        })
        .catch((error: Error) => {
            console.error("Error retrieving restaurant:", error);
            res.status(500).send("Internal server error");
        });
}

export async function createUserOrder(req: Request, res: Response) {
    const database = admin.database();
    const userId = req.user!.uid;
    const restaurantId = req.params.id;
    const { menuItemId, optionSelected, addOnsSelected, quantity } = req.body;

    // Prevent user from placing this order if there is already an existing one
    const checkIfOrderingRef = database.ref(`user/${userId}`);
    // Get information of orders under the user's DB entry
    const checkIfOrdering = await checkIfOrderingRef.get();
    if (checkIfOrdering.exists()) {
        // Reject if there is any order IDs being kept under active orders or ordering
        if (!!checkIfOrdering.activeOrder) {
            // Send ambiguous error message
            res.status(404).send({ data: "Cannot create user order." });
            return;
        }
    }

    try {
        // Generate a unique key for the order
        const ordersRef = database.ref('orders');
        const newOrderRef = ordersRef.push();

        // Ensure the unique key was generated
        if (!newOrderRef.key) {
            res.status(500).send({ data: "Something went wrong" });
            return;
        }

        const restaurantInfoRef = database.ref(`restaurants/${restaurantId}/information`);
        const restaurantInfo = await restaurantInfoRef.get();
        if (!restaurantInfo.exists()) {
            res.status(500).send({ data: "Something went wrong" });
        }
        const restaurantInfoVal = restaurantInfo.val()

        // Construct the new order object
        let newOrderObject = {
            userId,
            restaurantId,
            restaurant: {
                restaurantId: restaurantId,
                location: restaurantInfoVal.address,
                restaurantName: restaurantInfoVal.name
            },
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
        };

        // Define updates for multiple locations in the database
        const updates = {
            // Order object with all tracking and order information
            [`orders/${newOrderRef.key}`]: newOrderObject,
            // Record order under the user for easy querying
            [`user/${userId}/activeOrder`]: newOrderRef.key
        };

        // Perform the database update
        await database.ref().update(updates);
        await addItemToOrder(req, res, database, newOrderRef.key, restaurantId, {
            menuItemId,
            optionSelected,
            addOnsSelected,
            quantity
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send("Internal server error");
    }
}

export async function addToOrder(req: Request, res: Response) {
    const database = admin.database();
    const { id: restaurantId, orderId } = req.params;
    const { menuItemId, optionSelected, addOnsSelected, quantity } = req.body;
    const userId = req.user!.uid;

    try {
        const orderRef = database.ref(`orders/${orderId}`);
        const snapshot = await orderRef.get();
        // Ensure that order exists
        if (!snapshot.exists()) {
            return res.status(404).send({ data: "Order not found" });
        }
        const order = snapshot.val();
        // Prevent adding to order if order already placed
        if (order.tracking.status !== OrderStatus.ORDERING) {
            return res.status(400).send({ data: "Cannot add items to an order that has already been placed" });
        }
        // Only allow the user who placed the order to add items to the order
        if (order.userId !== userId) {
            // Reject with 404 instead of 403, so that brute forcing possible IDs
            // doesn't reveal valid orders.
            return res.status(404).send({ data: "Order not found" });
        }

        // Add menu item to the order
        await addItemToOrder(req, res, database, orderId, restaurantId, {
            menuItemId,
            optionSelected,
            addOnsSelected,
            quantity
        });
    } catch (error) {
        console.error("Error adding item to order:", error);
        res.status(500).send("Internal server error");
    }
}

export async function addItemToOrder(req: Request, res: Response, database: Database, orderId: string, restaurantId: string, orderObject: {
    menuItemId: string, optionSelected: string, addOnsSelected: Record<string, string>, quantity: number
}) {
    try {
        // Prevent items from different restaurants from being added together in the same order
        const order = await database.ref(`orders/${orderId}`).get();

        if (!order.exists())
            return res.status(400).send({ data: "Something went wrong", error: "Order does not exist" });

        const orderData = order.val();

        // Only the user who placed this order can modify it
        const userId = req.user?.uid;
        if (orderData.userId != userId)
            return res.status(404).send({ data: "Order not found" });

        if (orderData.restaurant.restaurantId !== restaurantId) {
            return res.status(400).send({ data: "Something went wrong", error: "Invalid item combination." });
        }

        // Calculate the final price information
        const menuRef = `restaurants/${restaurantId}/information/categories`;
        const snapshot = await admin.database().ref(menuRef).get();

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
                const selectedOption = orderObject.addOnsSelected[addOn.name];
                const addedPrice = addOn.addOns.find(a => a.name === selectedOption)?.additionalPrice || 0;
                return acc + addedPrice;
            }, 0) || 0;
        }

        // Add the item to the set of items
        const itemKey = admin.database().ref(`orders/${orderId}/order/items`).push().key;
        const itemLocation = `orders/${orderId}/order/items/${itemKey}`;
        const newObject = {
            ...orderObject,
            price,
        };

        // Push new item to order
        await admin.database().ref(itemLocation).update(newObject);

        // Update the price of the entire order
        const orderPriceRef = admin.database().ref(`orders/${orderId}/order`);
        await orderPriceRef.get().then((snapshot: DataSnapshot) => {
            const oldPrice = snapshot.exists() ? snapshot.val().price : 0;
            const newPrice = oldPrice + price;
            return orderPriceRef.update({ price: newPrice });
        });

        // Return order object in response
        const fullOrderSnapshot = await admin.database().ref(`orders/${orderId}`).get();
        if (fullOrderSnapshot.exists()) {
            const oldOrderObj = fullOrderSnapshot.val();
            res.status(201).send({
                orderKey: orderId,
                menuKey: itemKey,
                data: { ...oldOrderObj.order, id: orderId, status: oldOrderObj.tracking.status, restaurant: oldOrderObj.restaurant }
            });
        } else {
            res.status(404).send({ data: "Something went wrong" });
        }
    } catch (error) {
        console.error("Error adding item to order:", error);
        res.status(500).send("Internal server error");
    }
}

export function getOrder(req: Request, res: Response) {
    const database = admin.database();
    const { orderId } = req.params;
    const userId = req.user!.uid;

    database.ref(`orders/${orderId}`).get()
        .then((snapshot: DataSnapshot) => {
            if (snapshot.exists()) {
                const value = snapshot.val();
                const userId = req.user?.uid; //TODO extract this from auth
                if (value.userId != userId && value.courierId != userId)
                    return res.status(404).send({ data: "Order not found" });
                const items = value.order.items ?? {};
                res.send({ data: { ...value.order, id: orderId, items, status: value.tracking.status } });
            } else {
                res.status(404).send({ data: "Something went wrong" });
            }
        })
        .catch((error: Error) => {
            console.error("Error retrieving data:", error);
            res.status(500).send("Internal server error");
        });
}

export function getOrderDropOff(req: Request, res: Response) {
    const database = admin.database();
    const orderId = req.params.orderId;
    const orderRef = database.ref(`orders/${orderId}`);

    orderRef.get()
        .then((snapshot: DataSnapshot) => {
            if (snapshot.exists()) {
                const orderData = snapshot.val();
                const userId = req.user?.uid;
                if (orderData.couriedId != userId && orderData.userId != userId)
                    return res.status(404).send({ data: "Order not found" });
                const trackingInfo = orderData.tracking;
                res.status(200).send({
                    data: trackingInfo.dropOff,
                    lat: trackingInfo.dropOff.lat,
                    lng: trackingInfo.dropOff.lng,
                    dropOffName: trackingInfo.dropOffName
                });
            } else {
                res.status(404).send({ data: "Something went wrong" });
            }
        })
        .catch((error: Error) => {
            console.error("Error retrieving data:", error);
            res.status(500).send("Internal server error");
        });
}

/**
 * Get the current order in progress (user is still ordering, or awaiting delivery)
 * for the logged in user. Looks first for an order under "ordering", then under
 * "activeOrder". This may differ from other active order endpoints because
 * it can also return an order that is being created but not yet placed.
 */
export async function getCustomerInProgressOrder(req: Request, res: Response) {
    const database = admin.database();
    const userId = req.user!.uid;

    try {
        const userOrderLocation = database.ref(`user/${userId}/activeOrder`);
        const orderIdSnapshot = await userOrderLocation.get();

        if (!orderIdSnapshot.exists()) {
            return res.send({ data: null });
        }
        
        const orderId = orderIdSnapshot.val();
        const orderLocation = database.ref(`orders/${orderId}`);
        const orderSnapshot = await orderLocation.get();

        if (!orderSnapshot.exists()) {
            res.send({ data: null });
            return;
        } else {
            const value = orderSnapshot.val();
            if (value.userId != userId)
                return res.status(404).send({ data: "Order not found" });
            const items = value.order.items ?? {};
            res.send({ data: { ...value.order, items, id: orderId, status: value.tracking.status, restaurant: value.restaurant } });
            return;
        }
    } catch (error) {
        console.log(`getCustomerInProgressOrder error for user ${userId}:`, error);
        res.status(500).send({ data: null });
    }
}

export async function deleteItemFromOrder(req: Request, res: Response) {
    const { orderId, itemId } = req.params;
    const database = admin.database();
    const userId = req.user!.uid;

    const itemLocation = `orders/${orderId}/order/items/${itemId}`;

    // Prevent deleting item if order already placed
    const trackingRef = database.ref(`orders/${orderId}/tracking`);
    try {
        const snapshot = await trackingRef.get();
        if (snapshot.exists()) {
            const value = snapshot.val();
            const userId = req.user?.uid; // TODO extract this from auth
            if (value.userId != userId)
                return res.status(404).send({ data: "Order not found" });
            if (value.status !== OrderStatus.ORDERING) {
                res.status(400).send({ data: "Cannot delete items from an order that has already been placed" });
                return;
            }
        } else {
            res.status(404).send({ data: "Something went wrong" });
            return;
        }
    } catch (error) {
        console.error("Error checking order status:", error);
        res.status(500).send("Internal server error");
        return;
    }

    const itemPriceLocation = database.ref(`orders/${orderId}/order/items/${itemId}/price`);
    const orderPriceLocation = database.ref(`orders/${orderId}/order`);

    try {
        // Update the order price
        const itemPriceSnapshot = await itemPriceLocation.get();
        const itemPrice = itemPriceSnapshot.val();
        const orderSnapshot = await orderPriceLocation.get();
        const oldPrice = orderSnapshot.exists() ? orderSnapshot.val().price : 0;
        await orderPriceLocation.update({ price: oldPrice - itemPrice });

        // Remove the item from the order
        await database.ref(itemLocation).remove();

        // Fetch updated order data
        const orderLocation = database.ref(`orders/${orderId}`);
        const orderSnapshotAfterDelete = await orderLocation.get();

        if (orderSnapshotAfterDelete.exists()) {
            const items = orderSnapshotAfterDelete.val().order.items ?? {};
            res.send({
                data: { ...orderSnapshotAfterDelete.val().order, items, id: orderId, status: orderSnapshotAfterDelete.val().tracking.status },
                orderKey: orderId
            });
        } else {
            res.status(500).send("Internal server error");
        }
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).send("Internal server error");
    }
}

export async function placeOrder(req: Request, res: Response) {
    const database = admin.database();
    const { orderId } = req.params;
    const userId = req.user!.uid;
    try {
        // Get the entire order data for validation, and update tracking later
        const orderLocation = database.ref(`orders/${orderId}`);
        const orderSnapshot = await orderLocation.get();
        if (!orderSnapshot.exists()) {
            return res.status(404).send({ data: "Order not found" });
        }
        const orderInfo = orderSnapshot.val();
        // Only the customer can place their own order
        if (orderInfo.userId != userId) {
            return res.status(404).send({ data: "Order not found" });
        }
        const restaurantId = orderInfo.restaurant.restaurantId;

        // Check that the restaurant exists
        const restaurantIdSnapshot = await database.ref(`orders/${orderId}/restaurantId`).get();
        if (!restaurantIdSnapshot.exists() || !restaurantIdSnapshot.val()) {
            return res.status(500).send("Internal server error");
        }

        // Add this order as the active order saved under the restaurant
        await database.ref(`restaurants/${restaurantId}/activeOrders/`).update({ [orderId]: true });

        if (orderSnapshot.exists()) {
            const orderInfo = orderSnapshot.val();
            const items = orderInfo.order.items ?? {};

            // Save a distance and time estimate from the restaurant to pick up
            const restaurantLocation = database.ref(`restaurants/${restaurantId}/information`);
            const restaurantSnapshot = await restaurantLocation.get();
            const restaurantValues = restaurantSnapshot.val();
            const queryParams = new URLSearchParams({
                origins: `${restaurantValues.coordinateX},${restaurantValues.coordinateY}`,
                destinations: `${orderInfo.tracking.dropOff.lat},${orderInfo.tracking.dropOff.lng}`,
                mode: 'walking',
                key: process.env.GOOGLE_MAPS_API_KEY as string
            });
            const distanceMatrixRequestURL = `https://maps.googleapis.com/maps/api/distancematrix/json?${queryParams}`;
            const distanceMatrixResponse = await fetch(distanceMatrixRequestURL);

            // If the connection fails, log and return an error
            if (!distanceMatrixResponse.ok) {
                console.log("Internal server error. Could not connect to map services. Status:", distanceMatrixResponse.status, "-", distanceMatrixResponse.statusText, "Tried URL:", distanceMatrixRequestURL);
                res.status(500).send("Internal server error. Could not connect to map services.");
                return;
            }

            const distanceMatrixData = await distanceMatrixResponse.json();

            // If GCP API call fails or is rejected, log and return an error
            if (distanceMatrixData.status !== 'OK') {
                console.log("Internal server error. Could not use map services. Status:", distanceMatrixData.status, "Tried URL:", distanceMatrixRequestURL);
                res.status(500).send("Internal server error. Could not use map services.");
                return;
            }

            // Save the distance and time estimates under the estimates information on the order tracking
            const distanceMatrixEstimates = database.ref(`orders/${orderId}/estimates`);
            await distanceMatrixEstimates.set({
                distanceMeters: distanceMatrixData.rows[0].elements[0].distance.value,
                distance: distanceMatrixData.rows[0].elements[0].distance.text,
                time: distanceMatrixData.rows[0].elements[0].duration.text,
                timeSeconds: distanceMatrixData.rows[0].elements[0].duration.value
            })

            // Update the order status to ORDERED
            const trackingLocation = database.ref(`orders/${orderId}/tracking`);
            await trackingLocation.update({ status: OrderStatus.ORDERED });

            res.send({
                data: { ...orderInfo.order, restaurant: orderInfo.restaurant, items, id: orderId, status: orderInfo.tracking.status },
                orderKey: orderId
            });
        } else {
            res.status(500).send("Internal server error");
        }
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).send("Internal server error");
    }
}

export async function setPickupLocation(req: Request, res: Response) {
    const { orderId } = req.params;
    const { lat, lng } = req.body;
    const userId = req.user?.uid;

    const database = admin.database();
    const orderUserRef = `orders/${orderId}/userId`;
    const dropOffLocation = `orders/${orderId}/tracking/dropOff`;

    try {
        // Check if the userId of the order matches the issuer of the request
        const orderSnapshot = await database.ref(orderUserRef).get();
        const orderUserId = orderSnapshot.val();

        if (orderUserId !== userId) {
            return res.status(404).send({ data: "Order not found" });
        }

        const building = lookupBuilding(lat, lng);
        const locationName = building ? building.name : "On campus";

        const updates: Record<string, any> = {
            [`${dropOffLocation}/lat`]: lat,
            [`${dropOffLocation}/lng`]: lng,
            [`orders/${orderId}/tracking/dropOffName`]: locationName,
        };

        await database.ref().update(updates);
        res.status(200).send({ dropOff: { lat, lng }, dropOffName: locationName });
    } catch (error) {
        console.error("Error updating pickup location:", error);
        res.status(500).send("Internal server error");
    }
}

export async function getRestaurantLocation(req: Request, res: Response) {
    const { orderId } = req.params;

    const database = admin.database();
    const orderref = `orders/${orderId}`;

    try {
        const snapshot = await database.ref(orderref).get();
        const orderdata = snapshot.val();
        const userId = req.user?.uid;
        if (orderdata.userId != userId && orderdata.couriedId != userId)
            return res.status(404).send({ data: "Order not found" });

        const restaurantId = orderdata.restaurant.restaurantId;
        console.log(restaurantId, "restaurant id")

        const restaurantSnapshot = await database.ref(`restaurants/${restaurantId}/information/location`).get();
        const location = restaurantSnapshot.val();
        if (location) {
            res.status(200).json(location);
        } else {
            res.status(404).json({ error: 'Pickup location not set' });
        }
    } catch (error) {
        console.error("Error fetching pickup location:", error);
        res.status(500).send("Internal server error");
    }
}

export const getActiveRestaurantorders = async (req: Request, res: Response) => {
    const { restaurantId } = req.params;
    const db = admin.database();
    try {
        const ref = db.ref(`restaurants/${restaurantId}/activeOrders`);
        const snapshot = await ref.get();

        if (!snapshot.exists()) {
            return res.status(404).json({ error: 'Restaurant not found or no active orders' });
        }

        const activeOrders = snapshot.val();
        const orderIds = Object.keys(activeOrders);

        res.status(200).json({ orderIds });
    } catch (error) {
        console.error('Error getting active orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}