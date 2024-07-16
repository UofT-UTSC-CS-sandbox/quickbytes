import { Request, Response } from 'express';
import admin from '../firebase-config';
import { OrderStatus } from '../schema/Order';

// Get the only in-progress delivery for the courier
export async function getActiveDelivery(req: Request, res: Response) {
  const database = admin.database();
  const userId = req.query.courierID as string;
  const userOrderRef = database.ref(`user/${userId}/activeDelivery`);

  try {
      const snapshot = await userOrderRef.get();
      if (snapshot.exists()) {
          res.status(200).send({ data: snapshot.val() });
      } else {
          res.status(404).send({ data: "No active order found" });
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
  if (!userId || !orderId) {
    return res.status(400).send({ error: 'userId and orderId are required fields' });
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

    const orderSnapshot = await orderRef.once('value');
    const orderData = orderSnapshot.val();
    const pickupCoordinates = orderData?.tracking?.dropOff;

    if (!pickupCoordinates || typeof pickupCoordinates.lat == "undefined" 
      || typeof pickupCoordinates.lng == "undefined") {
      return res.status(404).send({ error: 'Pickup coordinates not found' });
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
    const userId = req.query.customerID as string;
    const userOrderRef = database.ref(`user/${userId}/activeOrder`);

    try {
        const snapshot = await userOrderRef.get();
        if (snapshot.exists()) {
            res.status(200).send({ data: snapshot.val() });
        } else {
            res.status(404).send({ data: "No active order found" });
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).send("Internal server error");
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
    if (status === OrderStatus.CANCELLED) {
      const orderSnapshot = await orderRef.once('value');
      const orderData = orderSnapshot.val();
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
    const snapshot = await database.ref(`orders/${orderId}`).once('value');
    if (snapshot.exists()) {
      const deliveryData = snapshot.val();
      const courierId = deliveryData.courierId;
      const courierSnapshot = await database.ref(`user/${courierId}/currentLocation`).once('value');
      const currentLocation = courierSnapshot.exists() ? courierSnapshot.val() : null;
      console.log("here")

      //restaurant location
      const restaurantId = deliveryData.restaurant.restaurantId;
      const restaurantSnapshot = await database.ref(`restaurants/${restaurantId}`).once('value');
      const restaurantData = restaurantSnapshot.val();
      const pickUp = restaurantData.information.location;

      console.log("here2",  restaurantData.information.location)

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
    console.log("fail11111")
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


export const getOrderRestaurantLocation = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const database = admin.database();

  try {
    // Fetch the order
    const orderSnapshot = await database.ref(`orders/${orderId}`).once('value');

    if (orderSnapshot.exists()) {
      const orderData = orderSnapshot.val();
      const restaurantId = orderData.restaurant.restaurantId;
      console.log("entered")

      // Fetch the restaurant information
      const restaurantSnapshot = await database.ref(`restaurants/${restaurantId}`).once('value');
      console.log("the restaurant exists?",restaurantSnapshot.exists())

      if (restaurantSnapshot.exists()) {
        const restaurantData = restaurantSnapshot.val();
        const restaurantLocation = {
          restaurantId,
          restaurantName: restaurantData.information.name,
          location: restaurantData.information.location,
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
              const items = value.order.items ?? {};
              res.send({ status: value.tracking.status } );
          } else {
              res.status(404).send({ data: "Something went wrong" });
          }
      })
      .catch((error: Error) => {
          console.error("Error retrieving data:", error);
          res.status(500).send("Internal server error");
      });
}