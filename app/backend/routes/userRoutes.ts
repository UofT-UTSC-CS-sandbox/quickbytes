import express from 'express';
import { getUserActiveOrders, getUserCurrentLocation, getCustomerConfirmationPin, updateNotification, updateRole, getNotificationSettings, getRoleSettings } from '../controllers/userController';

const router = express.Router();

router.get('/:userId/current-location', getUserCurrentLocation);
router.post('/:userId/updateNotification', updateNotification)
router.post('/:userId/updateRole', updateRole)
router.get('/:userId/orders', getUserActiveOrders);
router.get('/:userId/get-confirm-pin', getCustomerConfirmationPin);
router.get('/:userId/getNotificationSettings', getNotificationSettings);
router.get('/:userId/getRoleSettings', getRoleSettings);


export default router;