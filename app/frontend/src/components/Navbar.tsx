import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import AuthContext for Firebase authentication
import { useState, useEffect } from 'react';
import settingService from '../services/settingService';
import { Badge, IconButton, Tooltip, styled, Drawer, Box, AppBar, CssBaseline, Stack, List, ListItem, Divider } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CloseIcon from '@mui/icons-material/Close';
import CustomerOrders from './CustomerOrders';
import CourierDelivery from './CourierDelivery';
import deliveryService from '../services/deliveryService';
import { Menu } from '@mui/icons-material';

const TranslucentBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Change this to desired translucency
    color: theme.palette.secondary.main,
  },
}));

export default function NavBar() {
  const { currentUser, logout } = useAuth(); // useAuth provides currentUser and logout function
  const [activeLink, setActiveLink] = useState('');
  const [customerdrawerOpen, setCustomerDrawerOpen] = useState(false);
  const [courierDrawerOpen, setCourierDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { data: order } = deliveryService.getCustomerActiveOrder().useQuery();
  const { data: delivery } = deliveryService.getCourierActiveOrder().useQuery();
  const activeOrderCount = order && order.data ? 1 : 0;
  const activeDeliveryCount = delivery && delivery.data ? (Array.isArray(delivery.data) ? delivery.data.length : 1) : 0;

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, [window.location.pathname]);

  // get user role settings
  const { data: roleData } = settingService.getRoleSettings().useQuery();
  const { mutate: updateRole } = settingService.updateRole(() => console.log("Successfully updated role")).useMutation();

  const handleSignOut = async () => {
    try {
      await logout(); // Calls the logout function from useAuth (Firebase signOut method)
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleRoleConfirmation = (currRole, role, path) => {
    if (currRole) {
      navigate(path);
      setActiveLink(path); // Set active link
    } else {
      const confirmRole = window.confirm('You do not have the required role to access this page. Do you want to enable this role and proceed?');
      if (confirmRole) {
        updateRole({ role, enabled: true });
        navigate(path);
        setActiveLink(path); // Set active link
      }
    }
  };

  const toggleCustomerDrawer = (open: boolean) => (event) => {
    if (
      event.type === 'keydown' &&
      ((event.key === 'Tab' || event.key === 'Shift'))
    ) {
      return;
    }
    if (open) setMobileOpen(false);
    setCustomerDrawerOpen(open);
  };

  const toggleCourierDrawer = (open: boolean) => (event) => {
    if (
      event.type === 'keydown' &&
      ((event.key === 'Tab' || event.key === 'Shift'))
    ) {
      return;
    }
    if (open) setMobileOpen(false);
    setCourierDrawerOpen(open);
  };

  // Mobile nav bar functionality
  const [mobileOpen, setMobileOpen] = useState(false);
  const container = window !== undefined ? () => window.document.body : undefined;
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const styleOnlyShowOnDesktop = { display: { xs: 'none', sm: 'block' } };
  const styleOnlyShowOnMobile = { display: { xs: 'block', sm: 'none' } };

  const customerLinkIsActive = activeLink === '/restaurants' || /^\/restaurant\/\d+$/.test(activeLink);

  const navBarContent = currentUser ? [
    <a
      className={`navbar-option ${customerLinkIsActive ? 'active' : ''}`}
      style={{ cursor: 'pointer' }}
      onClick={() => handleRoleConfirmation(roleData?.role_settings.customerRole, 'customerRole', '/restaurants')}
    >
      Customer
    </a>,
    <a
      className={`navbar-option ${activeLink === '/deliveries' ? 'active' : ''}`}
      style={{ cursor: 'pointer' }}
      onClick={() => handleRoleConfirmation(roleData?.role_settings.courierRole, 'courierRole', '/deliveries')}
    >
      Courier
    </a>,
    <Link
      to="/settings"
      className={`navbar-option ${activeLink === '/settings' ? 'active' : ''}`}
      onClick={() => setActiveLink('/settings')}
    >
      Settings
    </Link>,
    <>
      <Tooltip title="Active Orders">
        <IconButton onClick={toggleCustomerDrawer(true)} style={{ color: 'white', marginRight: '16px', fontSize: '2rem' }} className="icon-button">
          <TranslucentBadge badgeContent={activeOrderCount} color="secondary">
            <ShoppingBagIcon fontSize="inherit" />
          </TranslucentBadge>
        </IconButton>
      </Tooltip>
      <Tooltip title="Active Delivery">
        <IconButton onClick={toggleCourierDrawer(true)} style={{ color: 'white', marginRight: '16px', fontSize: '2rem' }} className="icon-button">
          <TranslucentBadge badgeContent={activeDeliveryCount} color="secondary">
            <LocalShippingIcon fontSize="inherit" />
          </TranslucentBadge>
        </IconButton>
      </Tooltip>
    </>,
    <button className="navbar-signout" onClick={handleSignOut}>
      Sign out
    </button>
  ] : [
    <Link to="/login" className="navbar-signin">
      Sign in
    </Link>
  ]


  // customer path is temporary, replace with actual path
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Mobile nav bar */}
      <AppBar sx={{ ...styleOnlyShowOnMobile }} color='primary'>
        <nav>
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 20,
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: '200px', 
                zIndex: (theme) => theme.zIndex.drawer + 2, 
                backgroundColor: (theme) => theme.palette.primary.main,
              },
            }}
          >
            <List>
              <ListItem>
              <div className="navbar-title">
                <Link
                  to="/restaurants"
                  style={{ color: 'white', textDecoration: 'none' }}
                  onClick={() => setActiveLink('/restaurants')}
                  className={activeLink === '/restaurants' ? 'active' : ''}
                >
                  QuickBytes
                </Link>
                <Divider/>
              </div>
              </ListItem>
              { navBarContent.map((el, index) => <ListItem key={index}>{el}</ListItem>) }
            </List>
          </Drawer>
        </nav>
      </AppBar>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <nav className="navbar">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, ...styleOnlyShowOnMobile }}
          >
            <Menu />
          </IconButton>
          <div className="navbar-title">
            <Link
              to="/restaurants"
              style={{ color: 'white', textDecoration: 'none' }}
              onClick={() => setActiveLink('/restaurants')}
              className={activeLink === '/restaurants' ? 'active' : ''}
            >
              QuickBytes
            </Link>
          </div>
          {/* Desktop nav bar options */}
          <Stack direction="row" className="navbar-options" sx={{ ...styleOnlyShowOnDesktop }}>
            { navBarContent }
          </Stack>
        </nav>
      </AppBar>
      <Drawer anchor="right" open={customerdrawerOpen} onClose={toggleCustomerDrawer(false)}>
        <Box
          sx={{ width: 350, padding: 2 }}
          className="drawer-content"
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
          className="drawer-content"
          role="presentation"
        >
          <IconButton onClick={toggleCourierDrawer(false)} style={{ float: 'right' }}>
            <CloseIcon />
          </IconButton>
          <CourierDelivery isDrawer={true} onClose={toggleCourierDrawer(false)} />
        </Box>
      </Drawer>
    </Box>
  );
}