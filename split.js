const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Home.jsx', 'utf8');

// The file currently has:
// 1. Hero
// 2. About
// 3. CTA
// 4. Club

const ctaStartStr = '      {/* Call To Action Section */}';
const ctaStart = content.indexOf(ctaStartStr);
const ctaEnd = content.indexOf('      </section>', ctaStart) + 16;
const ctaBlock = content.substring(ctaStart, ctaEnd);

// Remove CTA from its current location
content = content.substring(0, ctaStart) + content.substring(ctaEnd);

// Now find the hr inside the Club card
const hrStr = '          <hr style={{ border: \'none\', borderTop: \'1px dashed var(--color-border)\' }} />';
const hrIndex = content.indexOf(hrStr);

const splitBefore = content.substring(0, hrIndex);
const splitAfter = content.substring(hrIndex + hrStr.length);

// We need to close the first club-card and club-section, insert CTA, and then open a new club-section and club-card
const endFirstClub = '\n        </motion.div>\n      </section>\n\n';
const startSecondClub = '      <section className="club-section container" style={{ marginBottom: \'80px\' }}>\n        <motion.div\n          className="club-card"\n          initial={{ opacity: 0, y: 40 }}\n          whileInView={{ opacity: 1, y: 0 }}\n          viewport={{ once: true }}\n          transition={{ duration: 0.8 }}\n          style={{ \n            background: \'var(--color-surface)\', \n            borderRadius: \'16px\', \n            padding: \'40px\', \n            boxShadow: \'0 15px 40px rgba(0,0,0,0.08)\',\n            display: \'flex\',\n            flexDirection: \'column\',\n            gap: \'40px\'\n          }}\n        >\n';

const finalContent = splitBefore + endFirstClub + ctaBlock + '\n\n' + startSecondClub + splitAfter;

fs.writeFileSync('client/src/pages/Home.jsx', finalContent, 'utf8');
console.log('Split and reordered successfully.');
