import './Navbar.css';
import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
        <nav className="navbar">
            <div className="navbar-title">
                <Link to="/">QuickBytes</Link>
            </div>
            <div className="navbar-options">
                <Link to="/login" className="navbar-signout">Sign in</Link>
            </div>
        </nav>
    );
}






/*
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
    */