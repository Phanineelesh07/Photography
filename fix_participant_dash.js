const fs = require('fs');
let content = fs.readFileSync('client/src/pages/ParticipantDashboard.jsx', 'utf8');

if (!content.includes('settingsService')) {
  content = content.replace(
    "import submissionService from '../services/submissionService';",
    "import submissionService from '../services/submissionService';\nimport settingsService from '../services/settingsService';"
  );
}

if (!content.includes('uploadEnabled')) {
  content = content.replace(
    "const [message, setMessage] = useState('');",
    "const [message, setMessage] = useState('');\n  const [uploadEnabled, setUploadEnabled] = useState(false);"
  );

  content = content.replace(
    "submissionService.getMySubmission(user.token)",
    "submissionService.getMySubmission(user.token),\n          settingsService.getSettings(user.token)"
  );
  
  content = content.replace(
    "const [submissionData] = await Promise.all([",
    "const [submissionData, settingsData] = await Promise.all(["
  );

  content = content.replace(
    "setSubmission(submissionData);",
    "setSubmission(submissionData);\n        if (settingsData) setUploadEnabled(settingsData.uploadEnabled);"
  );

  const newUploadBlock = `
        <div className="card">
          <h3>Your Submission</h3>
          <p>Upload your best photo for your selected theme. You can only submit <strong>ONE</strong> image.</p>
          
          {uploadEnabled ? (
            <ImageUpload 
              onFileSelect={(file) => setFile(file)} 
              preview={preview}
              setPreview={setPreview}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px dashed #ccc', marginTop: '20px' }}>
              <h4 style={{ color: '#666', margin: 0, fontWeight: 500 }}>Uploading time will open soon stay tuned ..</h4>
            </div>
          )}

          {file && uploadEnabled && (`;

  const oldUploadBlock = `
        <div className="card">
          <h3>Your Submission</h3>
          <p>Upload your best photo for your selected theme. You can only submit <strong>ONE</strong> image.</p>
          
          <ImageUpload 
            onFileSelect={(file) => setFile(file)} 
            preview={preview}
            setPreview={setPreview}
          />

          {file && (`;

  content = content.replace(oldUploadBlock, newUploadBlock);
}

fs.writeFileSync('client/src/pages/ParticipantDashboard.jsx', content);
console.log('ParticipantDashboard updated');
