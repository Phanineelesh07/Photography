import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Camera, Menu, X } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  const isHome = location.pathname === '/';
  const navClass = `navbar ${scrolled || !isHome ? 'scrolled' : ''}`;

  return (
    <nav className={navClass}>
      <div className="container nav-container">
        <Link to="/" className="nav-logo" onClick={() => { window.scrollTo(0, 0); closeMenu(); }}>
          <Camera size={28} />
          <span>I N S P I R E</span>
        </Link>

        <div className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li onClick={() => window.scrollTo(0, 0)}><Link to="/" onClick={closeMenu}>Home</Link></li>
          
          {user ? (
            <>
              {user.role === 'admin' ? (
                <li><Link to="/admin" onClick={closeMenu}>Admin Dashboard</Link></li>
              ) : (
                <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
              )}
              <li><button className="nav-btn-outline" onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
              <li><Link to="/register" className="nav-btn" onClick={closeMenu}>Register Now</Link></li>
            </>
          )}
        </ul>

        {/* Upper Right Logos - Visible at all times */}
          <div className="nav-logos" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            
            {/* AU Logo */}
            <a href="https://www.adityauniversity.in/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50px', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <img src="/images/au_logo_nav.png" alt="Aditya University Logo" style={{ height: "46px", objectFit: "contain" }} />
            </a>

            {/* Club Logo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50px' }}>
              <img src="/images/club_logo.png" alt="Film Club Logo" style={{ height: "46px", objectFit: "contain" }} />
            </div>

          </div>
      </div>
    </nav>
  );
};

export default Navbar;










