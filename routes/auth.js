const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const User = require('../models/User');

// Registration
router.post('/register', async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res.send('All fields are required! <a href="/register.html">Try again</a>');
  }
  try {
    if (await User.findOne({ email })) {
      return res.send('User already exists! <a href="/register.html">Try again</a>');
    }
    await User.create({ fullname, email, password }); // Default role is 'user'
    res.redirect('/login.html');
  } catch (e) {
    console.error(e);
    res.send('Registration error! <a href="/register.html">Try again</a>');
  }
});

// Login with role-based redirect
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password }); // 🚨 Use hashing in production!
    if (!user) return res.send('Invalid credentials! <a href="/login.html">Try again</a>');
    req.session.user = {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
    };
    if (user.role === 'admin') {
      return res.redirect('/admin.html');
    } else {
      return res.redirect('/dashboard.html');
    }
  } catch (e) {
    console.error(e);
    res.send('Login error! <a href="/login.html">Try again</a>');
  }
});

// Google OAuth initiation
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login.html'
}), (req, res) => {
  req.session.user = {
    id: req.user._id,
    email: req.user.email,
    fullname: req.user.fullname,
    role: req.user.role
  };
  if (req.user.role === 'admin') {
    res.redirect('/admin.html');
  } else {
    res.redirect('/dashboard.html');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/index.html'));
});

module.exports = router;