// src/Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? 
        <button 
          onClick={goToSignUp} 
          style={{ fontWeight: 'bold', color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Sign up here
        </button>
      </p>
    </div>
  );
};

export default Login;