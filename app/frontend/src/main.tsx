import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SignUp from './pages/SignUp';
import Login from './pages/Login';
import UserPage from './pages/UserPage';
import OrderTracking from './pages/OrderTracking.tsx';
import Settings from './pages/Settings.tsx';
import Menu from './pages/Menu.tsx';
import VerificationInstructions from './pages/verificationInstructions';

import { AuthProvider } from './AuthContext';
import PrivateRoute from './privateRoute';

import './index.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import WelcomePage from './pages/WelcomePage.tsx';
import Deliveries from './pages/Deliveries.tsx';
import StaffOrders from './pages/StaffOrders.tsx';

const queryClient = new QueryClient();
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
  typography: {
    h1: {
      fontSize: '2.5rem'
    },
    h2: {
      fontSize: '2rem'
    },
    h3: {
      fontSize: '1.5rem'
    },
    h4: {
      fontSize: '1.2rem'
    },
    h5: {
      fontSize: '1rem'
    },
    h6: {
      fontSize: '0.8rem'
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PrivateRoute> <WelcomePage /> </PrivateRoute>}/>
            <Route path="/user-page" element={<PrivateRoute> <WelcomePage /> </PrivateRoute>} />
            <Route path="/staff/:restaurantId" element={<PrivateRoute> <StaffOrders /> </PrivateRoute>} />
            <Route path="/deliveries" element={<PrivateRoute> <Deliveries /> </PrivateRoute>} />
            <Route path='/restaurant/:id' element={<PrivateRoute><Menu /></PrivateRoute>} />
            <Route path="/tracking" element={<PrivateRoute><OrderTracking /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user-pagee" element={<PrivateRoute><UserPage /></PrivateRoute>} />
            <Route path="/verification-instructions" element={<VerificationInstructions />} />
          </Routes>
        </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)