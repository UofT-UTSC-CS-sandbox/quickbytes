import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import AuthContext for Firebase authentication
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import settingService from '../services/settingService';

export default function NavBar() {
  const { currentUser, logout } = useAuth(); // useAuth provides currentUser and logout function
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

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

  const handleRoleConfirmation = (currRole: boolean | undefined, role: string , path: string) => {
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
              style={{cursor: 'pointer'}}
              onClick={() => handleRoleConfirmation(roleData?.role_settings.customerRole, 'customerRole', '/user-page')}
            >
              Customer
            </a>
            <a
              className="navbar-option"
              style={{cursor: 'pointer'}}
              onClick={() => handleRoleConfirmation(roleData?.role_settings.courierRole, 'courierRole', '/deliveries')}
            >
              Courier
            </a>
            <Link to="/settings" className="navbar-option">
              Settings
            </Link>
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
    </nav>
  );
}