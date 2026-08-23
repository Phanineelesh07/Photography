const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, rollNumber, phone, course, branch, year, email, password, selectedTheme, userType } = req.body;

  try {
    // Check if user exists by email or rollNumber
    const query = [{ email }];
    if (rollNumber) query.push({ rollNumber });
    const userExists = await User.findOne({ $or: query });

    if (userExists) {
      return res.status(409).json({ message: 'You are already registered for this event.' });
    }

    // Assign role
    let role = userType === 'viewer' ? 'viewer' : 'participant';
    if (email.toLowerCase() === 'admin@inspire.com') role = 'admin';

    // Create user
    const user = await User.create({
      name,
      rollNumber: role === 'participant' ? rollNumber : undefined,
      phone,
      course: role === 'participant' ? course : undefined,
      branch: role === 'participant' && course === 'B.Tech' ? branch : (role === 'participant' ? 'Other' : undefined),
      year: role === 'participant' ? year : undefined,
      email,
      password,
      selectedTheme: role === 'participant' ? selectedTheme : undefined,
      role,
      isApproved: role !== 'participant'
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        rollNumber: user.rollNumber,
        email: user.email,
        selectedTheme: user.selectedTheme,
        role: user.role,
        votedThemes: user.votedThemes,
        token: user.isApproved ? generateToken(user._id) : undefined,
        pendingApproval: !user.isApproved
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { identifier, password, loginType } = req.body;

  try {
    let query = {};
    if (loginType === 'participant') {
      query = { rollNumber: identifier, role: 'participant' };
    } else if (loginType === 'viewer') {
      query = { email: identifier, role: 'viewer' };
    } else if (loginType === 'admin') {
      query = { email: identifier, role: 'admin' };
    } else {
      return res.status(400).json({ message: 'Invalid login type' });
    }

    const user = await User.findOne(query).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (!user.isApproved) {
        return res.status(401).json({ message: 'Your account is pending admin approval.' });
      }
      res.json({
        _id: user.id,
        name: user.name,
        rollNumber: user.rollNumber,
        email: user.email,
        selectedTheme: user.selectedTheme,
        role: user.role,
        votedThemes: user.votedThemes,
        token: generateToken(user._id)
      });
    } else {
      const errorMessage = loginType === 'participant' 
        ? 'Incorrect roll number or password' 
        : 'Incorrect email or password';
      res.status(401).json({ message: errorMessage });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
