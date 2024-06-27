/*
This should be added to all pages which should only be accessible after being logged in.
It redirects the user to the login page or verification page if they're not logged in or their email
is not verified and they try to access the protected page.
*/

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { auth } from './firebaseConfig';
import { signOut} from 'firebase/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {

  //You can ignore the code involving email verification for now since I commented out the lines that redirect to
  //the verification-instructions page in the case that the email has not been verified yet (this functionality has issues)
  const { currentUser, loading} = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  
  auth.currentUser?.reload();
  if(!auth.currentUser?.emailVerified){
    signOut(auth);
    alert('Please verify your email address before logging in.');
    return <Navigate to="/login" />;
    //return <Navigate to="/verification-instructions" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
