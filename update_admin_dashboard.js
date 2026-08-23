const fs = require('fs');

let content = fs.readFileSync('client/src/pages/AdminDashboard.jsx', 'utf8');

if (!content.includes('qrUpload')) {
  // 1. Imports
  content = content.replace(
    "import adminService from '../services/adminService';",
    "import adminService from '../services/adminService';\nimport settingsService from '../services/settingsService';"
  );
  
  // 2. States
  content = content.replace(
    "const [uploadEnabled, setUploadEnabled] = useState(false);",
    "const [uploadEnabled, setUploadEnabled] = useState(false);\n  const [paymentQrUrl, setPaymentQrUrl] = useState('');\n  const [qrFile, setQrFile] = useState(null);\n  const [qrUploading, setQrUploading] = useState(false);"
  );

  // 3. Load QR
  content = content.replace(
    "setUploadEnabled(settings.uploadEnabled);",
    "setUploadEnabled(settings.uploadEnabled);\n        setPaymentQrUrl(settings.paymentQrUrl || '');"
  );
  
  // 4. Handle QR Upload
  const qrUploadFunction = `
  const handleQrUpload = async (e) => {
    e.preventDefault();
    if (!qrFile) return;
    setQrUploading(true);
    try {
      const formData = new FormData();
      formData.append('qr', qrFile);
      const newSettings = await settingsService.uploadQr(formData);
      setPaymentQrUrl(newSettings.paymentQrUrl);
      setQrFile(null);
      alert('QR Code uploaded successfully!');
    } catch (err) {
      alert('Failed to upload QR: ' + err.message);
    } finally {
      setQrUploading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveUser(id);
      setParticipants(participants.map(p => p._id === id ? { ...p, isApproved: true } : p));
    } catch (err) {
      alert('Failed to approve user: ' + err.message);
    }
  };
`;
  content = content.replace(
    "const handleToggleUpload = async () => {",
    qrUploadFunction + "\n  const handleToggleUpload = async () => {"
  );

  // 5. Add QR section to UI
  const qrSection = `
          <div className="admin-controls" style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '10px' }}>Registration Payment QR Code</h3>
            {paymentQrUrl && (
              <div style={{ marginBottom: '15px' }}>
                <p>Current QR Code:</p>
                <img src={paymentQrUrl} alt="Payment QR" style={{ maxWidth: '150px', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
            )}
            <form onSubmit={handleQrUpload} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="file" accept="image/*" onChange={(e) => setQrFile(e.target.files[0])} required />
              <button type="submit" className="portal-btn active" disabled={qrUploading} style={{ padding: '8px 15px', height: 'auto' }}>
                {qrUploading ? 'Uploading...' : 'Update QR Code'}
              </button>
            </form>
          </div>
`;
  content = content.replace(
    "</div>\n        </motion.div>\n\n        <motion.div",
    qrSection + "\n        </div>\n        </motion.div>\n\n        <motion.div"
  );
  
  // 6. Add Approve button to Table
  content = content.replace(
    "<button onClick={() => handleEditClick(p)} style={{background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', marginRight: '10px'}}>Edit</button>",
    "{!p.isApproved && p.role === 'participant' && <button onClick={() => handleApprove(p._id)} style={{background: '#2ecc71', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px'}}>Approve</button>}\n                            <button onClick={() => handleEditClick(p)} style={{background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', marginRight: '10px'}}>Edit</button>"
  );

  fs.writeFileSync('client/src/pages/AdminDashboard.jsx', content);
  console.log('AdminDashboard.jsx updated');
}
