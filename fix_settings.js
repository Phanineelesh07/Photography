const fs = require('fs');
let routes = fs.readFileSync('server/routes/settingsRoutes.js', 'utf8');
routes = routes.replace(
  "router.get('/', protect, getSettings);",
  "router.get('/', getSettings);"
);
fs.writeFileSync('server/routes/settingsRoutes.js', routes);
console.log('Made GET /settings public');
