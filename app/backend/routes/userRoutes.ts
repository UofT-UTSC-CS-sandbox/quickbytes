import express from 'express';
import { getUserActiveOrders, getUserActiveOrders2, getUserActiveOrder, getUserCurrentLocation, getCustomerConfirmationPin, updateNotification, updateRole, getNotificationSettings, getRoleSettings, getUserActiveDelivery} from '../controllers/userController';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

router.use('/', verifyToken);

router.get('/:userId/current-location', getUserCurrentLocation);
router.post('/updateNotification', updateNotification)
router.post('/updateRole', updateRole)
router.get('/orders', getUserActiveOrder);
router.get('/orders2', getUserActiveOrders2);
router.get('/:userId/get-confirm-pin', getCustomerConfirmationPin);
router.get('/getNotificationSettings', getNotificationSettings);
router.get('/getRoleSettings', getRoleSettings);
router.get('/activeOrders', getUserActiveOrders);
router.get('/activeDelivery', getUserActiveDelivery);

export default router;