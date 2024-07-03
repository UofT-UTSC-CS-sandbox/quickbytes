import express from 'express';
import { getUserActiveOrders } from '../controllers/userController';

const router = express.Router();

router.get('/:userId/orders', getUserActiveOrders);

export default router;