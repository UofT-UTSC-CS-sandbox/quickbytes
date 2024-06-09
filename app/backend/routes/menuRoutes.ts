import { Router } from "express";
import { getAllRestaurants, getOneRestaurant } from "../controllers/menuController";

const menuRouter = Router();

menuRouter.use('/:id', getOneRestaurant)
menuRouter.use('/', getAllRestaurants);

export default menuRouter;