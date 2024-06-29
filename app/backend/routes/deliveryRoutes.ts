import { Router } from "express";
import { getActiveDelivery, getActiveOrder } from "../controllers/deliveryController";

const deliveryRouter = Router();

deliveryRouter.get('/active', getActiveDelivery);
deliveryRouter.get('/activeOrder', getActiveOrder);

export default deliveryRouter;