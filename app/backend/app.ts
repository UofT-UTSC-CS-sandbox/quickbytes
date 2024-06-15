// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, get, child, query, limitToFirst } from "firebase/database";
import express from 'express';
const cors = require('cors');
import verifyToken from './middleware/verifyToken';
import bodyParser from 'body-parser';

import * as dotenv from 'dotenv';
import menuRouter from "./routes/menuRoutes";
import deliveryRouter from "./routes/deliveryRoutes";
import admin from "./firebase-config";
dotenv.config();


const database = admin.database();

// Create an Express application
const app = express();

app.use(bodyParser.json())

//var cors = require('cors');
app.use(cors());

const port = 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ALLOW_ORIGIN as string);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Define a GET endpoint
app.get('/', (req, res) => {
  get(child(ref(database), `test`)).then((snapshot) => {
      if (snapshot.exists()) {
        res.send({data: snapshot.val()});
      } else {
        res.send({data: "Something went wrong"});
      }
    }).catch((error) => {
      console.error("Error retrieving data:", error);
      res.status(500).send("Internal server error");
    });

});

app.get('/protected', verifyToken, (req, res) => {
  res.send('This is a protected route');
});

app.get('/confidential', verifyToken, (req, res) => {
  if (req.user) {
    res.send({ secret: 'This is confidential data' });
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.use('/deliveries', deliveryRouter);

app.post('/order', (req, res) => {
  const orderID = req.body.orderID;
  console.log(req.body.orderID);
  const order = child(ref(database), `orders/${orderID}/tracking/dropOff`);

  get(order).then((snapshot) => {
      if (snapshot.exists()) {
          res.status(200).send({ data: snapshot.val() });
      } else {
          res.status(404).send({ data: "Something went wrong" });
      }
  }).catch((error) => {
      console.error("Error retrieving data:", error);
      res.status(500).send("Internal server error");
  });
});

app.use('/restaurants', menuRouter)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});