// src/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  emailVerified: boolean;
  logout: () => Promise<void>; // Define the logout function in AuthContextProps
}
const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  loading: true,
  emailVerified: false,
  logout: async () => {}
});

//const AuthContext = createContext<AuthContextProps>({ currentUser: null, loading: true, logout: async () => {} });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      setEmailVerified(user?.emailVerified ?? false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  // Ensure that logout is included in the value provided by AuthContext
  const authContextValue = {
    currentUser,
    loading,
    emailVerified,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
