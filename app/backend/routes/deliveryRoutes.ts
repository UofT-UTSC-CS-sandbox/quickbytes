import { Router } from "express";
import { getActiveDelivery } from "../controllers/deliveryController";
import { getDeliveryStatus, updateDeliveryLocation, getOrderRestaurantLocation, getOrderStatus} from '../controllers/deliveryController';

const deliveryRouter = Router();

deliveryRouter.get('/active', getActiveDelivery);

deliveryRouter.post('/update-location', updateDeliveryLocation);

deliveryRouter.get('/:orderId/restaurant-location', getOrderRestaurantLocation);

deliveryRouter.get('/:orderId/order-status', getOrderStatus);

deliveryRouter.get('/:id', getDeliveryStatus);



export default deliveryRouter;