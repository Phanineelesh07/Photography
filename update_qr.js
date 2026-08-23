const fs = require('fs');

let controller = fs.readFileSync('server/controllers/settingsController.js', 'utf8');

const uploadQrCode = `
// @desc    Upload Payment QR Code
// @route   PUT /api/settings/qr
// @access  Private/Admin
const uploadPaymentQr = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    if (req.file) {
      settings.paymentQrUrl = '/uploads/' + req.file.filename;
      await settings.save();
      res.json(settings);
    } else {
      res.status(400).json({ message: 'No file uploaded' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
`;

if (!controller.includes('uploadPaymentQr')) {
  controller = controller.replace(
    "module.exports = {\n  getSettings,\n  toggleUpload\n};",
    uploadQrCode + "\nmodule.exports = {\n  getSettings,\n  toggleUpload,\n  uploadPaymentQr\n};"
  );
  fs.writeFileSync('server/controllers/settingsController.js', controller);
  console.log('settingsController.js updated');
}

let routes = fs.readFileSync('server/routes/settingsRoutes.js', 'utf8');
if (!routes.includes('uploadPaymentQr')) {
  routes = routes.replace(
    "const { getSettings, toggleUpload } = require('../controllers/settingsController');",
    "const { getSettings, toggleUpload, uploadPaymentQr } = require('../controllers/settingsController');\nconst multer = require('multer');\nconst path = require('path');\n\nconst storage = multer.diskStorage({\n  destination(req, file, cb) {\n    cb(null, 'uploads/');\n  },\n  filename(req, file, cb) {\n    cb(null, 'qr-' + Date.now() + path.extname(file.originalname));\n  },\n});\nconst upload = multer({ storage });\n"
  );
  
  routes = routes.replace(
    "router.put('/upload', protect, admin, toggleUpload);",
    "router.put('/upload', protect, admin, toggleUpload);\nrouter.put('/qr', protect, admin, upload.single('qr'), uploadPaymentQr);"
  );
  fs.writeFileSync('server/routes/settingsRoutes.js', routes);
  console.log('settingsRoutes.js updated');
}
