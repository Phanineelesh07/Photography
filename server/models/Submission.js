const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One submission per participant
  },
  theme: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);
