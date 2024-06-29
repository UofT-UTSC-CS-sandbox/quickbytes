import { Router } from "express";
import { getInProgressOrders } from "../controllers/restaurantController";

const staffRouter = Router();

staffRouter.get('/:restaurantId/orders', getInProgressOrders);

export default staffRouter;
