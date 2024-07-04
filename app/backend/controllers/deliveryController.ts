import { Request, Response } from 'express';
import admin from '../firebase-config';

const database = admin.database();

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

export const getDeliveryStatus = async (req: Request, res: Response) => {
  const orderId = req.params.id;
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


