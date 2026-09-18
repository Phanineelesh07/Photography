const nodemailer = require('nodemailer');

const testAuth = async () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'filmandphotographyclubau@gmail.com',
      pass: 'qobyaontqzfgiboq' 
    }
  });

  try {
    await transporter.verify();
    console.log('Authentication successful!');
  } catch (error) {
    console.error('Authentication failed:', error.message);
  }
};

testAuth();
