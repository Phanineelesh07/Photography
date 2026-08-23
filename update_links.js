const fs = require('fs');
let content = fs.readFileSync('client/src/components/Footer.jsx', 'utf8');

// Update footer wrapper to have id
content = content.replace(
  /<footer className="au-footer">/,
  '<footer id="footer" className="au-footer">'
);

// Event Links
content = content.replace(
  /<li><Link to="\/about">About Event<\/Link><\/li>/,
  '<li><a href="/#about">About Event</a></li>'
);
content = content.replace(
  /<li><Link to="\/themes">Themes<\/Link><\/li>/,
  '<li><a href="/#about">Themes</a></li>'
);
content = content.replace(
  /<li><Link to="\/guidelines">Guidelines<\/Link><\/li>/,
  '<li><a href="/#about">Guidelines</a></li>'
);
content = content.replace(
  /<li><Link to="\/contact">Contact Us<\/Link><\/li>/,
  '<li><a href="#footer">Contact Us</a></li>'
);

// Club Info
content = content.replace(
  /<li><Link to="\/club">Film & Photography Club<\/Link><\/li>/,
  '<li><a href="/#club">Film & Photography Club</a></li>'
);
content = content.replace(
  /<li><Link to="\/workshops">Workshops<\/Link><\/li>/,
  '<li><a href="/#club">Workshops</a></li>'
);
content = content.replace(
  /<li><Link to="\/gallery">Gallery<\/Link><\/li>/,
  '<li><a href="/#club">Gallery</a></li>'
);
content = content.replace(
  /<li><Link to="\/achievements">Achievements<\/Link><\/li>/,
  '<li><a href="/#club">Achievements</a></li>'
);
content = content.replace(
  /<li><Link to="\/team">Our Team<\/Link><\/li>/,
  '<li><a href="/#team">Our Team</a></li>'
);

fs.writeFileSync('client/src/components/Footer.jsx', content, 'utf8');
console.log('Footer links updated');
