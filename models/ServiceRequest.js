const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  serviceType: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  formData: { type: Object, required: true },
  files: [{ filename: String, originalname: String, path: String }],
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);