import React from 'react';
import './App.css';
import './WelcomePage.css'
import NavBar from '../components/Navbar';
import { Typography, Button, Grid } from '@mui/material';
import DeliveryIcon from '@mui/icons-material/DeliveryDining';
import ViewIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
    const userName = getAuth().currentUser?.email?.split("@")[0];
    const nav = useNavigate();
    return (
    <>
        <NavBar />
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
                    onClick={()=>nav("/deliveries")}
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
                    >
                    Settings
                    </Button>
                </Grid>
                </Grid>
            </div>
            </div>
        </div>
    </>
    );
}
export default WelcomePage;