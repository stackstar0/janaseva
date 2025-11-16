const express = require('express');
const multer = require('multer');
const path = require('path');
const XeroxRequest = require('../models/XeroxRequest');
const router = express.Router();

// Set up multer to handle multiple files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Handle Xerox form POST
router.post('/xerox', upload.array('xeroxFiles', 10), async (req, res) => {
  try {
    const { userName, mobileNumber } = req.body;

    // Get copies and xeroxType for each file (sent as copies-0, xeroxType-0, etc.)
    const files = req.files.map((file, idx) => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      copies: req.body[`copies-${idx}`],
      xeroxType: req.body[`xeroxType-${idx}`]
    }));

    await XeroxRequest.create({
      userName,
      mobileNumber,
      files
    });

    // For AJAX: send JSON, for normal form: redirect or HTML
    res.json({ success: true, message: 'Xerox request submitted!' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Could not process request' });
  }
});

module.exports = router;