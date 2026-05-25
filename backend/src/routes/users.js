const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { roleMiddleware } = require('../middleware/auth');
const { ROLES } = require('../utils/constants');

/**
 * GET /api/users
 * Get all users (Admin only)
 */
router.get('/', roleMiddleware(ROLES.ADMIN), userController.getAllUsers);

/**
 * POST /api/users
 * Create new user (Admin only)
 */
router.post('/', roleMiddleware(ROLES.ADMIN), userController.createUser);

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', userController.getUserById);

/**
 * PUT /api/users/:id
 * Update user
 */
router.put('/:id', userController.updateUser);

/**
 * DELETE /api/users/:id
 * Delete user (Admin only)
 */
router.delete('/:id', roleMiddleware(ROLES.ADMIN), userController.deleteUser);

/**
 * POST /api/users/:id/change-role
 * Change user role (Admin only)
 */
router.post('/:id/change-role', roleMiddleware(ROLES.ADMIN), userController.changeUserRole);

/**
 * POST /api/users/:id/deactivate
 * Deactivate user (Admin only)
 */
router.post('/:id/deactivate', roleMiddleware(ROLES.ADMIN), userController.deactivateUser);

module.exports = router;
