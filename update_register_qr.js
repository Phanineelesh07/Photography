const fs = require('fs');

let content = fs.readFileSync('client/src/pages/Register.jsx', 'utf8');

if (!content.includes('paymentQrUrl')) {
  // 1. imports
  content = content.replace(
    "import { useState, useContext } from 'react';",
    "import { useState, useContext, useEffect } from 'react';"
  );
  
  // 2. State
  content = content.replace(
    "const [showPassword, setShowPassword] = useState(false);",
    "const [showPassword, setShowPassword] = useState(false);\n  const [paymentQrUrl, setPaymentQrUrl] = useState('');\n  const [submitted, setSubmitted] = useState(false);"
  );

  // 3. useEffect
  const useEffectBlock = `
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
`;
  content = content.replace(
    "const { login } = useContext(AuthContext);",
    useEffectBlock + "\n  const { login } = useContext(AuthContext);"
  );

  // 4. handleSubmit
  content = content.replace(
    "login(data, data.token);\n      navigate('/success');",
    "if (data.pendingApproval) {\n        setSubmitted(true);\n      } else {\n        login(data, data.token);\n        navigate('/success');\n      }"
  );

  // 5. Early return for submitted state
  const submittedView = `
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
`;
  content = content.replace(
    "return (\n    <div className=\"auth-container\"",
    submittedView + "\n  return (\n    <div className=\"auth-container\""
  );
  
  // 6. QR Section in render
  const qrSection = `
          {formData.userType === 'participant' && paymentQrUrl && (
            <div className="payment-section" style={{ margin: '20px 0', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ marginBottom: '15px', color: 'var(--color-primary)' }}>Registration Payment</h3>
              <p style={{ marginBottom: '15px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Please scan the QR code below to complete your registration payment.</p>
              <img src={paymentQrUrl} alt="Payment QR Code" style={{ maxWidth: '200px', borderRadius: '8px', border: '2px solid #fff', marginBottom: '15px' }} />
              <p style={{ fontSize: '0.85rem', color: '#ff9800' }}>Note: After payment, submit the application. Admin will verify and approve your account.</p>
            </div>
          )}
`;
  content = content.replace(
    "<button \n            type=\"submit\"",
    qrSection + "\n          <button \n            type=\"submit\""
  );

  fs.writeFileSync('client/src/pages/Register.jsx', content);
  console.log('Register.jsx updated');
}
