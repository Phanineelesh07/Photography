const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Register.jsx', 'utf8');

const searchBlock = `                <img src={paymentQrUrl.startsWith('http') ? paymentQrUrl : getBaseUrl() + paymentQrUrl} alt="Payment QR Code" style={{ maxWidth: '200px', borderRadius: '8px', border: '2px solid #fff', marginBottom: '15px' }} />
                <p style={{ fontSize: '0.85rem', color: '#ff9800' }}>Note: After payment, submit the application. Admin will verify and approve your account.</p>
              </div>`;

const updatedBlock = `                <img src={paymentQrUrl.startsWith('http') ? paymentQrUrl : getBaseUrl() + paymentQrUrl} alt="Payment QR Code" style={{ width: '100%', maxWidth: '350px', borderRadius: '8px', border: '2px solid #fff', marginBottom: '15px' }} />
                <h4 style={{ color: '#2ecc71', fontSize: '1.3rem', margin: '15px 0' }}>Registration Fee: ₹49 Only</h4>
                <p style={{ fontSize: '0.85rem', color: '#ff9800' }}>Note: After payment, submit the application. Admin will verify and approve your account.</p>
              </div>`;

content = content.replace(searchBlock, updatedBlock);

fs.writeFileSync('client/src/pages/Register.jsx', content);
console.log('Register.jsx updated');
