import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { login as loginService } from '../services/authService';
import '../styles/Auth.css';

const Login = () => {
  const [loginType, setLoginType] = useState('participant');
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    let val = e.target.value;
    if (e.target.name === 'identifier' && loginType === 'participant') {
      val = val.toUpperCase();
    }
    setFormData({
      ...formData,
      [e.target.name]: val
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginService({ ...formData, loginType });
      login(data, data.token);
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Incorrect roll number or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg">
        <img 
          src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2000&auto=format&fit=crop" 
          alt="Photography Background" 
        />
        <div className="auth-overlay"></div>
      </div>
      
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to your participant dashboard.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="portal-toggle">
            <button type="button" className={`portal-btn ${loginType === 'participant' ? 'active' : ''}`} onClick={() => setLoginType('participant')}>Contestant</button>
            <button type="button" className={`portal-btn ${loginType === 'viewer' ? 'active' : ''}`} onClick={() => setLoginType('viewer')}>Viewer</button>
            <button type="button" className={`portal-btn ${loginType === 'admin' ? 'active' : ''}`} onClick={() => setLoginType('admin')}>Admin</button>
          </div>

          <div className="form-group">
            <label>{loginType === 'participant' ? 'Roll Number' : 'Email Address'}</label>
            <input 
              type={loginType === 'participant' ? 'text' : 'email'} 
              name="identifier" 
              value={formData.identifier}
              onChange={handleChange}
              placeholder={loginType === 'participant' ? 'Enter your roll number' : 'Enter your email address'}
              required 
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label>Password</label>
            <input 
              type={showPassword ? 'text' : 'password'}
              name="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required 
              style={{ paddingRight: '45px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '38px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5px'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={showPassword ? 'hide' : 'show'}
                  initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
                  transition={{ duration: 0.15 }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>

          <button 
            type="submit" 
            className="btn-submit" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
