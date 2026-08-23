const fs = require('fs');

const getBaseUrl = "const getBaseUrl = () => { const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; return apiUrl.replace('/api', ''); };";

// 1. AdminDashboard.jsx
let admin = fs.readFileSync('client/src/pages/AdminDashboard.jsx', 'utf8');
if (!admin.includes('getBaseUrl')) {
  admin = admin.replace(
    "const [qrUploading, setQrUploading] = useState(false);",
    "const [qrUploading, setQrUploading] = useState(false);\n  " + getBaseUrl
  );
  admin = admin.replace(
    "src={paymentQrUrl}",
    "src={paymentQrUrl.startsWith('http') ? paymentQrUrl : getBaseUrl() + paymentQrUrl}"
  );
  fs.writeFileSync('client/src/pages/AdminDashboard.jsx', admin);
  console.log('AdminDashboard fixed');
}

// 2. Register.jsx
let register = fs.readFileSync('client/src/pages/Register.jsx', 'utf8');
if (!register.includes('getBaseUrl')) {
  register = register.replace(
    "const [submitted, setSubmitted] = useState(false);",
    "const [submitted, setSubmitted] = useState(false);\n  " + getBaseUrl
  );
  register = register.replace(
    "src={paymentQrUrl}",
    "src={paymentQrUrl.startsWith('http') ? paymentQrUrl : getBaseUrl() + paymentQrUrl}"
  );
  fs.writeFileSync('client/src/pages/Register.jsx', register);
  console.log('Register fixed');
}
