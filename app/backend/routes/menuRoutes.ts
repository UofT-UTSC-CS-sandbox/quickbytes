import { Router } from "express";
import { getRestaurantLocation, addToOrder, createUserOrder, deleteItemFromOrder, getActiveOrder, getAllRestaurants, getOneRestaurant, getOrder, getOrderDropOff, placeOrder, setPickupLocation,getPickupLocation, getActiveRestaurantorders, getCustomerInProgressOrder} from "../controllers/menuController";
import verifyToken from "../middleware/verifyToken";

const menuRouter = Router();

menuRouter.get('/order/:orderId/dropoff', verifyToken, getOrderDropOff);
menuRouter.post('/order/:orderId/pickup-location', verifyToken, setPickupLocation);
menuRouter.get('/order/:orderId/pickup-location', verifyToken, getPickupLocation);
menuRouter.get('/order/:orderId/restaurant-location', verifyToken, getRestaurantLocation);
menuRouter.delete('/order/:orderId/items/:itemId', verifyToken, deleteItemFromOrder);
menuRouter.post('/order/:orderId/place', verifyToken, placeOrder);
menuRouter.post('/:id/order/:orderId', verifyToken, addToOrder);
menuRouter.get('/:id/order/:orderId', getOrder);
menuRouter.post('/:id/order', verifyToken, createUserOrder);
menuRouter.get('/:id/order', verifyToken, getActiveOrder);
menuRouter.get('/:restaurantId/orders', verifyToken, getActiveRestaurantorders);
menuRouter.get('/my-order', verifyToken, getCustomerInProgressOrder);
menuRouter.get('/:id', getOneRestaurant)
menuRouter.get('/', getAllRestaurants);

export default menuRouter;