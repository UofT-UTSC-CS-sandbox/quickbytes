/*
This is for initializing the admin SDK which can be used along with verifyTokens to verify tokens sent to the endpoints from the
frontend to verify that a user is logged in before retrieving some information
*/

var admin = require("firebase-admin");
import * as dotenv from 'dotenv';
dotenv.config();

//Note that the serviceAccount.json file also needs to be manually copied into the build folder when building
var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quickbytes-85385-default-rtdb.firebaseio.com",
});


export default admin;