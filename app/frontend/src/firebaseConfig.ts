// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence} from "firebase/auth";
//import * as dotenv from 'dotenv';
//dotenv.config();


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

/*
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
};
*/
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
try {
  await setPersistence(auth, browserSessionPersistence);
  console.log('Session persistence set successfully');
} catch (error) {
  console.error('Error setting session persistence:', error);
}


export { app, auth }