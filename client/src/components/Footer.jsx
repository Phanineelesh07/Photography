import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer id="footer" className="au-footer">
      <div className="footer-main">
        <div className="container footer-grid">
          
          {/* Column 1: Logo */}
          <div className="footer-col logo-col">
            <img src="/images/club_logo.png" alt="Film and Photography Club" style={{ width: "100%", maxWidth: "220px", objectFit: "contain", mixBlendMode: "multiply", filter: "none" }} />
          </div>

          {/* Column 2: Contact Info */}
          <div className="footer-col" style={{ maxWidth: '280px', marginTop: '10px' }}>
            <ul className="footer-contact">
              <li>
                <MapPin className="contact-icon" size={20} />
                <span>Aditya Nagar, ADB Road, Surampalem, Kakinada District, Andhra Pradesh, India - 533437</span>
              </li>
              
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ color: '#eab308', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', fontWeight: 'bold', lineHeight: '1.4' }}>
                  For queries regarding club/event (Contact Manager or Faculty Coordinator).
                </p>
                
                <div style={{ borderTop: '1px dashed rgba(255,255,255,0.2)', margin: '15px 0' }}></div>

                <p style={{ color: '#eab308', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', fontWeight: 'bold', lineHeight: '1.4' }}>
                  For website queries or technical issues (Contact Manager).
                </p>
                
              </div>
            </ul>
          </div>

          {/* Column 3: Event Links */}
          <div className="footer-col">
            <ul className="footer-links">
              <li><Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link></li>
              <li><a href="/#about">About Event</a></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          {/* Column 3: Club Information */}
          <div className="footer-col">
            <ul className="footer-links">
              <li><a href="/#club">Film & Photography Club</a></li>
              <li><a href="/#team">Our Team</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container bottom-content" style={{ justifyContent: 'center' }}>
          <div className="copyright">
            &copy; Copyright {new Date().getFullYear()} - Film and photography club - Aditya University . All Rights Reserved. <span className="dev-credit">� Website Designed for Inspire Event</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;





