import express from 'express';
import { getUserActiveOrders2, getCustomerConfirmationPin, updateNotification, updateRole, getNotificationSettings, getRoleSettings } from '../controllers/userController';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

router.use(verifyToken);

router.post('/updateNotification', updateNotification)
router.post('/updateRole', updateRole)
router.get('/orders2', getUserActiveOrders2);
router.get('/get-confirm-pin', getCustomerConfirmationPin);
router.get('/getNotificationSettings', getNotificationSettings);
router.get('/getRoleSettings', getRoleSettings);

export default router;