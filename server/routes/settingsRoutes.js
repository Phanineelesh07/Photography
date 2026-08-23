const express = require('express');
const router = express.Router();
const { getSettings, toggleUpload, uploadPaymentQr, deletePaymentQr } = require('../controllers/settingsController');
const multer = require('multer');
const path = require('path');

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'photography_qr',
    allowed_formats: ['jpg', 'jpeg', 'png']
  },
});

const upload = multer({
  storage
});

const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getSettings);
router.put('/upload', protect, admin, toggleUpload);
router.put('/qr', protect, admin, upload.single('qr'), uploadPaymentQr);
router.delete('/qr', protect, admin, deletePaymentQr);

module.exports = router;
