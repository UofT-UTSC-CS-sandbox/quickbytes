import { Request, Response, NextFunction } from 'express';
import admin from '../firebase-config';


/* The following is an example of how a user might be logged in and then a token is used
    to get information from the backend, and the token is verified by the verifyToken middlewear.

 const userCredential = await signInWithEmailAndPassword(auth, email, password);
 await userCredential.user.reload();
 const idToken = await userCredential.user.getIdToken();

This is how you would make a get request to the backend using a token to get data from a protected route
In this case we don't actually do anything with whats returned, its just an example

const response = await axios.get('http://localhost:3000/protected', {
  headers: {
    Authorization: `Bearer ${idToken}`,
  },
});
*/

const verifyToken = async (req: any, res: Response, next: NextFunction) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    //if (!decodedToken.email_verified) {
     // return res.status(403).send('Email not verified');
    //}
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};

export default verifyToken;