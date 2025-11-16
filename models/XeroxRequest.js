const mongoose = require('mongoose');

const XeroxFileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  path: String,
  copies: Number,
  xeroxType: String,
});

const XeroxRequestSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  files: [XeroxFileSchema],
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('XeroxRequest', XeroxRequestSchema);