import { Request, Response } from 'express';
import admin from '../firebase-config';

const database = admin.database();

// Endpoint to get user's active orders
export const getUserActiveOrders = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  console.log("entered")

  try {
    // Reference to the user's active orders
    const userOrdersRef = database.ref(`user/${userId}/activeOrders`);

    // Fetch the user's active orders
    const snapshot = await userOrdersRef.once('value');

    if (snapshot.exists()) {
      const activeOrders = snapshot.val();

      // Extract the order IDs (keys)
      const inProgressOrderIDs = Object.keys(activeOrders);

      // Fetch all orders by ID in parallel
      const loadOrders = await Promise.all(
        inProgressOrderIDs.map((orderId) => {
          const orderRef = database.ref(`orders/${orderId}`);
          return orderRef.get()
            .then((snapshot: any) => snapshot.exists() ? { orderId, ...snapshot.val() } : null)
            .catch((error: Error) => null);
        })
      );

      res.send({ data: loadOrders.filter(x => x !== null) });
    } else {
      res.status(404).json({ message: 'No active orders found' });
    }
  } catch (error) {
    console.error('Error retrieving active orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getUserCurrentLocation = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  console.log("entered getCurrentLocation")

  try {
    // Fetch user data from Firebase Realtime Database
    const snapshot = await admin.database().ref(`user/${userId}/currentLocation`).once('value');
    const location = snapshot.val();

    if (location) {
      res.status(200).json({ location });
    } else {
      res.status(404).json({ error: 'Location not found for this user' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

export const getCustomerConfirmationPin = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId is a required field' });
  }

  const database = admin.database();
  const userRef = database.ref(`user/${userId}`);

  try {
    const snapshot = await userRef.get();

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const customerPin = userData.customerConfirmationPin;

      if (customerPin) {
        res.status(200).json({ customerConfirmationPin: customerPin });
      } else {
        res.status(404).json({ success: false, message: 'Customer confirmation pin not found' });
      }
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving customer confirmation pin:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};















