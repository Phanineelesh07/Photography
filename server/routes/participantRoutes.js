const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/participantController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboard);

module.exports = router;
