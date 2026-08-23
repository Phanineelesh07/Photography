const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Home.jsx', 'utf8');

// Modern variants
const modernVariants = 
  const fadeInUp = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 80, damping: 20 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      scale: 1, 
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 100, damping: 25 }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      x: 0, 
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 70, damping: 20 }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      x: 0, 
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 70, damping: 20 }
    }
  };
;

// Insert variants before return
content = content.replace('return (', modernVariants + '\n  return (');

// Now, we need to carefully replace the inline animations with the variants
// 1. Hero Content
content = content.replace(
  /initial=\{\{ opacity: 0, y: 30 \}\}\s*animate=\{\{ opacity: 1, y: 0 \}\}\s*transition=\{\{ duration: 0.8, delay: 0.2 \}\}/g,
  "variants={fadeInUp} initial=\"hidden\" animate=\"visible\""
);

// 2. About Section Left
content = content.replace(
  /initial=\{\{ opacity: 0, x: -30 \}\}\s*whileInView=\{\{ opacity: 1, x: 0 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.6 \}\}/g,
  "variants={slideInLeft} initial=\"hidden\" whileInView=\"visible\" viewport={{ once: true, margin: '-100px' }}"
);

// 3. About Section Right
content = content.replace(
  /initial=\{\{ opacity: 0, x: 30 \}\}\s*whileInView=\{\{ opacity: 1, x: 0 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.6, delay: 0.2 \}\}/g,
  "variants={slideInRight} initial=\"hidden\" whileInView=\"visible\" viewport={{ once: true, margin: '-100px' }}"
);

// 4. Club Card Top
content = content.replace(
  /initial=\{\{ opacity: 0, y: 40 \}\}\s*whileInView=\{\{ opacity: 1, y: 0 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.8 \}\}/g,
  "variants={scaleUp} initial=\"hidden\" whileInView=\"visible\" viewport={{ once: true, margin: '-50px' }}"
);

// 5. Club Poster
content = content.replace(
  /initial=\{\{ opacity: 0, scale: 0.95 \}\}\s*whileInView=\{\{ opacity: 1, scale: 1 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.8 \}\}/g,
  "variants={scaleUp} initial=\"hidden\" whileInView=\"visible\" viewport={{ once: true }}"
);

// 6. Leadership Cards (need staggering)
// Instead of replacing blindly, let's just replace the leader card animations
content = content.replace(
  /initial=\{\{ opacity: 0, x: 30 \}\}\s*whileInView=\{\{ opacity: 1, x: 0 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.6, delay: 0.2 \}\}/g,
  "variants={fadeInUp}"
);
content = content.replace(
  /initial=\{\{ opacity: 0, x: 30 \}\}\s*whileInView=\{\{ opacity: 1, x: 0 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.6, delay: 0.4 \}\}/g,
  "variants={fadeInUp}"
);
content = content.replace(
  /initial=\{\{ opacity: 0, x: 30 \}\}\s*whileInView=\{\{ opacity: 1, x: 0 \}\}\s*viewport=\{\{ once: true \}\}\s*transition=\{\{ duration: 0.6, delay: 0.6 \}\}/g,
  "variants={fadeInUp}"
);

// Add stagger container to the leaders div
content = content.replace(
  /<div className="leaders" style=\{\{ display: 'flex', flexDirection: 'column', gap: '30px' \}\}>/,
  "<motion.div className=\"leaders\" variants={staggerContainer} initial=\"hidden\" whileInView=\"visible\" viewport={{ once: true, margin: '-50px' }} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>"
);
content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*<\/motion\.div>\s*<\/section>\s*\{\/\* Footer \*\/\}/g,
  "</motion.div>\n            </div>\n\n          </div>\n        </motion.div>\n      </section>\n\n      {/* Footer */}"
);


fs.writeFileSync('client/src/pages/Home.jsx', content, 'utf8');
console.log('Animations upgraded');
