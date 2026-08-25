const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};



// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  
  if (email.toLowerCase() !== 'admin@inspire.com') {
    const allowedDomains = ['@adityauniversity.in', '@aditya.ac.in'];
    const isAllowed = allowedDomains.some(domain => email.toLowerCase().endsWith(domain));
    if (!isAllowed) {
      return res.status(400).json({ message: 'Only official college emails (@adityauniversity.in or @aditya.ac.in) are allowed.' });
    }
  }

  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if OTP already exists for this email, delete it
    await OTP.deleteOne({ email });

    // Save new OTP
    await OTP.create({
      email,
      otp
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send email
    const mailOptions = {
      from: `"Inspire Registration" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Registration OTP - Inspire Event',
      text: `Your OTP for Inspire Event Registration is: ${otp}. It is valid for 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: `Error sending OTP: ${error.message}` });
  }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, rollNumber, phone, course, branch, year, email, password, selectedTheme, userType, otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: 'Please provide the OTP sent to your email.' });
  }

  try {
    // Verify OTP
    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

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
      rollNumber, // Now we collect roll number for EVERYONE (except admin)
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
      // Delete OTP after successful registration
      await OTP.deleteOne({ email });

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
  sendOtp,
  registerUser,
  loginUser,
  getMe
};
