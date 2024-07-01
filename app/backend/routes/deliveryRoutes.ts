import { Router } from "express";
import { getActiveDelivery } from "../controllers/deliveryController";
import { getDeliveryStatus, updateDeliveryLocation } from '../controllers/deliveryController';

const deliveryRouter = Router();

deliveryRouter.get('/active', getActiveDelivery);

deliveryRouter.post('/update-location', updateDeliveryLocation);

deliveryRouter.get('/:id', getDeliveryStatus);


export default deliveryRouter;