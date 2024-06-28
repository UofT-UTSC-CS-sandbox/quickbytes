// src/pages/App.tsx
import React, { useState } from 'react';
import './App.css';
import './HomePage.css'
import NavBar from '../components/Navbar';
import { Typography, Button, Grid } from '@mui/material';
import DeliveryIcon from '@mui/icons-material/DeliveryDining';
import ViewIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import Deliveries from './Deliveries';

interface WelcomeProps {
  toggleView: (view:number) => void;
}

const WelcomeView: React.FC<WelcomeProps> = ({ toggleView }) => {
  const userName = "user name";
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '16px' }}>
      <div>
        <Typography variant="h1" className="welcome-text" style={{ fontSize: '4rem', marginBottom: '24px' }}>
          Welcome {userName}
        </Typography>
        <div style={{ marginTop: '24px' }}>
          <Grid container justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: '16px', minWidth: '200px' }}
                startIcon={<DeliveryIcon />}
                onClick={() => {
                  toggleView(1);
                }}
              >
                Accept a delivery
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="info"
                style={{ margin: '16px', minWidth: '200px' }}
                startIcon={<ViewIcon />}
                onClick={() => {
                  toggleView(2)
                }}
              >
                View in progress deliveries
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                style={{ margin: '16px', minWidth: '200px' }}
                startIcon={<SettingsIcon />}
                onClick={() => {
                  toggleView(3);
                }}
              >
                Settings
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

const HomePage: React.FC = () => {
  const [view, setView] = useState(0);
  const views = [<WelcomeView toggleView={setView} />, <Deliveries />]
  return (
    <>
      <NavBar />
      {views[view]}
    </>
  );
};

export default HomePage;
