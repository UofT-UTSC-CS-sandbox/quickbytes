var admin = require("firebase-admin");
import * as dotenv from 'dotenv';
dotenv.config();

var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});


export default admin;