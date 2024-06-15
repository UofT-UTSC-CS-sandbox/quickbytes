import './Navbar.css';
import { Link } from 'react-router-dom';

export default function NavBar2() {
    return (
        <nav className="navbar">
            <div className="navbar-title">
                <Link to="/" style={{ color: 'white' }}>QuickBytes</Link>
            </div>
            <div className="navbar-options">
                <Link to="/login" className="navbar-signout">Sign in</Link>
            </div>
        </nav>
    );
}