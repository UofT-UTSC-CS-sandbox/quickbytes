import express from 'express';
import { getUserActiveOrders2, getCustomerConfirmationPin, createCustomerConfirmationPin, updateCustomerConfirmationStatus, getCustomerConfirmationStatus, updateNotification, updateRole, getNotificationSettings, getRoleSettings } from '../controllers/userController';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

router.use(verifyToken);

router.post('/updateNotification', updateNotification)
router.post('/updateRole', updateRole)
router.get('/orders2', getUserActiveOrders2);
router.get('/getNotificationSettings', getNotificationSettings);
router.get('/getRoleSettings', getRoleSettings);
router.post('/create-customer-confirm-pin', createCustomerConfirmationPin);
router.get('/:courierId/get-customer-confirm-pin', getCustomerConfirmationPin);
router.post('/update-customer-confirm-status', updateCustomerConfirmationStatus);
router.get('/get-customer-confirm-status', getCustomerConfirmationStatus);

export default router;