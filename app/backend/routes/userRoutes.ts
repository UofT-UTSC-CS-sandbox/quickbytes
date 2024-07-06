import express from 'express';
import { getUserActiveOrders, getUserCurrentLocation} from '../controllers/userController';

const router = express.Router();

router.get('/:userId/current-location', getUserCurrentLocation);


router.get('/:userId/orders', getUserActiveOrders);


export default router;