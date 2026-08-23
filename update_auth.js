const fs = require('fs');

let content = fs.readFileSync('server/controllers/authController.js', 'utf8');

// 1. Update registerUser
content = content.replace(
  "role\n    });",
  "role,\n      isApproved: role !== 'participant'\n    });"
);

content = content.replace(
  "token: generateToken(user._id)\n      });\n    } else {",
  "token: user.isApproved ? generateToken(user._id) : undefined,\n        pendingApproval: !user.isApproved\n      });\n    } else {"
);

// 2. Update loginUser
const oldLoginCheck = `if (user && (await user.matchPassword(password))) {
      res.json({`;
      
const newLoginCheck = `if (user && (await user.matchPassword(password))) {
      if (!user.isApproved) {
        return res.status(401).json({ message: 'Your account is pending admin approval.' });
      }
      res.json({`;

if (content.includes(oldLoginCheck)) {
  content = content.replace(oldLoginCheck, newLoginCheck);
}

fs.writeFileSync('server/controllers/authController.js', content);
console.log('authController.js updated');
