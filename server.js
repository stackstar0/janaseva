require('dotenv').config();

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('MongoDB connected!');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Middleware
app.use(express.static('startbootstrap-simple-sidebar-gh-pages'));
app.use(express.json()); // Add JSON body parsing
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/submit-service', require('./routes/pan'));
app.use('/submit-service', require('./routes/aadhar'));
app.use('/', require('./routes/dashboard'));
app.post('/login', (req, res) => res.redirect('/auth/login'));
app.use('/submit-service', require('./routes/xerox'));
app.use('/submit-service', require('./routes/certificate'));
app.use('/', require('./routes/requests'));
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));