const fs = require('fs');

// Register.jsx uppercase fix
let reg = fs.readFileSync('client/src/pages/Register.jsx', 'utf8');
reg = reg.replace(
  'setFormData({ ...formData, [e.target.name]: e.target.value });',
  'let val = e.target.value;\n    if(e.target.name === "rollNumber") val = val.toUpperCase();\n    setFormData({ ...formData, [e.target.name]: val });'
);
fs.writeFileSync('client/src/pages/Register.jsx', reg);

// Login.jsx uppercase fix
let log = fs.readFileSync('client/src/pages/Login.jsx', 'utf8');
log = log.replace(
  'setIdentifier(e.target.value)',
  'setIdentifier(e.target.value.toUpperCase())'
);
fs.writeFileSync('client/src/pages/Login.jsx', log);

console.log('Roll number uppercase fixed.');
