const fs = require('fs');
let c = fs.readFileSync('server/server.js', 'utf8');

c = c.replace(
  'app.use(helmet({\n  crossOriginResourcePolicy: { policy: "cross-origin" } // allows loading images from different origins if needed\n}));',
  'app.use(helmet({\n  contentSecurityPolicy: false,\n  crossOriginEmbedderPolicy: false,\n  crossOriginResourcePolicy: { policy: "cross-origin" }\n}));'
);

fs.writeFileSync('server/server.js', c);
console.log('helmet configured');
