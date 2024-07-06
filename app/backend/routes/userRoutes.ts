import express from 'express';
import { getUserActiveOrders, getUserCurrentLocation, getCustomerConfirmationPin } from '../controllers/userController';

const router = express.Router();

router.get('/:userId/current-location', getUserCurrentLocation);


router.get('/:userId/orders', getUserActiveOrders);
router.get('/:userId/get-confirm-pin', getCustomerConfirmationPin);


export default router;