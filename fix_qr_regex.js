const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Register.jsx', 'utf8');

c = c.replace(/maxWidth:\s*'200px'/g, "width: '100%', maxWidth: '350px'");

const targetStr = "<p style={{ fontSize: '0.85rem', color: '#ff9800' }}>Note: After payment, submit the application";
const replaceStr = "<h4 style={{ color: '#2ecc71', fontSize: '1.3rem', margin: '15px 0' }}>Registration Fee: Rs 49 Only</h4>\n              " + targetStr;

if (!c.includes("Registration Fee: Rs 49 Only")) {
  c = c.replace(targetStr, replaceStr);
}

fs.writeFileSync('client/src/pages/Register.jsx', c);
console.log("Updated Register.jsx");
