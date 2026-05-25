const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');
const { roleMiddleware } = require('../middleware/auth');
const { ROLES } = require('../utils/constants');

/**
 * GET /api/workflows
 * Get all workflows
 */
router.get('/', workflowController.getAllWorkflows);

/**
 * POST /api/workflows
 * Create new workflow
 */
router.post('/', workflowController.createWorkflow);

/**
 * GET /api/workflows/:id
 * Get workflow by ID
 */
router.get('/:id', workflowController.getWorkflowById);

/**
 * POST /api/workflows/:id/approve
 * Approve workflow step
 */
router.post('/:id/approve', workflowController.approveWorkflow);

/**
 * POST /api/workflows/:id/reject
 * Reject workflow step
 */
router.post('/:id/reject', workflowController.rejectWorkflow);

/**
 * POST /api/workflows/:id/advance
 * Advance workflow to next step (Admin or Director only)
 */
router.post('/:id/advance', roleMiddleware(ROLES.ADMIN, ROLES.DIRECTOR), workflowController.advanceWorkflow);

/**
 * POST /api/workflows/:id/cancel
 * Cancel workflow (Admin or Director only)
 */
router.post('/:id/cancel', roleMiddleware(ROLES.ADMIN, ROLES.DIRECTOR), workflowController.cancelWorkflow);

/**
 * GET /api/workflows/statistics/summary
 * Get workflow statistics
 */
router.get('/statistics/summary', workflowController.getWorkflowStatistics);

module.exports = router;
