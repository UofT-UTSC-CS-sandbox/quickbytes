import { Router } from "express";
import { getActiveDelivery, getAvailableDeliveries, acceptDelivery, getActiveOrder  } from "../controllers/deliveryController";

const deliveryRouter = Router();

deliveryRouter.get('/active', getActiveDelivery);
deliveryRouter.get('/ordering', getAvailableDeliveries);
deliveryRouter.post('/accept', acceptDelivery);
deliveryRouter.get('/activeOrder', getActiveOrder);

export default deliveryRouter;