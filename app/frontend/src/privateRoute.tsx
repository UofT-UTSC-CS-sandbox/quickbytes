import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const [emailVerified, setEmailVerified] = useState(false);
  

  useEffect(() => {
    const checkEmailVerification = async () => {
      if (currentUser) {
        try {
          await currentUser.reload(); // Reload user profile to get latest info
          setEmailVerified(currentUser.emailVerified);
        } catch (error) {
          console.error('Error reloading user:', error);
          setEmailVerified(false); // Fallback to false
        }
      } else {
        setEmailVerified(false); // If no currentUser, not verified
      }
    };

    checkEmailVerification();
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  //if (!emailVerified) {
   // return <Navigate to="/verification-instructions" />;
  //}

  return <>{children}</>;
};

export default PrivateRoute;
