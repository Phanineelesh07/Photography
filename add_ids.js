const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Home.jsx', 'utf8');

content = content.replace(
  /<section className="about-section container">/g,
  '<section id="about" className="about-section container">'
);

content = content.replace(
  /<section className="club-section container" style=\{\{ marginTop: '40px', marginBottom: '80px' \}\}>/g,
  '<section id="club" className="club-section container" style={{ marginTop: "40px", marginBottom: "80px" }}>'
);

content = content.replace(
  /<section className="club-section container" style=\{\{ marginBottom: '80px' \}\}>/g,
  '<section id="team" className="club-section container" style={{ marginBottom: "80px" }}>'
);

fs.writeFileSync('client/src/pages/Home.jsx', content, 'utf8');
console.log('Home sections updated with IDs.');
