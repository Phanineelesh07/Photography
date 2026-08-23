const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  uploadSubmission,
  getSubmissionsByTheme,
  voteSubmission,
  getLeaderboard,
  getMySubmission,
  deleteSubmission
} = require('../controllers/submissionController');

// Multer Config
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
    folder: 'photography_submissions',
    allowed_formats: ['jpg', 'jpeg', 'png']
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
});

// Routes
router.post('/', protect, upload.single('image'), uploadSubmission);
router.get('/me', protect, getMySubmission);
router.get('/theme/:theme', protect, getSubmissionsByTheme);
router.post('/:id/vote', protect, voteSubmission);
router.get('/leaderboard', protect, admin, getLeaderboard);
router.delete('/:id', protect, admin, deleteSubmission);

module.exports = router;
