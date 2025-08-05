import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../style/Navbar.css';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 20) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    return (
        <nav className={`navbar navbar-expand-lg custom-navbar shadow mb-4 rounded-5 ${scrolled ? 'scrolled' : ''}`}>
            <div className="container custom-container">
                <Link className="navbar-brand fw-bold text-light fs-4" to="/">Travel Up</Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    onClick={toggleNavbar}
                    aria-controls="navbarNav"
                    aria-expanded={isOpen} 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold text-light fs-5" to="/TravelRequest">Requisição</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold text-light fs-5" to="/AddAgency">Agencia</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
