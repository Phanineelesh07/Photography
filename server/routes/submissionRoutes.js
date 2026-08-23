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
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Routes
router.post('/', protect, upload.single('image'), uploadSubmission);
router.get('/me', protect, getMySubmission);
router.get('/theme/:theme', protect, getSubmissionsByTheme);
router.post('/:id/vote', protect, voteSubmission);
router.get('/leaderboard', protect, admin, getLeaderboard);
router.delete('/:id', protect, admin, deleteSubmission);

module.exports = router;
