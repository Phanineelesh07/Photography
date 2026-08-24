import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Check } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { register as registerService } from '../services/authService';
import '../styles/Auth.css';

export const THEMES = [
  {
    id: 'Nature & Greenery',
    title: 'Nature & Greenery',
    description: 'Leaves, flowers, trees, plants, greenery, natural patterns, etc.',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'Reflections & Perspectives',
    title: 'Reflections & Perspectives',
    description: 'Reflections in mirrors, glass, water, unusual angles, low/high-angle shots, etc.',
    image: 'https://images.unsplash.com/photo-1493606278519-11aa9f86e40a?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'Views Through a Frame',
    title: 'Views Through a Frame',
    description: 'Views captured through windows, doors, arches, railings, tree branches, classroom frames, etc.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'Everyday Objects, Extraordinary Frames',
    title: 'Everyday Objects, Extraordinary Frames',
    description: 'Benches, books, bags, bicycles, bottles, desks, stationery, and other everyday campus objects captured creatively.',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop'
  }
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    phone: '',
    course: '',
    branch: '',
    year: '',
    email: '',
    password: '',
    otp: '',
    selectedTheme: '',
    userType: 'participant'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [paymentQrUrl, setPaymentQrUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const getBaseUrl = () => { const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; return apiUrl.replace('/api', ''); };
  
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(API_URL + '/settings');
        const data = await res.json();
        if (data && data.paymentQrUrl) {
          setPaymentQrUrl(data.paymentQrUrl);
        }
      } catch (err) {
        console.error('Error fetching settings', err);
      }
    };
    fetchSettings();
  }, []);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleThemeSelect = (themeId) => {
    setFormData({
      ...formData,
      selectedTheme: themeId
    });
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError('Please enter your email first.');
      return;
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSendingOtp(true);
    setError('');
    try {
      const { sendOtp } = await import('../services/authService');
      await sendOtp(formData.email);
      setOtpSent(true);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.otp) {
      setError('Please enter the OTP sent to your email.');
      return;
    }

    if (formData.userType === 'participant' && !formData.selectedTheme) {
      setError('Please select a photography theme.');
      return;
    }

    setLoading(true);

    try {
      const data = await registerService(formData);
      if (data.pendingApproval) {
        setSubmitted(true);
      } else {
        login(data, data.token);
        navigate('/success');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  if (submitted) {
    return (
      <div className="auth-container" style={{ padding: '120px 24px 100px', textAlign: 'center' }}>
        <div className="auth-bg">
          <img src="https://images.unsplash.com/photo-1502691866385-4eb84e314644?q=80&w=2000&auto=format&fit=crop" alt="Dark Architecture" />
          <div className="auth-overlay"></div>
        </div>
        <motion.div className="auth-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="auth-header" style={{ marginBottom: '10px' }}>
            <h2 style={{ color: '#2ecc71', marginBottom: '15px' }}>Application Received!</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Thank you for registering, <strong>{formData.name}</strong>.</p>
            <p>Stay tuned for your participating! Your application will be verified soon, and then you can log in.</p>
          </div>
          <Link to="/" className="portal-btn active" style={{ marginTop: '20px', display: 'inline-block', textDecoration: 'none' }}>Return to Home</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="auth-container" style={{ padding: '120px 24px 100px' }}>
      <div className="auth-bg">
        <img 
          src="https://images.unsplash.com/photo-1502691866385-4eb84e314644?q=80&w=2000&auto=format&fit=crop" 
          alt="Dark Architecture" 
        />
        <div className="auth-overlay"></div>
      </div>
      
      <motion.div 
        className="auth-card register-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-header">
          <h2>Participant Registration</h2>
          <p>Join the Inspire photography event.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="portal-toggle">
            <button type="button" className={`portal-btn ${formData.userType === 'participant' ? 'active' : ''}`} onClick={() => setFormData({...formData, userType: 'participant'})}>Contestant</button>
            <button type="button" className={`portal-btn ${formData.userType === 'viewer' ? 'active' : ''}`} onClick={() => setFormData({...formData, userType: 'viewer'})}>Viewer</button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label>Roll Number</label>
              <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} placeholder="e.g. 21CS101" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 9876543210" required />
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label>Email Address</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="student@college.edu" required disabled={otpSent} style={{ flex: 1 }} />
                {!otpSent ? (
                  <button type="button" onClick={handleSendOtp} className="portal-btn" style={{ padding: '0 15px', whiteSpace: 'nowrap' }} disabled={sendingOtp || !formData.email}>
                    {sendingOtp ? 'Sending...' : 'Send OTP'}
                  </button>
                ) : (
                  <button type="button" onClick={() => setOtpSent(false)} className="portal-btn" style={{ padding: '0 15px', background: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>
                    Change
                  </button>
                )}
              </div>
            </div>
          </div>

          {otpSent && (
            <div className="form-group">
              <label>Enter Email OTP</label>
              <input type="text" name="otp" value={formData.otp} onChange={handleChange} placeholder="6-digit code" required />
              <small style={{ color: '#2ecc71', marginTop: '5px', display: 'block' }}>OTP sent to {formData.email}</small>
            </div>
          )}

          {formData.userType === 'participant' && (
            <div className="form-row">
              <div className="form-group">
                <label>Select Course/Program</label>
                <select 
                  name="course" 
                  value={formData.course} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Select Course</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="BBA">BBA</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Polytechnic">Polytechnic</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {formData.course === 'B.Tech' && (
                <div className="form-group">
                  <label>Select Branch</label>
                  <select 
                    name="branch" 
                    value={formData.branch} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="AI & DS">AI & DS</option>
                    <option value="AIML">AIML</option>
                    <option value="IT">IT</option>
                    <option value="Petroleum">Petroleum</option>
                    <option value="Mining">Mining</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Year</label>
                <select name="year" value={formData.year} onChange={handleChange} required>
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>
          )}

          <div className="form-group" style={{ position: 'relative' }}>
            <label>Password (for dashboard access)</label>
            <input 
              type={showPassword ? 'text' : 'password'} 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Create a password (min 6 chars)" 
              minLength="6" 
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

          {formData.userType === 'participant' && (
            <div className="theme-selection">
              <h3>Select Your Photography Theme</h3>
              <p className="mb-2" style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>You can only select one theme. Choose wisely.</p>
              
              <div className="theme-grid">
                {THEMES.map((theme) => (
                  <div 
                    key={theme.id}
                    className={`theme-card ${formData.selectedTheme === theme.id ? 'selected' : ''}`}
                    onClick={() => handleThemeSelect(theme.id)}
                  >
                    <img src={theme.image} alt={theme.title} />
                    <div className="theme-card-overlay">
                      <h4>{theme.title}</h4>
                      <p>{theme.description}</p>
                    </div>
                    <div className="theme-check">
                      <Check size={18} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          
{formData.userType === 'participant' && paymentQrUrl && (
            <div className="payment-section" style={{ margin: '20px 0', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ marginBottom: '15px', color: 'var(--color-primary)' }}>Registration Payment</h3>
              <p style={{ marginBottom: '15px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Please scan the QR code below to complete your registration payment.</p>
              <img src={paymentQrUrl.startsWith('http') ? paymentQrUrl : getBaseUrl() + paymentQrUrl} alt="Payment QR Code" style={{ width: '100%', maxWidth: '350px', borderRadius: '8px', border: '2px solid #fff', marginBottom: '15px' }} />
              <h4 style={{ color: '#2ecc71', fontSize: '1.3rem', margin: '15px 0' }}>Registration Fee: Rs : 49/- only..!!</h4>
              <p style={{ fontSize: '0.85rem', color: '#ff9800' }}>Note: After payment, submit the application. Admin will verify and approve your account.</p>
            </div>
          )}

          {formData.userType === 'participant' && !paymentQrUrl && (
            <div className="payment-section" style={{ margin: '20px 0', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ marginBottom: '15px', color: '#f39c12' }}>Payment Section</h3>
              <p style={{ fontSize: '1.1rem', color: '#ccc' }}>Will update soon. Stay tuned!</p>
              <p style={{ fontSize: '0.9rem', marginTop: '10px', color: 'var(--color-text-secondary)' }}>Registrations are temporarily paused until the payment details are provided.</p>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-submit" 
            disabled={loading || !otpSent || (formData.userType === 'participant' && !formData.selectedTheme) || (formData.userType === 'participant' && !paymentQrUrl)}
          >
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already registered? <Link to="/login">Login here</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
