import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { auth } from '../firebaseConfig'; // Import your Firebase instance
import { signOut } from "firebase/auth";
import Navout from '../components/Navout';

const UserPage: React.FC = () => {
  const [confidentialData, setConfidentialData] = useState<string>('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();

          //example of how to fetch using the token
          const response = await axios.get('http://localhost:3000/confidential', {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
          setConfidentialData(response.data.secret);
        } catch (error) {
          console.error('Error fetching confidential data:', error);
          alert('Failed to fetch confidential data');
        }
      } else {
        navigate('/login');
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Use Firebase's signOut method to log out the user
      navigate('/login'); // Redirect to login page after logout and the privateRoute prevents them from getting back in
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle logout error if needed
    }
  };

  return (
    <div>
      <Navout />
      <div style={{ height: '5rem' }}></div>
    
      {confidentialData ? (
        <p>{confidentialData}</p>
      ) : (
        <p>Loading confidential data...</p>
      )}
    </div>
  );
};

export default UserPage;
