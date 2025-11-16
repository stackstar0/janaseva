const express = require('express');
const multer = require('multer');
const path = require('path');
const CertificateApplication = require('../models/CertificateApplication');
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/certificate', upload.fields([
  { name: 'aadharCard', maxCount: 1 },
  { name: 'studyCertificate', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      certificateType,
      casteCategory,
      address
    } = req.body;

    // Get file paths
    const aadharCard = req.files['aadharCard']?.[0]?.filename;
    const studyCertificate = req.files['studyCertificate']?.[0]?.filename;
    const photo = req.files['photo']?.[0]?.filename;
    const signature = req.files['signature']?.[0]?.filename;

    if (!aadharCard || !studyCertificate || !photo || !signature) {
      return res.status(400).json({ success: false, message: 'All files are required.' });
    }

    await CertificateApplication.create({
      fullName,
      mobileNumber,
      certificateType,
      casteCategory: certificateType === 'caste' ? casteCategory : undefined,
      address,
      aadharCard,
      studyCertificate,
      photo,
      signature
    });

    res.json({ success: true, message: 'Application submitted!' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Could not process request' });
  }
});

module.exports = router;