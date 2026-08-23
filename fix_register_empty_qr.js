const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Register.jsx', 'utf8');

const updatedSection = `
          {formData.userType === 'participant' && paymentQrUrl && (
            <div className="payment-section" style={{ margin: '20px 0', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ marginBottom: '15px', color: 'var(--color-primary)' }}>Registration Payment</h3>
              <p style={{ marginBottom: '15px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Please scan the QR code below to complete your registration payment.</p>
              <img src={paymentQrUrl.startsWith('http') ? paymentQrUrl : getBaseUrl() + paymentQrUrl} alt="Payment QR Code" style={{ maxWidth: '200px', borderRadius: '8px', border: '2px solid #fff', marginBottom: '15px' }} />
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
            disabled={loading || (formData.userType === 'participant' && !formData.selectedTheme) || (formData.userType === 'participant' && !paymentQrUrl)}
          >
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
`;

// First, strip out the old block to make replacement easier
const searchBlock = `          {formData.userType === 'participant' && paymentQrUrl && (
            <div className="payment-section" style={{ margin: '20px 0', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ marginBottom: '15px', color: 'var(--color-primary)' }}>Registration Payment</h3>
              <p style={{ marginBottom: '15px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Please scan the QR code below to complete your registration payment.</p>
              <img src={paymentQrUrl.startsWith('http') ? paymentQrUrl : getBaseUrl() + paymentQrUrl} alt="Payment QR Code" style={{ maxWidth: '200px', borderRadius: '8px', border: '2px solid #fff', marginBottom: '15px' }} />
              <p style={{ fontSize: '0.85rem', color: '#ff9800' }}>Note: After payment, submit the application. Admin will verify and approve your account.</p>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-submit" 
            disabled={loading || (formData.userType === 'participant' && !formData.selectedTheme)}
          >
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>`;

content = content.replace(searchBlock, updatedSection.trim());
fs.writeFileSync('client/src/pages/Register.jsx', content);
