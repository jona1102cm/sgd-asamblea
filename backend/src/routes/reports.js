const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { roleMiddleware } = require('../middleware/auth');
const { ROLES } = require('../utils/constants');

/**
 * GET /api/reports
 * Get all reports (Admin or Director only)
 */
router.get('/', roleMiddleware(ROLES.ADMIN, ROLES.DIRECTOR), reportController.getAllReports);

/**
 * POST /api/reports
 * Generate new report (Admin or Director only)
 */
router.post('/', roleMiddleware(ROLES.ADMIN, ROLES.DIRECTOR), reportController.generateReport);

/**
 * GET /api/reports/:id
 * Get report by ID (Admin or Director only)
 */
router.get('/:id', roleMiddleware(ROLES.ADMIN, ROLES.DIRECTOR), reportController.getReportById);

/**
 * GET /api/reports/:id/export
 * Export report as PDF or Excel (Admin or Director only)
 */
router.get('/:id/export', roleMiddleware(ROLES.ADMIN, ROLES.DIRECTOR), reportController.exportReport);

/**
 * DELETE /api/reports/:id
 * Delete report (Admin only)
 */
router.delete('/:id', roleMiddleware(ROLES.ADMIN), reportController.deleteReport);

/**
 * GET /api/reports/statistics/summary
 * Get summary statistics (Admin or Director only)
 */
router.get('/statistics/summary', roleMiddleware(ROLES.ADMIN, ROLES.DIRECTOR), reportController.getStatisticsSummary);

/**
 * GET /api/reports/statistics/documents
 * Get document statistics (Admin or Director only)
 */
router.get('/statistics/documents', roleMiddleware(ROLES.ADMIN, ROLES.DIRECTOR), reportController.getDocumentStatistics);

/**
 * POST /api/reports/schedule
 * Schedule report generation (Admin only)
 */
router.post('/schedule', roleMiddleware(ROLES.ADMIN), reportController.scheduleReport);

module.exports = router;
