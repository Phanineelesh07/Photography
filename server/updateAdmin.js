require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const updateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Hash password properly before saving
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('AdminPassword123!', salt);
    
    const result = await User.updateOne(
      { rollNumber: 'ADMIN001' },
      { $set: { email: 'admin@inspire.com', password: hashedPassword } }
    );
    
    console.log('Admin updated:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateAdmin();
