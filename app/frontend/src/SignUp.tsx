// src/SignUp.tsx
import React, { useState } from 'react';
import { auth } from './firebaseConfig'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await sendEmailVerification(userCredential.user); // Optional: Send email verification
      alert('Account created successfully. Please verify your email.');
      navigate('/login'); // Redirect to login page
    } catch (error: any) {
      console.error('Error creating account:', error);
      alert(error.message || 'An error occurred');
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? 
        <button 
          onClick={goToLogin} 
          style={{ fontWeight: 'bold', color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Sign in here
        </button>
      </p>
    </div>
  );
};

export default SignUp;