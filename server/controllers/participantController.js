const User = require('../models/User');

// @desc    Get participant dashboard data
// @route   GET /api/participant/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    // The user is already attached to req.user by the protect middleware
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    res.status(200).json({
      participant: user,
      eventUpdates: [
        { id: 1, title: 'Welcome to the Event', date: new Date().toISOString(), content: 'More event information will be updated soon.' }
      ]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDashboard
};
