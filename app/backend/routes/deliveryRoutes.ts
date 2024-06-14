import { Router } from "express";
import { getActiveDelivery } from "../controllers/deliveryController";

const deliveryRouter = Router();

deliveryRouter.get('/active', getActiveDelivery);

export default deliveryRouter;