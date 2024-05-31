// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, get, child } from "firebase/database";
import express from 'express';

import * as dotenv from 'dotenv';
dotenv.config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.API_KEY,//"AIzaSyDDG42MoF9S4Qtgf3LCysRLqSuIqowXzlE",
  authDomain: "quickbytes-85385.firebaseapp.com",
  projectId: "quickbytes-85385",
  storageBucket: "quickbytes-85385.appspot.com",
  messagingSenderId: "838310654462",
  appId: "1:838310654462:web:acb2adb8449a50edeb10af",
  measurementId: "G-MYWP2MNCSS",
  databaseURL: "https://quickbytes-85385-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const fb = initializeApp(firebaseConfig);
const database = getDatabase(fb);
// const analytics = getAnalytics(app);
// Create an Express application
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});