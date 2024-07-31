/*This page is just illustrative of how a page thats "protected" should work
It uses a token from the current session to get a simple message from the backend
*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import NavBar from '../components/Navbar';
import PageHead from '../components/PageHead';

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

  return (
    <div>
      <PageHead title="User Page" description="This is a user page for testing purposes" />
      <NavBar />
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
