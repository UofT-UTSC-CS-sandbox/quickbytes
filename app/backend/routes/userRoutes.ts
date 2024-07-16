import express from 'express';
import { getUserActiveOrder, getUserCurrentLocation, getCustomerConfirmationPin } from '../controllers/userController';

const router = express.Router();

router.get('/:userId/current-location', getUserCurrentLocation);


router.get('/:userId/orders', getUserActiveOrder);
router.get('/:userId/get-confirm-pin', getCustomerConfirmationPin);


export default router;