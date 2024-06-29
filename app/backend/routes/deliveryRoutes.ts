import { Router } from "express";
import { getActiveDelivery, getAvailableDeliveries, acceptDelivery } from "../controllers/deliveryController";

const deliveryRouter = Router();

deliveryRouter.get('/active', getActiveDelivery);
deliveryRouter.get('/ordering', getAvailableDeliveries);
deliveryRouter.post('/accept', acceptDelivery);

export default deliveryRouter;