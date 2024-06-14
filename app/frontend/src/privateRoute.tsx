import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { auth } from './firebaseConfig';

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
    return <Navigate to="/verification-instructions" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
