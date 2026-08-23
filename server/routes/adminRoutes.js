const express = require('express');
const router = express.Router();
const { getAllParticipants, deleteUser, updateUser, approveUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/participants', protect, admin, getAllParticipants);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id', protect, admin, updateUser);
router.put('/users/:id/approve', protect, admin, approveUser);

module.exports = router;
