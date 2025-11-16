const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: String,           // e.g. "PAN Card", "Aadhaar Card" etc.
  details: Object,               // All form fields (name, dob, etc)
  status: { type: String, default: 'Pending' }, // Pending/Ongoing/Completed
  createdAt: { type: Date, default: Date.now },
  documents: [String]            // Array of file paths/names
});

module.exports = mongoose.model('Request', requestSchema);