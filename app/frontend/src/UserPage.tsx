// src/UserPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const UserPage: React.FC = () => {
  const [confidentialData, setConfidentialData] = useState<string>('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
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

  return (
    <div>
      <h1>User Page</h1>
      {confidentialData ? (
        <p>{confidentialData}</p>
      ) : (
        <p>Loading confidential data...</p>
      )}
    </div>
  );
};

export default UserPage;