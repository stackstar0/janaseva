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

// New PAN Application
router.post('/pan-new', upload.fields([
  { name: 'aadharFile', maxCount: 1 },
  { name: 'voterIdFile', maxCount: 1 },
  { name: 'photoFile', maxCount: 1 },
  { name: 'signatureFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { fullName, dob, mobile, fatherName } = req.body;
    const files = [
      req.files['aadharFile']?.[0],
      req.files['voterIdFile']?.[0],
      req.files['photoFile']?.[0],
      req.files['signatureFile']?.[0]
    ].filter(Boolean).map(f => ({
      filename: f.filename,
      originalname: f.originalname,
      path: f.path
    }));

    await ServiceRequest.create({
      serviceType: 'pan-new',
      user: req.session.user ? req.session.user.id : null,
      formData: { fullName, dob, mobile, fatherName },
      files
    });

    res.send(`
      <body>
        <script>
          setTimeout(() => { window.location.href = '/dashboard.html'; }, 2000);
        </script>
        <div style="margin:2em;font-weight:bold;color:green;">
          ✅ New PAN Application submitted successfully! Redirecting to dashboard...
        </div>
        <a href="/dashboard.html">Go to Dashboard Now</a>
      </body>
    `);
  } catch (e) {
    console.error(e);
    res.status(500).send('Submission failed.');
  }
});

// Missing PAN
router.post('/pan-missing', upload.fields([
  { name: 'aadharFile', maxCount: 1 },
  { name: 'photoFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { fullName, mobile } = req.body;
    const files = [
      req.files['aadharFile']?.[0],
      req.files['photoFile']?.[0]
    ].filter(Boolean).map(f => ({
      filename: f.filename,
      originalname: f.originalname,
      path: f.path
    }));

    await ServiceRequest.create({
      serviceType: 'pan-missing',
      user: req.session.user ? req.session.user.id : null,
      formData: { fullName, mobile },
      files
    });

    res.send(`
      <body>
        <script>
          setTimeout(() => { window.location.href = '/dashboard.html'; }, 2000);
        </script>
        <div style="margin:2em;font-weight:bold;color:green;">
          ✅ Missing PAN request submitted successfully! Redirecting to dashboard...
        </div>
        <a href="/dashboard.html">Go to Dashboard Now</a>
      </body>
    `);
  } catch (e) {
    console.error(e);
    res.status(500).send('Submission failed.');
  }
});

// Correction in PAN
router.post('/pan-correction', upload.fields([
  { name: 'oldPanFile', maxCount: 1 },
  { name: 'aadharFile', maxCount: 1 },
  { name: 'photoFile', maxCount: 1 },
  { name: 'signatureFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { oldPan, fullName, fieldToCorrect, correctValue } = req.body;
    const files = [
      req.files['oldPanFile']?.[0],
      req.files['aadharFile']?.[0],
      req.files['photoFile']?.[0],
      req.files['signatureFile']?.[0]
    ].filter(Boolean).map(f => ({
      filename: f.filename,
      originalname: f.originalname,
      path: f.path
    }));

    await ServiceRequest.create({
      serviceType: 'pan-correction',
      user: req.session.user ? req.session.user.id : null,
      formData: { oldPan, fullName, fieldToCorrect, correctValue },
      files
    });

    res.send(`
      <body>
        <script>
          setTimeout(() => { window.location.href = '/dashboard.html'; }, 2000);
        </script>
        <div style="margin:2em;font-weight:bold;color:green;">
          ✅ Correction request submitted successfully! Redirecting to dashboard...
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