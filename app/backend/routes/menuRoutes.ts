import { Router } from "express";
import { addToOrder, createUserOrder, deleteItemFromOrder, getActiveOrder, getAllRestaurants, getOneRestaurant, getOrder, getOrderDropOff, placeOrder, setPickupLocation,getPickupLocation, getActiveRestaurantorders, getCustomerActiveOrder} from "../controllers/menuController";

const menuRouter = Router();

menuRouter.get('/order/:orderId/dropoff', getOrderDropOff);
menuRouter.post('/order/:orderId/pickup-location', setPickupLocation);
menuRouter.get('/order/:orderId/pickup-location', getPickupLocation);
menuRouter.delete('/order/:orderId/items/:itemId', deleteItemFromOrder);
menuRouter.post('/order/:orderId/place', placeOrder);
menuRouter.post('/:id/order/:orderId', addToOrder);
menuRouter.get('/:id/order/:orderId', getOrder);
menuRouter.post('/:id/order', createUserOrder);
menuRouter.get('/:id/order', getActiveOrder);
menuRouter.get('/:restaurantId/orders', getActiveRestaurantorders);
menuRouter.get('/my-order', getCustomerActiveOrder);
menuRouter.get('/:id', getOneRestaurant)
menuRouter.get('/', getAllRestaurants);

export default menuRouter;