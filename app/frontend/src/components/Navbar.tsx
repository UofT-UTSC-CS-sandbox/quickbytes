import './Navbar.css';
import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
        <nav className="navbar">
            <div className="navbar-title">
                QuickBytes
            </div>
            <div className="navbar-options">
                <button className="navbar-signout">Sign in</button>
            </div>
        </nav>
    );
}