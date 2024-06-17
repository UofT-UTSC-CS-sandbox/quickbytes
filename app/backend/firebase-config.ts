/*
This is for initializing the admin SDK which can be used along with verifyTokens to verify tokens sent to the endpoints from the
frontend to verify that a user is logged in before retrieving some information
*/

var admin = require("firebase-admin");
import * as dotenv from 'dotenv';
dotenv.config();

//Note that the serviceAccount.json file also needs to be manually copied into the build folder when building

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '';

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: firebasePrivateKey, // Replace \n with actual newline characters
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSAL_DOMAIN
};



//var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quickbytes-85385-default-rtdb.firebaseio.com",
});


export default admin;