const fs = require('fs');
let content = fs.readFileSync('client/src/pages/AdminDashboard.jsx', 'utf8');

content = content.replace(
  "background: '#f8f9fa', borderRadius: '8px', marginBottom: '30px'",
  "background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.1)'"
);

fs.writeFileSync('client/src/pages/AdminDashboard.jsx', content);
console.log('Fixed styling of QR section');
