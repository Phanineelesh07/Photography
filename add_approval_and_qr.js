const fs = require('fs');

// 1. Update User.js model
let userContent = fs.readFileSync('server/models/User.js', 'utf8');
if (!userContent.includes('isApproved:')) {
  userContent = userContent.replace(
    "votedThemes: {\n    type: [String],\n    default: []\n  }",
    "votedThemes: {\n    type: [String],\n    default: []\n  },\n  isApproved: {\n    type: Boolean,\n    default: false\n  }"
  );
  fs.writeFileSync('server/models/User.js', userContent);
  console.log('User.js updated');
}

// 2. Update Settings.js model
let settingsContent = fs.readFileSync('server/models/Settings.js', 'utf8');
if (!settingsContent.includes('paymentQrUrl:')) {
  settingsContent = settingsContent.replace(
    "uploadEnabled: {\n    type: Boolean,\n    default: false\n  }",
    "uploadEnabled: {\n    type: Boolean,\n    default: false\n  },\n  paymentQrUrl: {\n    type: String,\n    default: ''\n  }"
  );
  fs.writeFileSync('server/models/Settings.js', settingsContent);
  console.log('Settings.js updated');
}
