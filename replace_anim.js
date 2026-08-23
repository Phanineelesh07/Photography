const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Home.jsx', 'utf8');

// Replace Hero Content Animation
content = content.replace(
  /initial=\{\{ opacity: 0, y: 30 \}\}\s*animate=\{\{ opacity: 1, y: 0 \}\}\s*transition=\{\{ duration: 0.8, delay: 0.2 \}\}/g,
  'variants={fadeInUp} initial="hidden" animate="visible"'
);

// Replace About Image (Left)
content = content.replace(
  /initial=\{\{ opacity: 0, x: -30 \}\}\s*whileInView=\{\{ opacity: 1, x: 0 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.6 \}\}/g,
  'variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}'
);

// Replace About Text (Right)
content = content.replace(
  /initial=\{\{ opacity: 0, x: 30 \}\}\s*whileInView=\{\{ opacity: 1, x: 0 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.6, delay: 0.2 \}\}/g,
  'variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}'
);

// Replace Club Card (first club-card)
content = content.replace(
  /initial=\{\{ opacity: 0, y: 40 \}\}\s*whileInView=\{\{ opacity: 1, y: 0 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.8 \}\}/g,
  'variants={scaleUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}'
);

// Replace the other Club Card
content = content.replace(
  /className="club-card"\s*initial=\{\{ opacity: 0, y: 40 \}\}\s*whileInView=\{\{ opacity: 1, y: 0 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.8 \}\}/g,
  'className="club-card" variants={scaleUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}'
);

// Replace Poster Image
content = content.replace(
  /initial=\{\{ opacity: 0, scale: 0.95 \}\}\s*whileInView=\{\{ opacity: 1, scale: 1 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.8 \}\}/g,
  'variants={scaleUp} initial="hidden" whileInView="visible" viewport={{ once: true }}'
);

// Replace Leadership individual cards
content = content.replace(
  /initial=\{\{ opacity: 0, x: 30 \}\}\s*whileInView=\{\{ opacity: 1, x: 0 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.6, delay: [0-9.]+ \}\}/g,
  'variants={fadeInUp}'
);

// Replace CTA text animation
content = content.replace(
  /initial=\{\{ opacity: 0, y: 30 \}\}\s*whileInView=\{\{ opacity: 1, y: 0 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.8 \}\}/g,
  'variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}'
);

fs.writeFileSync('client/src/pages/Home.jsx', content, 'utf8');
console.log('Regex replacements completed.');
