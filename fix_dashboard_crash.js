const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Dashboard.jsx', 'utf8');

// 1. Add uploadEnabled state
if (!content.includes('const [uploadEnabled, setUploadEnabled] = useState(false);')) {
  content = content.replace(
    'const [uploadSuccess, setUploadSuccess] = useState(false);',
    'const [uploadSuccess, setUploadSuccess] = useState(false);\n  const [uploadEnabled, setUploadEnabled] = useState(false);'
  );
}

// 2. Import settingsService
if (!content.includes('settingsService')) {
  content = content.replace(
    "import { getDashboardData } from '../services/participantService';",
    "import { getDashboardData } from '../services/participantService';\nimport settingsService from '../services/settingsService';"
  );
}

// 3. Fetch settings data
const oldFetch = `        if (user.role === 'participant') {
          try {
            const sub = await getMySubmission();
            setMySubmission(sub);
          } catch (e) {
            console.log("No submission yet");
          }
        }`;

const newFetch = `        if (user.role === 'participant') {
          try {
            const [sub, settings] = await Promise.all([
              getMySubmission().catch(() => null),
              settingsService.getSettings()
            ]);
            if (sub) setMySubmission(sub);
            if (settings) setUploadEnabled(settings.uploadEnabled);
          } catch (e) {
            console.log("Error loading participant data", e);
          }
        }`;

if (content.includes(oldFetch)) {
  content = content.replace(oldFetch, newFetch);
} else {
    console.log("Couldn't find oldFetch block!");
}

fs.writeFileSync('client/src/pages/Dashboard.jsx', content);
console.log('Dashboard fixed');
