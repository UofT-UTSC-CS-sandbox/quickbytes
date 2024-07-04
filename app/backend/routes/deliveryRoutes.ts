import { Router } from "express";
import { getActiveDelivery, getAvailableDeliveries, acceptDelivery, getActiveOrder, updateOrderStatus } from "../controllers/deliveryController";

const deliveryRouter = Router();

deliveryRouter.get('/active', getActiveDelivery);
deliveryRouter.get('/ordering', getAvailableDeliveries);
deliveryRouter.post('/accept', acceptDelivery);
deliveryRouter.get('/activeOrder', getActiveOrder);
deliveryRouter.post('/updateOrderStatus', updateOrderStatus);

export default deliveryRouter;