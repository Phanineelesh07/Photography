const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  rollNumber: {
    type: String,
    required: [function() { return this.role === 'participant'; }, 'Please add a roll number'],
    unique: true,
    sparse: true
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  course: {
    type: String,
    required: [function() { return this.role === 'participant'; }, 'Please select a course/program'],
    enum: ['B.Tech', 'BBA', 'Pharmacy', 'Polytechnic', 'Other']
  },
  branch: {
    type: String,
    required: [function() { return this.course === 'B.Tech' && this.role === 'participant'; }, 'Please add a branch for B.Tech'],
    enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI & DS', 'AIML', 'IT', 'Petroleum', 'Mining', 'Other']
  },
  year: {
    type: String,
    required: [function() { return this.role === 'participant'; }, 'Please add a year'],
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // Do not return password by default
  },
  selectedTheme: {
    type: String,
    required: [function() { return this.role === 'participant'; }, 'Please select a photography theme'],
    enum: ['Nature & Greenery', 'Reflections & Perspectives', 'Views Through a Frame', 'Everyday Objects, Extraordinary Frames']
  },
  registrationStatus: {
    type: String,
    default: 'Confirmed'
  },
  role: {
    type: String,
    enum: ['participant', 'admin', 'viewer'],
    default: 'participant'
  },
  votedThemes: {
    type: [String],
    default: []
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
