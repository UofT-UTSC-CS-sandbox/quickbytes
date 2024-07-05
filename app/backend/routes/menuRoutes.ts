import { Router } from "express";
import { addToOrder, createUserOrder, deleteItemFromOrder, getActiveOrder, getAllRestaurants, getOneRestaurant, getOrder, getOrderDropOff, placeOrder, setPickupLocation,getPickupLocation, getActiveRestaurantorders} from "../controllers/menuController";

const menuRouter = Router();

menuRouter.post('/order/:orderId/pickup-location', setPickupLocation);
menuRouter.get('/order/:orderId/pickup-location', getPickupLocation);
menuRouter.delete('/order/:orderId/items/:itemId', deleteItemFromOrder);
menuRouter.post('/order/:orderId/place', placeOrder);
menuRouter.post('/:id/order/:orderId', addToOrder);
menuRouter.get('/:id/order/:orderId', getOrder);
menuRouter.get('/order/:orderId/dropoff', getOrderDropOff);
menuRouter.post('/:id/order', createUserOrder);
menuRouter.get('/:id/order', getActiveOrder);
menuRouter.get('/:restaurantId/orders', getActiveRestaurantorders);
menuRouter.get('/:id', getOneRestaurant)
menuRouter.get('/', getAllRestaurants);

export default menuRouter;