// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
//import { getDatabase, ref, set, get, child } from "firebase/database";
import express from 'express';
//const cors = require('cors');
const cors = require('cors'); 
//import { Request, Response, NextFunction } from 'express';
import verifyToken from './middleware/verifyToken';


//import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
//import { signInWithEmailAndPassword } from "firebase/auth";


import * as dotenv from 'dotenv';
dotenv.config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

/*
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.FIREBASE_DATABASE_URL
};
*/
/*
const firebaseConfig = {
  apiKey: "AIzaSyDDG42MoF9S4Qtgf3LCysRLqSuIqowXzlE",
  authDomain: "quickbytes-85385.firebaseapp.com",
  databaseURL: "https://quickbytes-85385-default-rtdb.firebaseio.com",
  projectId: "quickbytes-85385",
  storageBucket: "quickbytes-85385.appspot.com",
  messagingSenderId: "838310654462",
  appId: "1:838310654462:web:acb2adb8449a50edeb10af",
  measurementId: "G-MYWP2MNCSS"
};

// Initialize Firebase
const fb = initializeApp(firebaseConfig);
const database = getDatabase(fb);
// const analytics = getAnalytics(app);

*/
// Create an Express application
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

/*
const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};



const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const idToken = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send('Unauthorized');
  }
};
*/


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




// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});