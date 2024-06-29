"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("firebase/database");
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const verifyToken_1 = __importDefault(require("./middleware/verifyToken"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv = __importStar(require("dotenv"));
const menuRoutes_1 = __importDefault(require("./routes/menuRoutes"));
const deliveryRoutes_1 = __importDefault(require("./routes/deliveryRoutes"));
const firebase_config_1 = __importDefault(require("./firebase-config"));
dotenv.config();
const database = firebase_config_1.default.database();
// Create an Express application
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(cors());
const port = 3000;
//app.use(cors());
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ALLOW_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
// Define a GET endpoint
app.get('/', (req, res) => {
    (0, database_1.get)((0, database_1.child)((0, database_1.ref)(database), `test`)).then((snapshot) => {
        if (snapshot.exists()) {
            res.send({ data: snapshot.val() });
        }
        else {
            res.send({ data: "Something went wrong" });
        }
    }).catch((error) => {
        console.error("Error retrieving data:", error);
        res.status(500).send("Internal server error");
    });
});
app.get('/protected', verifyToken_1.default, (req, res) => {
    res.send('This is a protected route');
});
app.get('/confidential', verifyToken_1.default, (req, res) => {
    if (req.user) {
        res.send({ secret: 'This is confidential data' });
    }
    else {
        res.status(401).send('Unauthorized');
    }
});
app.use('/deliveries', deliveryRoutes_1.default);
app.post('/order', (req, res) => {
    const orderID = req.body.orderID;
    console.log(req.body.orderID);
    const order = (0, database_1.child)((0, database_1.ref)(database), `orders/${orderID}/tracking/dropOff`);
    (0, database_1.get)(order).then((snapshot) => {
        if (snapshot.exists()) {
            res.status(200).send({ data: snapshot.val() });
        }
        else {
            res.status(404).send({ data: "Something went wrong" });
        }
    }).catch((error) => {
        console.error("Error retrieving data:", error);
        res.status(500).send("Internal server error");
    });
});
app.use('/restaurants', menuRoutes_1.default);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
