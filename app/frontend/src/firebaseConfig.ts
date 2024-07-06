/*The initialization of firebase client SDK is done in the frontend because thats where I'm using
the log in and sign out functions.
*/

import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence} from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

console.log(import.meta.env.VITE_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
try {
  await setPersistence(auth, browserSessionPersistence);
  console.log('Session persistence set successfully');
} catch (error) {
  console.error('Error setting session persistence:', error);
}

export { app, auth, database, ref, onValue}