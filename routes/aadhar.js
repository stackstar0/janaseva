const express = require('express');
const router = express.Router();
const multer = require('multer');
const ServiceRequest = require('../models/ServiceRequest');

// Multer setup (reuse if shared with other routes)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Aadhaar Correction Service Route
router.post('/aadhar-correction', upload.fields([
  { name: 'oldAadharFile', maxCount: 1 },
  { name: 'photoFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { aadharNumber, fullName, mobile, fieldToCorrect, correctValue } = req.body;
    const files = [
      req.files['oldAadharFile']?.[0],
      req.files['photoFile']?.[0]
    ].filter(Boolean).map(f => ({
      filename: f.filename,
      originalname: f.originalname,
      path: f.path
    }));

    await ServiceRequest.create({
      serviceType: 'aadhar-correction',
      user: req.session.user ? req.session.user.id : null,
      formData: { aadharNumber, fullName, mobile, fieldToCorrect, correctValue },
      files
    });

    res.send(`
      <body>
        <script>
          setTimeout(() => { window.location.href = '/dashboard.html'; }, 2000);
        </script>
        <div style="margin:2em;font-weight:bold;color:green;">
          ✅ Aadhaar correction request submitted successfully! Redirecting to dashboard...
        </div>
        <a href="/dashboard.html">Go to Dashboard Now</a>
      </body>
    `);
  } catch (e) {
    console.error(e);
    res.status(500).send('Submission failed.');
  }
});

module.exports = router;