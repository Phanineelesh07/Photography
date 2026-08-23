const Settings = require('../models/Settings');

// @desc    Get global settings
// @route   GET /api/settings
// @access  Private (Any logged in user)
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ uploadEnabled: false });
    }
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching settings' });
  }
};

// @desc    Toggle upload enabled state
// @route   PUT /api/settings/upload
// @access  Private/Admin
const toggleUpload = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ uploadEnabled: false });
    }
    
    settings.uploadEnabled = !settings.uploadEnabled;
    await settings.save();
    
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating settings' });
  }
};


// @desc    Upload Payment QR Code
// @route   PUT /api/settings/qr
// @access  Private/Admin
const uploadPaymentQr = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    if (req.file) {
      settings.paymentQrUrl = '/uploads/' + req.file.filename;
      await settings.save();
      res.json(settings);
    } else {
      res.status(400).json({ message: 'No file uploaded' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Delete Payment QR Code
// @route   DELETE /api/settings/qr
// @access  Private/Admin
const deletePaymentQr = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    settings.paymentQrUrl = '';
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getSettings,
  toggleUpload,
  uploadPaymentQr,
  deletePaymentQr
};
