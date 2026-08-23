const fs = require('fs');
let content = fs.readFileSync('client/src/pages/AdminDashboard.jsx', 'utf8');

const qrSection = `
          <div className="admin-controls" style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '10px' }}>Registration Payment QR Code</h3>
            {paymentQrUrl && (
              <div style={{ marginBottom: '15px' }}>
                <p>Current QR Code:</p>
                <img src={paymentQrUrl.startsWith('http') ? paymentQrUrl : getBaseUrl() + paymentQrUrl} alt="Payment QR" style={{ maxWidth: '150px', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
            )}
            <form onSubmit={handleQrUpload} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="file" accept="image/*" onChange={(e) => setQrFile(e.target.files[0])} required />
              <button type="submit" className="portal-btn active" disabled={qrUploading} style={{ padding: '8px 15px', height: 'auto', background: '#3498db' }}>
                {qrUploading ? 'Uploading...' : 'Upload QR Code'}
              </button>
            </form>
          </div>
`;

if (!content.includes('Registration Payment QR Code')) {
  content = content.replace(
    '<div className="stats-grid">',
    qrSection + '\n          <div className="stats-grid">'
  );
  fs.writeFileSync('client/src/pages/AdminDashboard.jsx', content);
  console.log('Added QR section to AdminDashboard.jsx');
}
