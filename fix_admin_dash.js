const fs = require('fs');
let content = fs.readFileSync('client/src/pages/AdminDashboard.jsx', 'utf8');

if (!content.includes('settingsService')) {
  content = content.replace(
    "import { getLeaderboard } from '../services/submissionService';",
    "import { getLeaderboard } from '../services/submissionService';\nimport settingsService from '../services/settingsService';\nimport { AuthContext } from '../context/AuthContext';\nimport { useContext } from 'react';"
  );
}

if (!content.includes('uploadEnabled')) {
  content = content.replace(
    "const [activeTab, setActiveTab] = useState('participant');",
    "const [activeTab, setActiveTab] = useState('participant');\n  const [uploadEnabled, setUploadEnabled] = useState(false);\n  const { user } = useContext(AuthContext);"
  );

  content = content.replace(
    "adminService.getAllParticipants(),",
    "adminService.getAllParticipants(),\n          settingsService.getSettings(user.token),"
  );
  
  content = content.replace(
    "const [participantsData, leaderboardData] = await Promise.all([",
    "const [participantsData, settingsData, leaderboardData] = await Promise.all(["
  );

  content = content.replace(
    "setLeaderboard(leaderboardData);",
    "setLeaderboard(leaderboardData);\n        setUploadEnabled(settingsData.uploadEnabled);"
  );

  const toggleFunc = `
  const handleToggleUpload = async () => {
    try {
      const newSettings = await settingsService.toggleUpload(user.token);
      setUploadEnabled(newSettings.uploadEnabled);
    } catch (err) {
      alert('Failed to toggle upload: ' + err.message);
    }
  };
`;
  content = content.replace(
    "const handleDelete = async",
    toggleFunc + "\n  const handleDelete = async"
  );
  
  const toggleBtnUI = `
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
          <div>
            <h3 style={{ margin: 0, color: '#333' }}>Image Uploads</h3>
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9rem' }}>
              Current Status: <strong style={{ color: uploadEnabled ? '#28a745' : '#dc3545' }}>{uploadEnabled ? 'ON (Open for all)' : 'OFF (Closed)'}</strong>
            </p>
          </div>
          <button 
            onClick={handleToggleUpload}
            style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: 'white', backgroundColor: uploadEnabled ? '#dc3545' : '#28a745', transition: 'background-color 0.3s' }}
          >
            {uploadEnabled ? 'Turn OFF Uploads' : 'Turn ON Uploads'}
          </button>
        </div>
        
        <div className="admin-tabs">`;
        
  content = content.replace('<div className="admin-tabs">', toggleBtnUI);
}

fs.writeFileSync('client/src/pages/AdminDashboard.jsx', content);
console.log('AdminDashboard updated');
