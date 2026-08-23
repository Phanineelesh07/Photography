const fs = require('fs');

// 1. Update settingsController.js
let controller = fs.readFileSync('server/controllers/settingsController.js', 'utf8');

const deleteQrCode = `
// @desc    Delete Payment QR Code
// @route   DELETE /api/settings/qr
// @access  Private/Admin
const deletePaymentQr = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    settings.paymentQrUrl = '';
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
`;

if (!controller.includes('deletePaymentQr')) {
  controller = controller.replace(
    "module.exports = {\n  getSettings,\n  toggleUpload,\n  uploadPaymentQr\n};",
    deleteQrCode + "\nmodule.exports = {\n  getSettings,\n  toggleUpload,\n  uploadPaymentQr,\n  deletePaymentQr\n};"
  );
  fs.writeFileSync('server/controllers/settingsController.js', controller);
  console.log('settingsController.js updated');
}

// 2. Update settingsRoutes.js
let routes = fs.readFileSync('server/routes/settingsRoutes.js', 'utf8');
if (!routes.includes('deletePaymentQr')) {
  routes = routes.replace(
    "uploadPaymentQr } = require('../controllers/settingsController');",
    "uploadPaymentQr, deletePaymentQr } = require('../controllers/settingsController');"
  );
  
  routes = routes.replace(
    "router.put('/qr', protect, admin, upload.single('qr'), uploadPaymentQr);",
    "router.put('/qr', protect, admin, upload.single('qr'), uploadPaymentQr);\nrouter.delete('/qr', protect, admin, deletePaymentQr);"
  );
  fs.writeFileSync('server/routes/settingsRoutes.js', routes);
  console.log('settingsRoutes.js updated');
}
