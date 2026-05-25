const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Parse URL-encoded bodies

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const documentRoutes = require('./routes/documents');
const workflowRoutes = require('./routes/workflows');
const reportRoutes = require('./routes/reports');

// Import middleware
const { authMiddleware } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/documents', authMiddleware, documentRoutes);
app.use('/api/workflows', authMiddleware, workflowRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Sistema de Gestión de Documentos - Asamblea Nacional',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      documents: '/api/documents',
      workflows: '/api/workflows',
      reports: '/api/reports'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use(errorHandler);

// Export app
module.exports = app;
