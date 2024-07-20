import { Router } from "express";
import { getRestaurantLocation, addToOrder, createUserOrder, deleteItemFromOrder, getActiveOrder, getAllRestaurants, getOneRestaurant, getOrder, getOrderDropOff, placeOrder, setPickupLocation,getPickupLocation, getActiveRestaurantorders, getCustomerInProgressOrder} from "../controllers/menuController";

const menuRouter = Router();

menuRouter.get('/order/:orderId/dropoff', getOrderDropOff);
menuRouter.post('/order/:orderId/pickup-location', setPickupLocation);
menuRouter.get('/order/:orderId/pickup-location', getPickupLocation);
menuRouter.get('/order/:orderId/restaurant-location', getRestaurantLocation);
menuRouter.delete('/order/:orderId/items/:itemId', deleteItemFromOrder);
menuRouter.post('/order/:orderId/place', placeOrder);
menuRouter.post('/:id/order/:orderId', addToOrder);
menuRouter.get('/:id/order/:orderId', getOrder);
menuRouter.post('/:id/order', createUserOrder);
menuRouter.get('/:id/order', getActiveOrder);
menuRouter.get('/:restaurantId/orders', getActiveRestaurantorders);
menuRouter.get('/my-order', getCustomerInProgressOrder);
menuRouter.get('/:id', getOneRestaurant)
menuRouter.get('/', getAllRestaurants);

export default menuRouter;