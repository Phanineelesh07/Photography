const fs = require('fs');
let c = fs.readFileSync('client/src/pages/AdminDashboard.jsx', 'utf8');
c = c.replace("import settingsService from '../services/settingsService';", "");
fs.writeFileSync('client/src/pages/AdminDashboard.jsx', c);
