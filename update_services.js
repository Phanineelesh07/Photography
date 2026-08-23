const fs = require('fs');

// 1. adminService.js
let adminService = fs.readFileSync('client/src/services/adminService.js', 'utf8');
if (!adminService.includes('approveUser')) {
  adminService = adminService.replace(
    "const adminService = {",
    "const approveUser = async (id) => {\n  return await fetchWithAuth(`/admin/users/${id}/approve`, {\n    method: 'PUT',\n  });\n};\n\nconst adminService = {"
  );
  adminService = adminService.replace(
    "deleteUser,",
    "deleteUser,\n  approveUser,"
  );
  fs.writeFileSync('client/src/services/adminService.js', adminService);
  console.log('adminService.js updated');
}

// 2. settingsService.js
let settingsService = fs.readFileSync('client/src/services/settingsService.js', 'utf8');
if (!settingsService.includes('uploadQr')) {
  settingsService = settingsService.replace(
    "const settingsService = {",
    "const uploadQr = async (formData) => {\n  return await fetchWithAuth('/settings/qr', {\n    method: 'PUT',\n    body: formData\n  });\n};\n\nconst settingsService = {"
  );
  settingsService = settingsService.replace(
    "toggleUpload",
    "toggleUpload,\n  uploadQr"
  );
  fs.writeFileSync('client/src/services/settingsService.js', settingsService);
  console.log('settingsService.js updated');
}
