import { Request, Response } from 'express';
import admin from '../firebase-config';

const database = admin.database();

export const getUserActiveOrders2 = async (req: Request, res: Response) => {
  const userId = req.user!.uid;

  try {
    // Reference to the user's active orders
    const userOrdersRef = database.ref(`user/${userId}/activeOrder`);

    // Fetch the user's active orders
    const snapshot = await userOrdersRef.get();

    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'No active orders found' });
    }

    const activeOrder = snapshot.val();

    // Extract the order IDs (keys)
    const inProgressOrderIDs = Object.keys(activeOrder);

    if (inProgressOrderIDs.length === 0) {
      return res.status(404).json({ message: 'No active orders found' });
    }

    // Fetch all orders by ID in parallel
    const loadOrders = await Promise.all(
      inProgressOrderIDs.map(async (orderId) => {
        const orderRef = database.ref(`orders/${orderId}`);
        try {
          const orderSnapshot = await orderRef.get();
          if (orderSnapshot.exists()) {
            const orderData = orderSnapshot.val();
            // Ensure that the order's userId matches the request userId
            if (orderData.userId !== userId) {
              return null;
            }
            return { orderId, ...orderData };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching order ${orderId}:`, error);
          return null;
        }
      })
    );

    const validOrders = loadOrders.filter(order => order !== null);

    if (validOrders.length === 0) {
      return res.status(404).json({ message: 'No active orders found' });
    }

    res.send({ data: validOrders });
  } catch (error) {
    console.error('Error retrieving active orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCustomerConfirmationPin = async (req: Request, res: Response) => {
  const userId = req.user!.uid;

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

export const updateRole = async (req: Request, res: Response) => {
  const userId = req.user!.uid;
  const { role, enabled } = req.body;
  if (!userId || !role) {
    return res.status(400).json({ success: false, message: 'userId and role are required fields' });
  }

  const database = admin.database();
  const userRef = database.ref(`user/${userId}/settings/roles/${role}`);

  try {
    await userRef.set(enabled);
    res.status(200).json({ success: true, message: 'Notification setting updated successfully' });
  } catch (error) {
    console.error('Error updating notification setting:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const getNotificationSettings = async (req: Request, res: Response) => {
  const userId = req.user!.uid;

  try {
    // Fetch user data from Firebase Realtime Database
    const database = admin.database();
    const userRef = database.ref(`user/${userId}/settings/notifications`);
    const snapshot = await userRef.get();
    let notification_settings = snapshot.val();

    // If notification_settings doesn't exist, initialize it to default values
    if (!notification_settings) {
      notification_settings = {
        customerNotifications: false,
        courierNotifications: false,
      };
      await userRef.set(notification_settings);
    }

    res.status(200).json({ notification_settings });
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    res.status(500).json({ error: 'Failed to fetch notification settings' });
  }
};

export const getRoleSettings = async (req: Request, res: Response) => {
  const userId = req.user!.uid;

  try {
    // Fetch user data from Firebase Realtime Database
    const database = admin.database();
    const userRef = database.ref(`user/${userId}/settings/roles`);
    const snapshot = await userRef.get();
    let role_settings = snapshot.val();

    // If role_settings doesn't exist, initialize it to default values
    if (!role_settings) {
      role_settings = {
        courierRole: false,
        customerRole: true,
      };
      await userRef.set(role_settings);
    }

    res.status(200).json({ role_settings });
  } catch (error) {
    console.error('Error fetching role settings:', error);
    res.status(500).json({ error: 'Failed to fetch role settings' });
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  const userId = req.user!.uid;
  const { role, enabled } = req.body;
  if (!userId || !role) {
    return res.status(400).json({ success: false, message: 'role is required field' });
  }

  const database = admin.database();
  const userRef = database.ref(`user/${userId}/settings/notifications/${role}`);

  try {
    await userRef.set(enabled);
    res.status(200).json({ success: true, message: 'Notification setting updated successfully' });
  } catch (error) {
    console.error('Error updating notification setting:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
