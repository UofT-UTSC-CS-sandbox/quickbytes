import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Alert, Snackbar } from '@mui/material';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/restaurants';

  const [showSessionExpiredToast, setShowSessionExpiredToast] = useState(false);
  useEffect(() => {
    setShowSessionExpiredToast(location.state?.showSessionExpiredToast || false);
  }, [location.state?.showSessionExpiredToast])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setShowSessionExpiredToast(false);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await userCredential.user.reload();

      navigate(from, { replace: true });
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

      <Snackbar
        open={showSessionExpiredToast}
        autoHideDuration={5000}
        onClose={() => setShowSessionExpiredToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          Your session has expired. Please sign in again.
        </Alert>
      </Snackbar>

    </div>
  );
};

export default Login;