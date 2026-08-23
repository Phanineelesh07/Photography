const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Home.jsx', 'utf8');

// Fix About Section Left
content = content.replace(
  /initial=\{\{ opacity: 0, x: -30 \}\}\s*whileInView=\{\{ opacity: 1, x: 0 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.8 \}\}/g,
  'variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}'
);

// Fix About Section Right
content = content.replace(
  /initial=\{\{ opacity: 0, x: 30 \}\}\s*whileInView=\{\{ opacity: 1, x: 0 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.8 \}\}/g,
  'variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}'
);

// Fix CTA Section
content = content.replace(
  /initial=\{\{ opacity: 0, y: 30 \}\}\s*whileInView=\{\{ opacity: 1, y: 0 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.6 \}\}/g,
  'variants={scaleUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}'
);

fs.writeFileSync('client/src/pages/Home.jsx', content, 'utf8');
console.log('Fixed About and CTA');
