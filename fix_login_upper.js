const fs = require('fs');

let log = fs.readFileSync('client/src/pages/Login.jsx', 'utf8');

const target = `  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };`;

const replacement = `  const handleChange = (e) => {
    let val = e.target.value;
    if (e.target.name === 'identifier' && loginType === 'participant') {
      val = val.toUpperCase();
    }
    setFormData({
      ...formData,
      [e.target.name]: val
    });
  };`;

log = log.replace(target, replacement);

fs.writeFileSync('client/src/pages/Login.jsx', log);
