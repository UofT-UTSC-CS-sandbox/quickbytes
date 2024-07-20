import { Router } from "express";
import { getActiveDelivery, getAvailableDeliveries, acceptDelivery, getActiveOrder, updateOrderStatus } from "../controllers/deliveryController";
import { getCurrentLocationFromOrder, getDeliveryStatus, updateDeliveryLocation, getOrderRestaurantLocation, getOrderStatus} from '../controllers/deliveryController';

const deliveryRouter = Router();

deliveryRouter.get('/active', getActiveDelivery);
deliveryRouter.get('/ordering', getAvailableDeliveries);
deliveryRouter.post('/accept', acceptDelivery);
deliveryRouter.get('/activeOrder', getActiveOrder);
deliveryRouter.post('/updateOrderStatus', updateOrderStatus);
deliveryRouter.post('/update-location', updateDeliveryLocation);
deliveryRouter.get('/:orderId/restaurant-location', getOrderRestaurantLocation);
deliveryRouter.get('/:orderId/courier-location', getCurrentLocationFromOrder);
deliveryRouter.get('/:orderId/order-status', getOrderStatus);
deliveryRouter.get('/:id', getDeliveryStatus);

export default deliveryRouter;