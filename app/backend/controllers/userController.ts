import { Request, Response } from 'express';
import admin from '../firebase-config';

const database = admin.database();

export const getUserActiveOrder = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    // Reference to the user's active orders
    const userOrdersRef = database.ref(`user/${userId}/activeOrder`);

    // Fetch the user's active orders
    const snapshot = await userOrdersRef.once('value');

    if (snapshot.exists()) {
      const activeOrder = snapshot.val();

      // Reference to the specific order
      const orderRef = database.ref(`orders/${activeOrder}`);
      
      // Fetch the order data
      const orderSnapshot = await orderRef.once('value');

      if (orderSnapshot.exists()) {
        const order = orderSnapshot.val();
        res.status(200).json({ data: order });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } else {
      res.status(404).json({ message: 'No active orders found' });
    }
  } catch (error) {
    console.error('Error retrieving active orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserActiveOrders = async (req: Request, res: Response) => {
  //const userId = req.params.userId;
  console.log("entered")
  
  //userid is fixed as 1 for now 
  const userId = "1"

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

export const updateRole = async(req: Request, res: Response) => {
  const { userId } = req.params;
  const { role, enabled } = req.body; 
  if (!userId || !role) {
    return res.status(400).json({ success: false, message: 'userId and role are required fields' });
  }

  const database = admin.database();
  const userRef = database.ref(`user/${userId}/settings/roles/${role}`);
  
  try{
    await userRef.set(enabled);
    res.status(200).json({ success: true, message: 'Notification setting updated successfully' });
  } catch (error) {
    console.error('Error updating notification setting:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const getNotificationSettings = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    // Fetch user data from Firebase Realtime Database
    const database = admin.database();
    const userRef = database.ref(`user/${userId}/settings/notifications`);
    const notification_settings = await userRef.get();

    if (notification_settings) {
      res.status(200).json({ notification_settings });
    } else {
      res.status(404).json({ error: 'Location not found for this user' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

export const getRoleSettings = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    // Fetch user data from Firebase Realtime Database
    const database = admin.database();
    const userRef = database.ref(`user/${userId}/settings/roles`);
    const role_settings = await userRef.get();

    if (role_settings) {
      res.status(200).json({ role_settings });
    } else {
      res.status(404).json({ error: 'Location not found for this user' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

export const updateNotification = async(req: Request, res: Response) => {
  const { userId } = req.params;
  const { role, enabled } = req.body; 
  if (!userId || !role) {
    return res.status(400).json({ success: false, message: 'userId and role are required fields' });
  }

  const database = admin.database();
  const userRef = database.ref(`user/${userId}/settings/notifications/${role}`);

  try{
    await userRef.set(enabled);
    res.status(200).json({ success: true, message: 'Notification setting updated successfully' });
  } catch (error) {
    console.error('Error updating notification setting:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

