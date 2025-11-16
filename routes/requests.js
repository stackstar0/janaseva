const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// Middleware for authentication (assume user._id is set after login)
router.get('/requests', async (req, res) => {
  if (!req.user) return res.status(401).send('Unauthorized');

  try {
    const requests = await Request.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.render('request-detail', { requests }); // render EJS/Pug/etc.
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;