// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, get, child } from "firebase/database";
import express from 'express';


import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";


import * as dotenv from 'dotenv';
dotenv.config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const fb = initializeApp(firebaseConfig);
const database = getDatabase(fb);
// const analytics = getAnalytics(app);
// Create an Express application
const app = express();
const port = 3000;


app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

//Endpoint for account creation
app.post('/create-account', async (req, res) => {
  const { email, password } = req.body;

  //Will be changed later, need to check valid email
  if (!email.endsWith('@utoronto.ca')) {
    return res.status(400).send('invalid email');
  }

  const auth = getAuth(fb);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    res.status(200).send('email sent');
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('unknown error');
    }
  }
});


//Endpoint for login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const auth = getAuth(fb);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
      return res.status(400).send('email not verified');
    }
    res.status(200).send('successful');
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).send(error.message);
    } else {
      res.status(401).send('unknown error');
    }
  }
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