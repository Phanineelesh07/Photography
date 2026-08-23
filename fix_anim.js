const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Home.jsx', 'utf8');

// Poster
content = content.replace(
  /initial=\{\{ opacity: 0, scale: 0.95 \}\}\s*whileInView=\{\{ opacity: 1, scale: 1 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.6 \}\}/g,
  'variants={scaleUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}'
);

// Leadership section to staggerContainer
content = content.replace(
  /<div className="leadership-section" style=\{\{ display: 'flex', flexDirection: 'column', gap: '20px' \}\}>/g,
  '<motion.div className="leadership-section" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>'
);

// End of leadership section
content = content.replace(
  /<\/div>\s*<\/div>\s*<\/motion.div>\s*<\/section>\s*<\/div>/g,
  '</motion.div>\n          </div>\n\n        </motion.div>\n      </section>\n    </div>'
);

// Leader Cards
content = content.replace(
  /initial=\{\{ opacity: 0, x: 30 \}\}\s*whileInView=\{\{ opacity: 1, x: 0 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.4, delay: 0.[123] \}\}/g,
  'variants={fadeInUp}'
);

fs.writeFileSync('client/src/pages/Home.jsx', content, 'utf8');
console.log('Fixed missed animations');
