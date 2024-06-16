import './Nav2.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import AuthContext for Firebase authentication

export default function Navout() {
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
