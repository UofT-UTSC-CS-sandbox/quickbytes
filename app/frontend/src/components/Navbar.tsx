import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import AuthContext for Firebase authentication
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import settingService from '../services/settingService';
import { Badge, IconButton, Tooltip, styled, Drawer, Box, Typography } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CloseIcon from '@mui/icons-material/Close';
import orderService from '../services/orderService';
import CustomerOrders from './CustomerOrders';
import CourierDelivery from './CourierDelivery';

const TranslucentBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Change this to desired translucency
    color: theme.palette.secondary.main,
  },
}));

export default function NavBar() {
  const { currentUser, logout } = useAuth(); // useAuth provides currentUser and logout function
  const [userId, setUserId] = useState('');
  const [activeLink, setActiveLink] = useState('');
  const [customerdrawerOpen, setCustomerDrawerOpen] = useState(false);
  const [courierDrawerOpen, setCourierDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { data: orders } = orderService.getUserActiveOrders(userId).useQuery();
  const { data: deliveries } = orderService.getUserActiveDelivery(userId).useQuery();
  const activeOrderCount = Array.isArray(orders?.data) ? orders.data.length : 0;
  const activeDeliveryCount = Array.isArray(deliveries?.data) ? deliveries.data.length : 0;

  useEffect(() => {
    const auth = getAuth();

    // Get current user uid from Firebase
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.log('No user is signed in.');
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  // get user role settings
  const { data: roleData } = settingService.getRoleSettings(userId).useQuery();
  const { mutate: updateRole } = settingService.updateRole(userId, () => console.log("Successfully updated role")).useMutation();

  const handleSignOut = async () => {
    try {
      await logout(); // Calls the logout function from useAuth (Firebase signOut method)
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleRoleConfirmation = (currRole: boolean | undefined, role: string, path: string) => {
    if (currRole) {
      navigate(path);
    } else {
      const confirmRole = window.confirm('You do not have the required role to access this page. Do you want to enabled this role and proceed?');
      if (confirmRole) {
        updateRole({ role, enabled: true });
        navigate(path);
      }
    }
  };

  const toggleCustomerDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setCustomerDrawerOpen(open);
  };

  const toggleCourierDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setCourierDrawerOpen(open);
  };

  // customer path is temporary, replace with actual path
  return (
    <nav className="navbar">
      <div className="navbar-title">
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          QuickBytes
        </Link>
      </div>
      <div className="navbar-options">
        {currentUser ? (
          <>
            <a
              className="navbar-option"
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoleConfirmation(roleData?.role_settings.customerRole, 'customerRole', '/user-page')}
            >
              Customer
            </a>
            <a
              className="navbar-option"
              style={{ cursor: 'pointer' }}
              onClick={() => handleRoleConfirmation(roleData?.role_settings.courierRole, 'courierRole', '/deliveries')}
            >
              Courier
            </a>
            <Link to="/settings" className="navbar-option">
              Settings
            </Link>
            <Tooltip title="Active Orders">
              <IconButton onClick={toggleCustomerDrawer(true)} style={{ color: 'white', marginRight: '16px', fontSize: '2rem' }}>
                <TranslucentBadge badgeContent={activeOrderCount} color="secondary">
                  <ShoppingBagIcon fontSize="inherit" />
                </TranslucentBadge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Active Delivery">
              <IconButton onClick={toggleCourierDrawer(true)} style={{ color: 'white', marginRight: '16px', fontSize: '2rem' }}>
                <TranslucentBadge badgeContent={activeDeliveryCount} color="secondary">
                  <LocalShippingIcon fontSize="inherit" />
                </TranslucentBadge>
              </IconButton>
            </Tooltip>
            <button className="navbar-signout" onClick={handleSignOut}>
              Sign out
            </button>
          </>
        ) : (
          <Link to="/login" className="navbar-signin">
            Sign in
          </Link>
        )}
      </div>
      <Drawer anchor="right" open={customerdrawerOpen} onClose={toggleCustomerDrawer(false)}>
        <Box
          sx={{ width: 350, padding: 2 }}
          role="presentation"
        >
          <IconButton onClick={toggleCustomerDrawer(false)} style={{ float: 'right' }}>
            <CloseIcon />
          </IconButton>
          <CustomerOrders isDrawer={true} onClose={toggleCustomerDrawer(false)} />
        </Box>
      </Drawer>
      <Drawer anchor="right" open={courierDrawerOpen} onClose={toggleCourierDrawer(false)}>
        <Box
          sx={{ width: 350, padding: 2 }}
          role="presentation"
        >
          <IconButton onClick={toggleCourierDrawer(false)} style={{ float: 'right' }}>
            <CloseIcon />
          </IconButton>
          <CourierDelivery isDrawer={true} onClose={toggleCourierDrawer(false)} />
        </Box>
      </Drawer>
    </nav>
  );
}
