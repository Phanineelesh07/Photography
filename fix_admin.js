const fs = require('fs');
let content = fs.readFileSync('client/src/pages/AdminDashboard.jsx', 'utf8');
content = content.replace("import settingsService from '../services/settingsService';\nimport settingsService from '../services/settingsService';", "import settingsService from '../services/settingsService';");
fs.writeFileSync('client/src/pages/AdminDashboard.jsx', content);
