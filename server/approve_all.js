require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await User.updateMany({}, { $set: { isApproved: true } });
  console.log('All existing users approved');
  process.exit(0);
});
