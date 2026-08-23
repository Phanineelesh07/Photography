const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  uploadEnabled: {
    type: Boolean,
    default: false
  },
  paymentQrUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
