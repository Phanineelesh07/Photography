const Submission = require('../models/Submission');
const User = require('../models/User');

// @desc    Upload a submission
// @route   POST /api/submissions
// @access  Private/Participant
const uploadSubmission = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const user = await User.findById(req.user._id);

    if (user.role !== 'participant') {
      return res.status(403).json({ message: 'Only participants can upload submissions' });
    }

    // Check if they already submitted
    const existingSubmission = await Submission.findOne({ participant: req.user._id });
    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted an image.' });
    }

    // Check if the theme has reached the maximum of 25 images
    const themeCount = await Submission.countDocuments({ theme: user.selectedTheme });
    if (themeCount >= 25) {
      return res.status(400).json({ message: `The theme "${user.selectedTheme}" has already reached its maximum limit of 25 submissions.` });
    }

    // With Cloudinary, the full URL is automatically provided in req.file.path
    const imageUrl = req.file.path;

    const submission = await Submission.create({
      participant: req.user._id,
      theme: user.selectedTheme,
      imageUrl
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get submissions by theme (anonymous)
// @route   GET /api/submissions/theme/:theme
// @access  Private/Viewer
const getSubmissionsByTheme = async (req, res) => {
  try {
    // Return all submissions for the requested theme, omitting the participant info to keep it anonymous
    const submissions = await Submission.find({ theme: req.params.theme }).select('-participant');
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Vote for a submission
// @route   POST /api/submissions/:id/vote
// @access  Private/Viewer
const voteSubmission = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role !== 'viewer') {
      return res.status(403).json({ message: 'Only viewers can vote.' });
    }

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Ensure votedThemes is an array (for backwards compatibility if user was created before this field existed)
    if (!user.votedThemes) {
      user.votedThemes = [];
    }

    // Check if viewer has already voted for this theme
    if (user.votedThemes.includes(submission.theme)) {
      return res.status(400).json({ message: 'You have already voted in this theme category.' });
    }

    // Add theme to user's votedThemes and save
    user.votedThemes.push(submission.theme);
    await user.save();

    // Increment submission votes
    submission.votes += 1;
    await submission.save();

    res.status(200).json({ message: 'Vote successfully recorded', votes: submission.votes, votedThemes: user.votedThemes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get leaderboard (submissions populated with participant details)
// @route   GET /api/submissions/leaderboard
// @access  Private/Admin
const getLeaderboard = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('participant', 'name rollNumber course branch year email phone')
      .sort({ votes: -1 });
    
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get current user's submission
// @route   GET /api/submissions/me
// @access  Private/Participant
const getMySubmission = async (req, res) => {
  try {
    const submission = await Submission.findOne({ participant: req.user._id });
    res.status(200).json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Delete a submission
// @route   DELETE /api/submissions/:id
// @access  Private/Admin
const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Optional: Delete from disk (ignoring for now to prevent accidental wipe)
    await submission.deleteOne();
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error deleting submission' });
  }
};

module.exports = {
  deleteSubmission,
  uploadSubmission,
  getSubmissionsByTheme,
  voteSubmission,
  getLeaderboard,
  getMySubmission
};
