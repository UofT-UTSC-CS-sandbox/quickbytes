import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './pages/App';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import UserPage from './pages/UserPage';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './privateRoute';
import VerificationInstructions from './pages/verificationInstructions';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      // blue
      main: '#25355A'
    },
    secondary: {
      // orange 
      main: '#FC8A06'
    },
    success: {
      // green
      main: '#028643'
    },
    error: {
      // red
      main: '#A30000'
    },
    info: {
      // blue
      main: '#007FA3'
    }
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user-page" element={<PrivateRoute><UserPage /></PrivateRoute>} />
            <Route path="/verification-instructions" element={<VerificationInstructions />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
