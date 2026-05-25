const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { roleMiddleware } = require('../middleware/auth');
const { ROLES } = require('../utils/constants');

/**
 * GET /api/documents
 * Get all documents
 */
router.get('/', documentController.getAllDocuments);

/**
 * POST /api/documents
 * Create new document
 */
router.post('/', documentController.createDocument);

/**
 * GET /api/documents/:id
 * Get document by ID
 */
router.get('/:id', documentController.getDocumentById);

/**
 * PUT /api/documents/:id
 * Update document
 */
router.put('/:id', documentController.updateDocument);

/**
 * DELETE /api/documents/:id
 * Delete document
 */
router.delete('/:id', documentController.deleteDocument);

/**
 * POST /api/documents/:id/approve
 * Approve document (Director or Admin only)
 */
router.post('/:id/approve', roleMiddleware(ROLES.ADMIN, ROLES.DIRECTOR), documentController.approveDocument);

/**
 * POST /api/documents/:id/reject
 * Reject document (Director or Admin only)
 */
router.post('/:id/reject', roleMiddleware(ROLES.ADMIN, ROLES.DIRECTOR), documentController.rejectDocument);

/**
 * POST /api/documents/:id/comments
 * Add comment to document
 */
router.post('/:id/comments', documentController.addComment);

/**
 * GET /api/documents/:id/history
 * Get document history/versions
 */
router.get('/:id/history', documentController.getDocumentHistory);

module.exports = router;
