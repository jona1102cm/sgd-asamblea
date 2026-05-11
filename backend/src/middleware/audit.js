const logger = require('../utils/logger');
const { AUDIT_ACTIONS } = require('../utils/constants');

const auditMiddleware = (req, res, next) => {
  // Capturar información de la solicitud
  const auditData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    query: req.query,
    userId: req.user?.id || 'ANONYMOUS',
    userRole: req.user?.role || 'GUEST',
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent')
  };

  // Interceptar la respuesta
  const originalJson = res.json;
  res.json = function(data) {
    auditData.statusCode = res.statusCode;
    auditData.responseTime = Date.now() - req.startTime;

    // Log de auditoría
    if (req.method !== 'GET') {
      logger.info('Audit Log', auditData);
    }

    return originalJson.call(this, data);
  };

  req.startTime = Date.now();
  next();
};

const logAction = (action, resource, details = {}) => {
  return (req, res, next) => {
    req.auditAction = {
      action,
      resource,
      userId: req.user?.id,
      timestamp: new Date().toISOString(),
      ...details
    };
    next();
  };
};

module.exports = {
  auditMiddleware,
  logAction
};
