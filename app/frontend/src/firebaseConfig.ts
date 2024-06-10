// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);