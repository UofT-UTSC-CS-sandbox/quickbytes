import { Request, Response } from 'express';
import admin from '../firebase-config';
import { OrderStatus } from '../schema/Order';

// Get the only in-progress delivery for the courier
export async function getActiveDelivery(req: Request, res: Response) {
  const database = admin.database();
  const userId = req.user!.uid;

  try {
    // Reference to the user's active delivery
    const userDeliveriesRef = database.ref(`user/${userId}/activeDelivery`);

    // Fetch the user's active delivery
    const snapshot = await userDeliveriesRef.get();

    if (snapshot.exists()) {
      const deliveryId = snapshot.val();

      if (typeof deliveryId !== 'string') {
        console.error('Invalid activeDelivery value:', deliveryId);
        return res.status(500).json({ message: 'Invalid active delivery format' });
      }

      // Reference to the specific delivery
      const deliveryRef = database.ref(`orders/${deliveryId}`);

      // Fetch the delivery data
      const deliverySnapshot = await deliveryRef.get();

      if (deliverySnapshot.exists()) {
        if (deliverySnapshot.val().courierId !== userId) {
          return res.status(404).send({ data: "Order not found" });
        }
        const delivery = deliverySnapshot.val();
        res.status(200).json({ data: delivery });
      } else {
        res.status(404).json({ message: 'Delivery not found' });
      }
    } else {
      res.status(200).send({ data: null }); // Send null to indicate no active delivery
    }
  } catch (error) {
    console.error('Error retrieving active deliveries:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getAvailableDeliveries(req: Request, res: Response): Promise<void> {
  const database = admin.database();
  const ordersRef = database.ref('orders');

  try {
    const snapshot = await ordersRef.orderByChild('tracking/status').equalTo(OrderStatus.ORDERED).get();

    if (snapshot.exists()) {
      const ordersData = snapshot.val() as Record<string, any>;
      const filteredOrders: Record<string, any> = {};

      // A delivery is not available for a user if they
      // are the one that placed it
      for (const [key, order] of Object.entries(ordersData)) {
        if (order.userId !== req.user?.uid) {
          filteredOrders[key] = order;
        }
      }

      res.status(200).json({ data: filteredOrders });
    } else {
      res.status(404).json({ data: `No orders found with status ${OrderStatus.ORDERED}` });
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).send("Internal server error");
  }
}

export async function acceptDelivery(req: Request, res: Response): Promise<void> {
  const userId = req.user!.uid;
  const { orderId } = req.body;

  if (!orderId) {
    res.status(400).send({ error: 'orderId is required field' });
    return;
  }

  const database = admin.database();
  const userRef = database.ref(`user/${userId}`);
  const orderRef = database.ref(`orders/${orderId}`);

  try {
    const orderSnapshot = await orderRef.get();
    const orderData = orderSnapshot.val();

    // Check if the order exists and retrieve the userId associated with the order
    if (!orderData) {
      res.status(404).send({ error: 'Order not found' });
      return;
    }

    const orderUserId = orderData.userId;

    // Check if the user is trying to accept their own delivery
    if (orderUserId === userId) {
      res.status(403).send({ error: 'You cannot accept your own delivery' });
      return;
    }

    // Update user's active delivery
    await userRef.update({ activeDelivery: orderId });


    await orderRef.update({
      courierId: userId,
      'tracking/status': OrderStatus.ACCEPTED
    });

    const pickupCoordinates = orderData?.tracking?.dropOff;

    if (!pickupCoordinates || typeof pickupCoordinates.lat === "undefined" || typeof pickupCoordinates.lng === "undefined") {
      res.status(404).send({ error: 'Pickup coordinates not found' });
      return;
    }

    res.status(200).send({
      message: `Active deliveries for user ${userId} updated successfully`,
      pickupCoordinates: {
        lat: pickupCoordinates.lat,
        lng: pickupCoordinates.lng
      }
    });
  } catch (error) {
    console.error('Error updating activeDeliveries:', error);
    res.status(500).send('Internal server error');
  }
}

// Get the active order for the courier
export async function getActiveOrder(req: Request, res: Response) {
  const database = admin.database();
  const userId = req.user!.uid;
  console.log(userId, "THIS IS THE USERID!!!")

  try {
    // Reference to the user's active order
    const userOrdersRef = database.ref(`user/${userId}/activeOrder`);

    // Fetch the user's active order
    const snapshot = await userOrdersRef.get();

    if (snapshot.exists()) {
      const orderId = snapshot.val();

      if (typeof orderId !== 'string') {
        console.error('Invalid activeOrder value:', orderId);
        return res.status(500).json({ message: 'Invalid active order format' });
      }

      // Reference to the specific order
      const orderRef = database.ref(`orders/${orderId}`);

      // Fetch the order data
      const orderSnapshot = await orderRef.get();

      if (orderSnapshot.exists()) {
        if (orderSnapshot.val().userId !== userId) {
          return res.status(404).send({ data: "Order not found" });
        }
        const order = orderSnapshot.val();
        order.orderId = orderId;
        
        res.status(200).json({ data: order });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } else {
      res.status(200).send({ data: null }); // Send null to indicate no active order
    }
  } catch (error) {
    console.error('Error retrieving active orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  const { orderId, status, courierRequest } = req.body;
  const isValidOrderStatus = (status: any): status is OrderStatus => {
    return Object.values(OrderStatus).includes(status);
  };

  if (!orderId || !status) {
    return res.status(400).send({ error: 'orderId and status are required fields' });
  }
  else if (!isValidOrderStatus(status)) {
    return res.status(400).send({ error: 'Invalid order status' });
  }

  const database = admin.database();
  const orderRef = database.ref(`orders/${orderId}`);


  try {
    const orderSnapshot = await orderRef.get();
    const orderData = orderSnapshot.val();

    // Ensure that the issuer of this request has permission to modify this request
    // Only the courier or customer of this request can make changes
    const userId = req.user?.uid; //TODO extract this from auth
    if ((courierRequest && orderData.courierId !== userId) || // The request was made by the courier
      // but the courier is not delivering this order
      (!courierRequest && orderData.userId !== userId)) // The request was made by the customer
      // but the customer did not place this order
      return res.status(404).send({ data: "Order not found" });

    if (status === OrderStatus.CANCELLED) {
      if (orderData.tracking.status === OrderStatus.EN_ROUTE) {
        return res.status(400).send({ error: 'Cannot cancel order that has been picked up' });
      }
      // set order status to cancelled so customer gets a notification
      await orderRef.update({
        'tracking/status': status
      }).then(
        // set order back to ordered so courier can accept it in deliveries
        await orderRef.update({
          /* An order is only truly cancelled at the customer's request */
          'tracking/status': courierRequest ? OrderStatus.ORDERED : OrderStatus.CANCELLED,
          'courierId': null
        }))
      /* Remove from active delivery/order */
      if (!orderData) {
        return res.status(404).send({ error: `Order ${orderId} not found` });
      }

      const customerId = orderData.tracking.userId;
      const courierId = orderData.courierId;

      /* A courier cancellation should not remove the order from the customer */
      if (!courierRequest && customerId) {
        const customerRef = database.ref(`user/${customerId}/activeOrder`);
        await customerRef.remove();
      }

      /* Any cancellation should yield the same result for the courier */
      if (courierId) {
        const courierRef = database.ref(`user/${courierId}/activeDelivery`);
        await courierRef.remove();
      }

      res.status(200).send({
        message: `Order ${orderId} cancelled successfully`
      });
    } else {
      await orderRef.update({
        'tracking/status': status
      });
      res.status(200).send({
        message: `Active order status for order ${orderId} updated to ${status} successfully`
      });
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).send('Internal server error');
  }
}

export const getDeliveryStatus = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const database = admin.database();
  try {
    const snapshot = await database.ref(`orders/${orderId}`).get();
    if (snapshot.exists()) {
      const deliveryData = snapshot.val();
      const courierId = deliveryData.courierId;

      const userId = req.user?.uid; // TOOD extract this from auth
      // Verify that the issuer of this request is in some way associated with the order
      if (deliveryData.courierId !== userId && deliveryData.userId !== userId)
        return res.status(404).send({ data: "Order not found" });

      const courierSnapshot = await database.ref(`user/${courierId}/currentLocation`).get();
      const currentLocation = courierSnapshot.exists() ? courierSnapshot.val() : null;

      //restaurant location
      const restaurantId = deliveryData.restaurant.restaurantId;
      const restaurantSnapshot = await database.ref(`restaurants/${restaurantId}`).get();
      const restaurantData = restaurantSnapshot.val();
      const pickUp = restaurantData.information.location;

      res.status(200).json({
        ...deliveryData,
        currentLocation, // Include current location
        pickUp,
        //status,
      });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateDeliveryLocation = async (req: Request, res: Response) => {
  const { courierId, location } = req.body;
  const database = admin.database();
  if (!courierId || !location) {
    return res.status(400).json({ message: 'Courier ID and location are required' });
  }

  try {
    await database.ref(`user/${courierId}/currentLocation`).set(location);
    res.status(200).json({ message: 'Location updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getCurrentLocationFromOrder = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;

  try {
    // Fetch user data from Firebase Realtime Database
    console.log("this is the orderid: ", orderId)
    const orderDataSnap = await admin.database().ref(`orders/${orderId}`).get();
    const orderData = orderDataSnap.exists() ? orderDataSnap.val() : null;

    
    const courierId = orderData.courierId;
    console.log("this is the orderdata:", orderData)
    console.log("this is the courierid: ", courierId)
    const userId = req.user?.uid; // TODO extract this from auth
    // Verify that the issuer of this request is in some way associated with the order
    if (courierId !== userId && orderData.userId !== userId){
      console.log("the order is not found")
      return res.status(404).send({ data: "Order not found" });
    }


    const snapshot2 = await admin.database().ref(`user/${courierId}/currentLocation`).get();
    const location = snapshot2.val();
    console.log("this is the location: ", location)

    if (location) {
      res.status(200).json({ location });
    } else {
      res.status(404).json({ error: 'Location not found for this user' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};


export const getOrderRestaurantLocation = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const database = admin.database();

  try {
    // Fetch the order
    const orderSnapshot = await database.ref(`orders/${orderId}`).get();

    if (orderSnapshot.exists()) {
      const orderData = orderSnapshot.val();
      // Verify that the issuer of this request is in some way associated with the order
      const userId = req.user?.uid; // TODO extract this from auth
      if (orderData.courierId !== userId && orderData.userId !== userId)
        return res.status(404).send({ data: "Order not found" });

      const restaurantId = orderData.restaurant.restaurantId;

      // Fetch the restaurant information
      const restaurantSnapshot = await database.ref(`restaurants/${restaurantId}`).get();

      if (restaurantSnapshot.exists()) {
        const restaurantData = restaurantSnapshot.val();
        const restaurantLocation = {
          restaurantId,
          restaurantName: restaurantData.information.name,
          location: { lat: restaurantData.information.coordinateX, lng: restaurantData.information.coordinateY}
        };
        res.status(200).json({ restaurant: restaurantLocation });
      } else {
        res.status(404).json({ message: 'Restaurant not found' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error retrieving restaurant location:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export function getOrderStatus(req: Request, res: Response) {
  const database = admin.database();
  const { orderId } = req.params;

  admin.database().ref(`orders/${orderId}`).get()
    .then((snapshot: any) => {
      if (snapshot.exists()) {
        const value = snapshot.val();
        const userId = req.user?.uid; // TODO extract this from auth
        if (value.courierId !== userId && value.userId !== userId)
          return res.status(404).send({ data: "Order not found" });
        const items = value.order.items ?? {};
        res.send({ status: value.tracking.status });
      } else {
        res.status(404).send({ data: "Something went wrong" });
      }
    })
    .catch((error: Error) => {
      console.error("Error retrieving data:", error);
      res.status(500).send("Internal server error");
    });
}