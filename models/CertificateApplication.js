const mongoose = require('mongoose');

const CertificateApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  certificateType: { type: String, enum: ['income', 'caste'], required: true },
  casteCategory: { type: String },
  address: { type: String, required: true },
  aadharCard: { type: String, required: true },
  studyCertificate: { type: String, required: true },
  photo: { type: String, required: true },
  signature: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CertificateApplication', CertificateApplicationSchema);