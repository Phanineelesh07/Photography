const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { registerUser, loginUser, getMe, sendOtp } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/send-otp', [
  check('email', 'Please include a valid email').isEmail()
], sendOtp);

router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('rollNumber').optional(),
  check('phone', 'Phone number is required').not().isEmpty(),
  check('course').optional(),
  check('branch').optional(),
  check('year').optional(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('selectedTheme').optional()
], registerUser);

router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
