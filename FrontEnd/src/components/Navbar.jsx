import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow mb-4 rounded-5">
            <div className="container">
                < Link className="navbar-brand fw-bold text-primary" to="/">Travel Up</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/"> Request </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/AddAgency"> Agency </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
export default Navbar;