import './Navbar.css';
import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
        <nav className="navbar">
            <div className="navbar-title">
                QuickBytes
            </div>
            <div className="navbar-options">
                <a href="#option1" className="navbar-option">Customer</a>
                <a href="#option2" className="navbar-option">Courier</a>
                <Link to="/settings" className="navbar-option">Settings</Link>
                <button className="navbar-signout">Sign Out</button>
            </div>
        </nav>
    );
}