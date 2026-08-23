const fs = require('fs');
let content = fs.readFileSync('client/src/pages/AdminDashboard.jsx', 'utf8');

const deleteFunc = `
  const handleDeleteQr = async () => {
    if (window.confirm('Are you sure you want to delete the payment QR code?')) {
      try {
        const newSettings = await settingsService.deleteQr();
        setPaymentQrUrl(newSettings.paymentQrUrl);
        alert('QR code deleted successfully');
      } catch (err) {
        alert('Failed to delete QR code: ' + err.message);
      }
    }
  };
`;

if (!content.includes('handleDeleteQr')) {
  content = content.replace(
    'const handleQrUpload = async (e) => {',
    deleteFunc + '\n  const handleQrUpload = async (e) => {'
  );
}

// Update the rendering section
const oldQrRender = `                <p>Current QR Code:</p>
                <img src={paymentQrUrl.startsWith('http') ? paymentQrUrl : getBaseUrl() + paymentQrUrl} alt="Payment QR" style={{ maxWidth: '150px', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
            )}`;

const newQrRender = `                <p>Current QR Code:</p>
                <img src={paymentQrUrl.startsWith('http') ? paymentQrUrl : getBaseUrl() + paymentQrUrl} alt="Payment QR" style={{ maxWidth: '150px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '10px' }} />
                <div>
                  <button onClick={handleDeleteQr} className="portal-btn" style={{ background: '#e74c3c', color: 'white', padding: '5px 10px', fontSize: '0.9rem', width: 'auto' }}>
                    Delete QR Code
                  </button>
                </div>
              </div>
            )}`;

content = content.replace(oldQrRender, newQrRender);

fs.writeFileSync('client/src/pages/AdminDashboard.jsx', content);
console.log('AdminDashboard.jsx updated');
