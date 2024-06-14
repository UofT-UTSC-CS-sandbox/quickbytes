/*Same as the navbar except it has a logout button and it also has a handler for signing out with firebase
*/

import './Navbar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import AuthContext for Firebase authentication

export default function Navout() {
  const { logout } = useAuth(); //useAuth provides a logout function

  const handleSignOut = async () => {
    try {
      await logout(); // Calls the logout function from useAuth (Firebase signOut method)
    } catch (error) {
      console.error('Error signing out:', error);
      // Handle sign-out error if needed
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">
                <Link to="/" style={{ color: 'white' }}>QuickBytes</Link>
      </div>
      <div className="navbar-options">
        <button className="navbar-signout" onClick={handleSignOut}>Sign out</button>
      </div>
    </nav>
  );
}

