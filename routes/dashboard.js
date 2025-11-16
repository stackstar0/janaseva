const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const XeroxRequest = require('../models/XeroxRequest');
const CertificateApplication = require('../models/CertificateApplication');

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.session.user) return next();
  return res.redirect('/login.html');
}

// Middleware to check if user is admin
function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') return next();
  return res.status(403).send('Access denied: Admins only');
}

// User dashboard - show their service requests (for regular user)
router.get('/dashboard-data', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const requests = await ServiceRequest.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ requests });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch requests.' });
  }
});

// Admin dashboard - show all service requests
router.get('/admin-data', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const requests = await ServiceRequest.find().populate('user', 'fullname email').sort({ createdAt: -1 });
    res.json({ requests });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch requests.' });
  }
});

// Admin can update request status
router.post('/update-request-status', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { requestId, status, requestType } = req.body;
  console.log('Update status request:', { requestId, status, requestType, user: req.session.user });
  
  if (!requestId || !status) {
    return res.status(400).json({ error: 'Request ID and status are required.' });
  }
  
  try {
    let updated = false;
    let result = null;
    
    if (requestType === 'service' || !requestType) {
      result = await ServiceRequest.findByIdAndUpdate(requestId, { status }, { new: true });
      if (result) updated = true;
    } 
    
    if (!updated && (requestType === 'xerox' || !requestType)) {
      result = await XeroxRequest.findByIdAndUpdate(requestId, { status }, { new: true });
      if (result) updated = true;
    }
    
    if (!updated && (requestType === 'certificate' || !requestType)) {
      result = await CertificateApplication.findByIdAndUpdate(requestId, { status }, { new: true });
      if (result) updated = true;
    }
    
    if (updated) {
      console.log('Status updated successfully:', result);
      res.json({ success: true, message: 'Status updated successfully' });
    } else {
      console.log('Request not found with ID:', requestId);
      res.status(404).json({ error: 'Request not found.' });
    }
  } catch (e) {
    console.error('Error updating status:', e);
    res.status(500).json({ error: 'Failed to update status: ' + e.message });
  }
});

// Get requests filtered by status for admin
router.get('/admin-requests/:status', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const { status } = req.params;
    
    // Get ServiceRequest with the specified status
    const serviceRequests = await ServiceRequest.find({ status }).populate('user', 'fullname email').sort({ createdAt: -1 });
    
    // Get XeroxRequest with the specified status
    const xeroxRequests = await XeroxRequest.find({ status }).sort({ createdAt: -1 });
    
    // Get CertificateApplication with the specified status
    const certificateRequests = await CertificateApplication.find({ status }).sort({ createdAt: -1 });
    
    // Transform all requests to a unified format
    const unifiedRequests = [
      ...serviceRequests.map(req => ({
        _id: req._id,
        serviceType: req.serviceType,
        user: req.user,
        formData: req.formData,
        files: req.files,
        status: req.status,
        createdAt: req.createdAt,
        requestType: 'service'
      })),
      ...xeroxRequests.map(req => ({
        _id: req._id,
        serviceType: 'xerox',
        user: null,
        formData: { userName: req.userName, mobileNumber: req.mobileNumber },
        files: req.files,
        status: req.status,
        createdAt: req.createdAt,
        requestType: 'xerox'
      })),
      ...certificateRequests.map(req => ({
        _id: req._id,
        serviceType: `certificate-${req.certificateType}`,
        user: null,
        formData: { 
          fullName: req.fullName, 
          mobileNumber: req.mobileNumber,
          certificateType: req.certificateType,
          casteCategory: req.casteCategory,
          address: req.address
        },
        files: [
          { filename: req.aadharCard, originalname: 'Aadhar Card' },
          { filename: req.studyCertificate, originalname: 'Study Certificate' },
          { filename: req.photo, originalname: 'Photo' },
          { filename: req.signature, originalname: 'Signature' }
        ].filter(f => f.filename),
        status: req.status,
        createdAt: req.createdAt,
        requestType: 'certificate'
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ requests: unifiedRequests });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch requests.' });
  }
});

