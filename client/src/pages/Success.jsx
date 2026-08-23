import { useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Success.css';

const Success = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If not logged in/registered recently, redirect to home
    if (!user) {
      navigate('/');
      return;
    }

    // Auto-redirect to dashboard after animation
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 4000);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="success-container">
      {user.role === 'viewer' && (
        <>
          <div className="shutter-top"></div>
          <div className="shutter-bottom"></div>
          <div className="camera-flash"></div>
        </>
      )}
      
      <div className="success-bg">
        <img 
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop" 
          alt="Success Background" 
        />
        <div className="success-overlay"></div>
      </div>

      <motion.div 
        className="success-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle size={80} color="var(--color-accent)" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {user.role === 'viewer' ? 'Welcome, Viewer' : 'Registration Complete'}
        </motion.h1>
        
        <motion.p
          className="success-greeting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {user.role === 'viewer' ? 'Your portal will update soon.' : 'Welcome, Future Photographer.'}
        </motion.p>
        
        {user.role === 'participant' && (
          <motion.div 
            className="success-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="detail-item">
              <span>Name</span>
              <strong>{user.name}</strong>
            </div>
            <div className="detail-item">
              <span>Roll Number</span>
              <strong>{user.rollNumber}</strong>
            </div>
            <div className="detail-item">
              <span>Selected Theme</span>
              <strong>{user.selectedTheme}</strong>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Link to="/dashboard" className="btn-primary mt-4" style={{ display: 'inline-block' }}>
            Continue to Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Success;
