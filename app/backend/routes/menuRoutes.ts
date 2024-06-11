import { Router } from "express";
import { addToOrder, createUserOrder, getActiveOrder, getAllRestaurants, getOneRestaurant, getOrder } from "../controllers/menuController";

const menuRouter = Router();

menuRouter.post('/order/:orderId', addToOrder);
menuRouter.get('/order/:orderId', getOrder);
menuRouter.post('/:id/order', createUserOrder);
menuRouter.get('/:id/order', getActiveOrder);
menuRouter.get('/:id', getOneRestaurant)
menuRouter.get('/', getAllRestaurants);

export default menuRouter;