const fs = require('fs');

const content = fs.readFileSync('client/src/pages/Home.jsx', 'utf8');

// Find the boundaries of the sections
const aboutEnd = content.indexOf('      </section>', content.indexOf('<section className="about-section container"')) + 16;
const clubStart = content.indexOf('      {/* Club Information Section */}');
const clubEnd = content.indexOf('      </section>', content.indexOf('<section className="club-section container"')) + 16;
const ctaStart = content.indexOf('      {/* Call To Action Section */}');
const ctaEnd = content.indexOf('      </section>', content.indexOf('<section className="cta-section"')) + 16;

// Extract the chunks
const beforeClub = content.substring(0, clubStart);
const clubBlock = content.substring(clubStart, clubEnd);
const betweenClubAndCta = content.substring(clubEnd, ctaStart);
const ctaBlock = content.substring(ctaStart, ctaEnd);
const afterCta = content.substring(ctaEnd);

// Rearrange: beforeClub -> ctaBlock -> betweenClubAndCta -> clubBlock -> afterCta
// Wait, betweenClubAndCta might just be whitespace. Let's just do:
// newContent = beforeClub + ctaBlock + '\n\n' + clubBlock + afterCta

const newContent = content.substring(0, clubStart) + ctaBlock + '\n\n' + clubBlock + content.substring(ctaEnd);

fs.writeFileSync('client/src/pages/Home.jsx', newContent, 'utf8');
console.log('Reordered successfully.');
