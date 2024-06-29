"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deliveryController_1 = require("../controllers/deliveryController");
const deliveryRouter = (0, express_1.Router)();
deliveryRouter.get('/active', deliveryController_1.getActiveDelivery);
deliveryRouter.get('/ordering', deliveryController_1.getAvailableDeliveries);
deliveryRouter.post('/accept', deliveryController_1.acceptDelivery);
exports.default = deliveryRouter;
