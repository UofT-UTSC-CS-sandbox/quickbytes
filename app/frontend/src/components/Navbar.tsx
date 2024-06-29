import './Navbar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import AuthContext for Firebase authentication

export default function NavBar() {
  const { currentUser, logout } = useAuth(); // useAuth provides currentUser and logout function

  const handleSignOut = async () => {
    try {
      await logout(); // Calls the logout function from useAuth (Firebase signOut method)
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
            <Link to="/customer" className="navbar-option">
              Customer
            </Link>
            <Link to="/courier" className="navbar-option">
              Courier
            </Link>
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