// Get single request details with files
router.get('/admin-request-detail/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find in ServiceRequest first
    let request = await ServiceRequest.findById(id).populate('user', 'fullname email');
    if (request) {
      return res.json({ 
        request: {
          ...request.toObject(),
          requestType: 'service'
        }
      });
    }
    
    // Try XeroxRequest
    request = await XeroxRequest.findById(id);
    if (request) {
      return res.json({ 
        request: {
          ...request.toObject(),
          requestType: 'xerox',
          serviceType: 'xerox',
          user: null,
          formData: { 
            userName: request.userName, 
            mobileNumber: request.mobileNumber 
          },
          status: 'pending'
        }
      });
    }
    
    // Try CertificateApplication
    request = await CertificateApplication.findById(id);
    if (request) {
      return res.json({ 
        request: {
          ...request.toObject(),
          requestType: 'certificate',
          serviceType: `certificate-${request.certificateType}`,
          user: null,
          formData: { 
            fullName: request.fullName, 
            mobileNumber: request.mobileNumber,
            certificateType: request.certificateType,
            casteCategory: request.casteCategory,
            address: request.address
          },
          files: [
            { filename: request.aadharCard, originalname: 'Aadhar Card' },
            { filename: request.studyCertificate, originalname: 'Study Certificate' },
            { filename: request.photo, originalname: 'Photo' },
            { filename: request.signature, originalname: 'Signature' }
          ].filter(f => f.filename),
          status: 'pending'
        }
      });
    }
    
    return res.status(404).json({ error: 'Request not found.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch request details.' });
  }
});

// Serve uploaded files (with admin authentication)
router.get('/files/:filename', ensureAuthenticated, ensureAdmin, (req, res) => {
  const { filename } = req.params;
  const path = require('path');
  const filePath = path.join(process.cwd(), 'uploads', filename);
  res.sendFile(filePath);
});

// Get dashboard statistics
router.get('/admin-stats', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    // Count ServiceRequest by status
    const servicePending = await ServiceRequest.countDocuments({ status: 'pending' });
    const serviceOngoing = await ServiceRequest.countDocuments({ status: 'ongoing' });
    const serviceCompleted = await ServiceRequest.countDocuments({ status: 'completed' });
    
    // Count XeroxRequest by status
    const xeroxPending = await XeroxRequest.countDocuments({ status: 'pending' });
    const xeroxOngoing = await XeroxRequest.countDocuments({ status: 'ongoing' });
    const xeroxCompleted = await XeroxRequest.countDocuments({ status: 'completed' });
    
    // Count CertificateApplication by status
    const certificatePending = await CertificateApplication.countDocuments({ status: 'pending' });
    const certificateOngoing = await CertificateApplication.countDocuments({ status: 'ongoing' });
    const certificateCompleted = await CertificateApplication.countDocuments({ status: 'completed' });
    
    res.json({
      pending: servicePending + xeroxPending + certificatePending,
      ongoing: serviceOngoing + xeroxOngoing + certificateOngoing,
      completed: serviceCompleted + xeroxCompleted + certificateCompleted
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch statistics.' });
  }
});

// Debug route to check session
router.get('/check-session', (req, res) => {
  res.json({
    sessionExists: !!req.session.user,
    user: req.session.user || null,
    sessionId: req.sessionID
  });
});

// Serve admin HTML pages with authentication
router.get('/admin.html', ensureAuthenticated, ensureAdmin, (req, res) => {
  const path = require('path');
  res.sendFile(path.join(process.cwd(), 'startbootstrap-simple-sidebar-gh-pages', 'admin.html'));
});

router.get('/pending.html', ensureAuthenticated, ensureAdmin, (req, res) => {
  const path = require('path');
  res.sendFile(path.join(process.cwd(), 'startbootstrap-simple-sidebar-gh-pages', 'pending.html'));
});

router.get('/ongoing.html', ensureAuthenticated, ensureAdmin, (req, res) => {
  const path = require('path');
  res.sendFile(path.join(process.cwd(), 'startbootstrap-simple-sidebar-gh-pages', 'ongoing.html'));
});

router.get('/completed.html', ensureAuthenticated, ensureAdmin, (req, res) => {
  const path = require('path');
  res.sendFile(path.join(process.cwd(), 'startbootstrap-simple-sidebar-gh-pages', 'completed.html'));
});

// Create admin user (development only)
router.get('/create-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.json({ message: 'Admin already exists', admin: existingAdmin.email });
    }
    
    // Create admin user
    const admin = await User.create({
      fullname: 'Admin User',
      email: 'admin1@gmail.com', // Changed to match your credentials
      password: 'admin', // Changed to match your credentials
      role: 'admin'
    });
    
    res.json({ message: 'Admin user created successfully', email: admin.email });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Failed to create admin user' });
  }
});

// Quick login for admin (development only)
router.get('/quick-admin-login', async (req, res) => {
  try {
    const admin = await User.findOne({ email: 'admin1@gmail.com', role: 'admin' });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found. Please create admin first by visiting /create-admin' });
    }
    
    // Set session
    req.session.user = {
      id: admin._id,
      email: admin.email,
      fullname: admin.fullname,
      role: admin.role,
    };
    
    res.json({ success: true, message: 'Logged in as admin', redirectTo: '/admin.html' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to login' });
  }
});

module.exports = router;