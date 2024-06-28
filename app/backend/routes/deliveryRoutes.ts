import { Router } from "express";
import { getActiveDelivery } from "../controllers/deliveryController";
import { getDeliveryStatus, updateDeliveryLocation } from '../controllers/deliveryController';

const deliveryRouter = Router();

deliveryRouter.get('/active', getActiveDelivery);

deliveryRouter.get('/:id', getDeliveryStatus);
deliveryRouter.post('/update-location', updateDeliveryLocation);


export default deliveryRouter;