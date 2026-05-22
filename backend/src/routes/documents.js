const express = require('express');
const router = express.Router();
const ApiResponse = require('../utils/apiResponse');
const { roleMiddleware } = require('../middleware/auth');
const { ROLES, DOCUMENT_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * GET /api/documents
 * Get all documents
 */
router.get('/', (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;

    // Mock data
    const documents = [
      {
        id: 1,
        title: 'Documento 1',
        description: 'Descripción del documento 1',
        status: DOCUMENT_STATUS.APPROVED,
        owner: { id: 1, name: 'Admin User' },
        createdAt: '2026-05-10',
        updatedAt: '2026-05-11'
      },
      {
        id: 2,
        title: 'Documento 2',
        description: 'Descripción del documento 2',
        status: DOCUMENT_STATUS.IN_PROCESS,
        owner: { id: 2, name: 'Director' },
        createdAt: '2026-05-09',
        updatedAt: '2026-05-12'
      }
    ];

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total: documents.length,
      pages: Math.ceil(documents.length / limit)
    };

    logger.info(`Documents list retrieved by ${req.user.email}`);

    return ApiResponse.paginated(res, documents, pagination, 'Documentos obtenidos', 200);
  } catch (err) {
    logger.error('Get documents error:', err);
    next(err);
  }
});

/**
 * POST /api/documents
 * Create new document
 */
router.post('/', (req, res, next) => {
  try {
    const { title, description, content } = req.body;

    // Validation
    if (!title || !description) {
      return ApiResponse.error(res, 'Título y descripción son requeridos', 400);
    }

    // Mock creation
    const newDocument = {
      id: 3,
      title,
      description,
      content: content || '',
      status: DOCUMENT_STATUS.DRAFT,
      owner: { id: req.user.id, name: req.user.name },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    logger.info(`Document created by ${req.user.email}: ${title}`);

    return ApiResponse.success(res, newDocument, 'Documento creado', 201);
  } catch (err) {
    logger.error('Create document error:', err);
    next(err);
  }
});

/**
 * GET /api/documents/:id
 * Get document by ID
 */
router.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;

    // Mock data
    const document = {
      id: parseInt(id),
      title: 'Documento 1',
      description: 'Descripción del documento',
      content: 'Contenido del documento...',
      status: DOCUMENT_STATUS.APPROVED,
      owner: { id: 1, name: 'Admin User' },
      createdAt: '2026-05-10',
      updatedAt: '2026-05-11'
    };

    logger.info(`Document ${id} retrieved by ${req.user.email}`);

    return ApiResponse.success(res, document, 'Documento obtenido', 200);
  } catch (err) {
    logger.error('Get document error:', err);
    next(err);
  }
});

/**
 * PUT /api/documents/:id
 * Update document
 */
router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, content } = req.body;

    // Validation
    if (!title || !description) {
      return ApiResponse.error(res, 'Título y descripción son requeridos', 400);
    }

    // Mock update
    const updatedDocument = {
      id: parseInt(id),
      title,
      description,
      content: content || '',
      status: DOCUMENT_STATUS.IN_PROCESS,
      owner: { id: req.user.id, name: req.user.name },
      createdAt: '2026-05-10',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    logger.info(`Document ${id} updated by ${req.user.email}`);

    return ApiResponse.success(res, updatedDocument, 'Documento actualizado', 200);
  } catch (err) {
    logger.error('Update document error:', err);
    next(err);
  }
});

/**
 * DELETE /api/documents/:id
 * Delete document
 */
router.delete('/:id', (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info(`Document ${id} deleted by ${req.user.email}`);

    return ApiResponse.success(res, { id: parseInt(id) }, 'Documento eliminado', 200);
  } catch (err) {
    logger.error('Delete document error:', err);
    next(err);
  }
});

/**
 * POST /api/documents/:id/approve
 * Approve document (Director or Admin only)
 */
router.post('/:id/approve', roleMiddleware(ROLES.ADMIN, ROLES.DIRECTOR), (req, res, next) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    logger.info(`Document ${id} approved by ${req.user.email}`);

    return ApiResponse.success(
      res,
      { id: parseInt(id), status: DOCUMENT_STATUS.APPROVED },
      'Documento aprobado',
      200
    );
  } catch (err) {
    logger.error('Approve document error:', err);
    next(err);
  }
});

/**
 * POST /api/documents/:id/reject
 * Reject document (Director or Admin only)
 */
router.post('/:id/reject', roleMiddleware(ROLES.ADMIN, ROLES.DIRECTOR), (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return ApiResponse.error(res, 'La razón del rechazo es requerida', 400);
    }

    logger.info(`Document ${id} rejected by ${req.user.email}`);

    return ApiResponse.success(
      res,
      { id: parseInt(id), status: DOCUMENT_STATUS.REJECTED },
      'Documento rechazado',
      200
    );
  } catch (err) {
    logger.error('Reject document error:', err);
    next(err);
  }
});

module.exports = router;
