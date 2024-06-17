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
        <Link to="/" style={{ color: 'white' }}>QuickBytes</Link>
      </div>
      <div className="navbar-options">
        {currentUser ? ( // If currentUser exists ( signed in)
          <>
              <a href="#option1" className="navbar-option">Customer</a>
              <a href="#option2" className="navbar-option">Courier</a>
              <Link to="/settings" className="navbar-option">Settings</Link>
              <button className="navbar-signout" onClick={handleSignOut}>Sign out</button>
          </>
        ) : ( // If currentUser does not exist (not signed in)
          <>
            <Link to="/login" className="navbar-signout">Sign in</Link>
          </>
        )}
      </div>
    </nav>
  );
}
