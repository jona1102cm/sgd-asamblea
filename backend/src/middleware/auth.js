const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { ROLES } = require('../utils/constants');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Token no proporcionado'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.error('Auth error:', err);
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido o expirado'
    });
  }
};

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuario no autenticado'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Acceso denegado. Usuario: ${req.user.id}, Rol: ${req.user.role}, Ruta: ${req.path}`);
      return res.status(403).json({
        status: 'error',
        message: 'Acceso denegado. Permisos insuficientes'
      });
    }

    next();
  };
};

const adminOnly = roleMiddleware(ROLES.ADMIN);
const directorOrAdmin = roleMiddleware(ROLES.ADMIN, ROLES.DIRECTOR);

module.exports = {
  authMiddleware,
  roleMiddleware,
  adminOnly,
  directorOrAdmin
};
