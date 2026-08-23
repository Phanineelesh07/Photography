require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@inspire.com' });
    if (adminExists) {
      console.log('Admin already exists!');
      process.exit();
    }

    const adminUser = await User.create({
      name: 'Super Admin',
      rollNumber: 'ADMIN001',
      phone: '0000000000',
      branch: 'Other',
      year: '4th Year',
      email: 'admin@inspire.com',
      password: 'AdminPassword123!',
      selectedTheme: 'Nature & Greenery',
      role: 'admin'
    });

    console.log('Admin created successfully with email: admin@inspire.com');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
