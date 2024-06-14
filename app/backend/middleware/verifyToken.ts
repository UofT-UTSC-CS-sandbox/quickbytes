import { Request, Response, NextFunction } from 'express';
import admin from '../firebase-config';

// Initialize Firebase Admin SDK (ensure this is done in your setup file)


const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
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