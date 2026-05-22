const express = require('express');
const router = express.Router();
const ApiResponse = require('../utils/apiResponse');
const { roleMiddleware } = require('../middleware/auth');
const { ROLES, WORKFLOW_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * GET /api/workflows
 * Get all workflows
 */
router.get('/', (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, documentId } = req.query;

    // Mock data
    const workflows = [
      {
        id: 1,
        documentId: 1,
        documentTitle: 'Documento 1',
        status: WORKFLOW_STATUS.APPROVED,
        currentStep: 'Final Review',
        approvers: [
          { id: 1, name: 'Admin User', approved: true, approvedAt: '2026-05-11' }
        ],
        createdAt: '2026-05-10',
        updatedAt: '2026-05-11'
      },
      {
        id: 2,
        documentId: 2,
        documentTitle: 'Documento 2',
        status: WORKFLOW_STATUS.PENDING,
        currentStep: 'Director Review',
        approvers: [
          { id: 2, name: 'Director', approved: false, approvedAt: null }
        ],
        createdAt: '2026-05-09',
        updatedAt: '2026-05-12'
      }
    ];

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total: workflows.length,
      pages: Math.ceil(workflows.length / limit)
    };

    logger.info(`Workflows list retrieved by ${req.user.email}`);

    return ApiResponse.paginated(res, workflows, pagination, 'Flujos de trabajo obtenidos', 200);
  } catch (err) {
    logger.error('Get workflows error:', err);
    next(err);
  }
});

/**
 * POST /api/workflows
 * Create new workflow
 */
router.post('/', (req, res, next) => {
  try {
    const { documentId, approverIds, steps } = req.body;

    // Validation
    if (!documentId || !approverIds || approverIds.length === 0) {
      return ApiResponse.error(res, 'DocumentId y aprobadores son requeridos', 400);
    }

    // Mock creation
    const newWorkflow = {
      id: 3,
      documentId,
      status: WORKFLOW_STATUS.PENDING,
      currentStep: steps?.[0] || 'Initial Review',
      approvers: approverIds.map(id => ({
        id,
        approved: false,
        approvedAt: null
      })),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    logger.info(`Workflow created for document ${documentId} by ${req.user.email}`);

    return ApiResponse.success(res, newWorkflow, 'Flujo de trabajo creado', 201);
  } catch (err) {
    logger.error('Create workflow error:', err);
    next(err);
  }
});

/**
 * GET /api/workflows/:id
 * Get workflow by ID
 */
router.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;

    // Mock data
    const workflow = {
      id: parseInt(id),
      documentId: 1,
      documentTitle: 'Documento 1',
      status: WORKFLOW_STATUS.APPROVED,
      currentStep: 'Final Review',
      steps: [
        {
          name: 'Initial Review',
          completed: true,
          completedAt: '2026-05-10'
        },
        {
          name: 'Director Review',
          completed: true,
          completedAt: '2026-05-10'
        },
        {
          name: 'Final Review',
          completed: true,
          completedAt: '2026-05-11'
        }
      ],
      approvers: [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@asamblea.gob.ec',
          approved: true,
          approvedAt: '2026-05-11',
          comments: 'Aprobado sin comentarios'
        }
      ],
      createdAt: '2026-05-10',
      updatedAt: '2026-05-11'
    };

    logger.info(`Workflow ${id} retrieved by ${req.user.email}`);

    return ApiResponse.success(res, workflow, 'Flujo de trabajo obtenido', 200);
  } catch (err) {
    logger.error('Get workflow error:', err);
    next(err);
  }
});

/**
 * POST /api/workflows/:id/approve
 * Approve workflow step
 */
router.post('/:id/approve', (req, res, next) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    logger.info(`Workflow ${id} approved by ${req.user.email}`);

    return ApiResponse.success(
      res,
      { id: parseInt(id), status: WORKFLOW_STATUS.APPROVED },
      'Flujo de trabajo aprobado',
      200
    );
  } catch (err) {
    logger.error('Approve workflow error:', err);
    next(err);
  }
});

/**
 * POST /api/workflows/:id/reject
 * Reject workflow step
 */
router.post('/:id/reject', (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return ApiResponse.error(res, 'La razón del rechazo es requerida', 400);
    }

    logger.info(`Workflow ${id} rejected by ${req.user.email}`);

    return ApiResponse.success(
      res,
      { id: parseInt(id), status: WORKFLOW_STATUS.REJECTED },
      'Flujo de trabajo rechazado',
      200
    );
  } catch (err) {
    logger.error('Reject workflow error:', err);
    next(err);
  }
});

/**
 * POST /api/workflows/:id/advance
 * Advance workflow to next step
 */
router.post('/:id/advance', roleMiddleware(ROLES.ADMIN, ROLES.DIRECTOR), (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info(`Workflow ${id} advanced by ${req.user.email}`);

    return ApiResponse.success(
      res,
      { id: parseInt(id), status: WORKFLOW_STATUS.PENDING },
      'Flujo de trabajo avanzado al siguiente paso',
      200
    );
  } catch (err) {
    logger.error('Advance workflow error:', err);
    next(err);
  }
});

module.exports = router;
