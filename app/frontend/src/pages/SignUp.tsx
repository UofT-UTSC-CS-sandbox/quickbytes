import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut} from 'firebase/auth';
import './SignUp.css';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (!email.endsWith('@mail.utoronto.ca') && !email.endsWith('@utoronto.ca')) {
        alert('Please sign up with a valid University of Toronto email address.');
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await sendEmailVerification(userCredential.user); //Send email verification
      await signOut(auth);
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
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
      <h1 className="sign-up-header">Create an account</h1>
      <p className="sign-up-text">Enter your email to sign up</p>
        <div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.utoronto.ca" required />
        </div>
        <div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" required />
        </div>
        <button type="submit">Sign Up</button>
        <hr style={{ marginTop: '20px', marginBottom: '0px', color: '#E6E6E6', borderWidth: '1px', width: '100%' }} />
      </form>
      <p style={{ color: '#828282', marginTop: '0px' }}>
        Already have an account? Sign in
        <button
          onClick={goToLogin}
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

export default SignUp;