import express from 'express';
import { getUserActiveOrder, getUserCurrentLocation, getCustomerConfirmationPin, updateNotification, updateRole, getNotificationSettings, getRoleSettings, getUserActiveOrders, getUserActiveDelivery } from '../controllers/userController';

const router = express.Router();

router.get('/:userId/current-location', getUserCurrentLocation);
router.post('/:userId/updateNotification', updateNotification)
router.post('/:userId/updateRole', updateRole)
router.get('/:userId/orders', getUserActiveOrder);
router.get('/:userId/get-confirm-pin', getCustomerConfirmationPin);
router.get('/:userId/getNotificationSettings', getNotificationSettings);
router.get('/:userId/getRoleSettings', getRoleSettings);
router.get('/:userId/activeOrders', getUserActiveOrders);
router.get('/:userId/activeDelivery', getUserActiveDelivery);

export default router;