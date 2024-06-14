// src/Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword,currentUser } from 'firebase/auth';
import { auth } from '../firebaseConfig';
//import NavBar from '../components/Navbar';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await userCredential.user.reload();
      const idToken = await userCredential.user.getIdToken();

      
      //This is how you would make a get request to the backend using a token
      //In this case we don't actually do anything with whats returned, its just an example
      const response = await axios.get('http://localhost:3000/protected', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      alert('Protected data accessed');
      navigate('/user-page');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data || 'An error occurred');
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  const goToSignUp = () => {
    navigate('/sign-up');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
      <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Sign In</h2>
        <div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.utoronto.ca" required />
        </div>
        <div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" required />
        </div>
        <button type="submit">Sign In</button>
        <hr style={{ marginTop: '20px', marginBottom: '0px', color: '#E6E6E6', borderWidth: '1px', width: '100%' }} />
      </form>
      <p style={{ color: '#828282', marginTop: '0px' }}>
        Don't have an account? Sign up
        <button
          onClick={goToSignUp}
          style={{
            color: '#828282',
            textDecoration: 'none',
	          background: 'none', 
	          border: 'none',
            fontWeight: 'normal',
            cursor: 'pointer',
            paddingLeft: '4px',
          }}
        >
           <strong><u>Here</u></strong>
        </button>
      </p>

    </div>
  );
};

export default Login;