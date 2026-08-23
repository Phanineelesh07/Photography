const fs = require('fs');

let c = fs.readFileSync('client/src/pages/Dashboard.jsx', 'utf8');

const target = 'const { participant, eventUpdates } = data;';
const safeReplace = `
    if (!data || !data.participant) {
      return (
        <div className="dashboard-error container" style={{ paddingTop: '120px' }}>
          <h2>Error Loading Dashboard Data</h2>
          <p>We could not find your participant data.</p>
        </div>
      );
    }
    const { participant, eventUpdates } = data;
`;

if (!c.includes('We could not find your participant data.')) {
  c = c.replace(target, safeReplace);
  fs.writeFileSync('client/src/pages/Dashboard.jsx', c);
  console.log('Dashboard protected.');
}
