const express = require('express');
const router = express.Router();
const ApiResponse = require('../utils/apiResponse');
const { roleMiddleware } = require('../middleware/auth');
const { ROLES } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * GET /api/users
 * Get all users (Admin only)
 */
router.get('/', roleMiddleware(ROLES.ADMIN), (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Mock data
    const users = [
      {
        id: 1,
        email: 'admin@asamblea.gob.ec',
        name: 'Admin User',
        role: 'ADMIN',
        active: true,
        createdAt: '2026-01-15'
      },
      {
        id: 2,
        email: 'director@asamblea.gob.ec',
        name: 'Director',
        role: 'DIRECTOR',
        active: true,
        createdAt: '2026-01-15'
      }
    ];

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total: users.length,
      pages: Math.ceil(users.length / limit)
    };

    logger.info(`Users list retrieved by ${req.user.email}`);

    return ApiResponse.paginated(res, users, pagination, 'Usuarios obtenidos', 200);
  } catch (err) {
    logger.error('Get users error:', err);
    next(err);
  }
});

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user is accessing their own data or is admin
    if (req.user.id !== parseInt(id) && req.user.role !== ROLES.ADMIN) {
      return ApiResponse.error(res, 'No tiene permiso para acceder a este usuario', 403);
    }

    // Mock data
    const user = {
      id: parseInt(id),
      email: 'user@asamblea.gob.ec',
      name: 'User Name',
      role: 'USUARIO',
      active: true,
      createdAt: '2026-01-15'
    };

    logger.info(`User ${id} retrieved by ${req.user.email}`);

    return ApiResponse.success(res, user, 'Usuario obtenido', 200);
  } catch (err) {
    logger.error('Get user error:', err);
    next(err);
  }
});

/**
 * PUT /api/users/:id
 * Update user
 */
router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Check if user is updating their own data or is admin
    if (req.user.id !== parseInt(id) && req.user.role !== ROLES.ADMIN) {
      return ApiResponse.error(res, 'No tiene permiso para actualizar este usuario', 403);
    }

    // Validation
    if (!name || !email) {
      return ApiResponse.error(res, 'Nombre y email son requeridos', 400);
    }

    // Mock update
    const updatedUser = {
      id: parseInt(id),
      email,
      name,
      role: 'USUARIO',
      active: true,
      createdAt: '2026-01-15'
    };

    logger.info(`User ${id} updated by ${req.user.email}`);

    return ApiResponse.success(res, updatedUser, 'Usuario actualizado', 200);
  } catch (err) {
    logger.error('Update user error:', err);
    next(err);
  }
});

/**
 * DELETE /api/users/:id
 * Delete user (Admin only)
 */
router.delete('/:id', roleMiddleware(ROLES.ADMIN), (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info(`User ${id} deleted by ${req.user.email}`);

    return ApiResponse.success(res, { id: parseInt(id) }, 'Usuario eliminado', 200);
  } catch (err) {
    logger.error('Delete user error:', err);
    next(err);
  }
});

/**
 * POST /api/users/:id/change-role
 * Change user role (Admin only)
 */
router.post('/:id/change-role', roleMiddleware(ROLES.ADMIN), (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !Object.values(ROLES).includes(role)) {
      return ApiResponse.error(res, 'Rol inválido', 400);
    }

    logger.info(`User ${id} role changed to ${role} by ${req.user.email}`);

    return ApiResponse.success(res, { id: parseInt(id), role }, 'Rol actualizado', 200);
  } catch (err) {
    logger.error('Change role error:', err);
    next(err);
  }
});

module.exports = router;
