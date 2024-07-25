import { Router } from "express";
import { getInProgressOrders, createCourierConfirmationPin, getCourierConfirmationPin, updateCourierConfirmationStatus, getCourierConfirmationStatus } from "../controllers/restaurantController";
import verifyToken from "../middleware/verifyToken";

const staffRouter = Router();

staffRouter.use(verifyToken);

staffRouter.get('/:restaurantId/orders', getInProgressOrders);
staffRouter.post('/:restaurantId/:orderId/confirm-pin', createCourierConfirmationPin);
staffRouter.get('/:restaurantId/:orderId/get-pin', getCourierConfirmationPin);
staffRouter.post('/:restaurantId/:orderId/update-confirm-status', updateCourierConfirmationStatus);
staffRouter.get('/:restaurantId/:orderId/confirm-status', getCourierConfirmationStatus);

export default staffRouter;
