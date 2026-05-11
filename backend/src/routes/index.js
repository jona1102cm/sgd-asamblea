const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const documentRoutes = require('./documents');
const workflowRoutes = require('./workflows');
const reportRoutes = require('./reports');

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use(authMiddleware);

router.use('/users', userRoutes);
router.use('/documents', documentRoutes);
router.use('/workflows', workflowRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
