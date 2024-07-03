import { Request, Response } from 'express';
import admin from '../firebase-config';

const database = admin.database();

// Endpoint to get user's active orders
export const getUserActiveOrders = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    // Reference to the user's active orders
    const userOrdersRef = database.ref(`user/${userId}/activeOrders`);

    // Fetch the user's active orders
    const snapshot = await userOrdersRef.once('value');

    if (snapshot.exists()) {
      const activeOrders = snapshot.val();

      // Extract the order IDs (keys)
      const orderIds = Object.keys(activeOrders);

      res.status(200).json({ orders: orderIds });
    } else {
      res.status(404).json({ message: 'No active orders found' });
    }
  } catch (error) {
    console.error('Error retrieving active orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




