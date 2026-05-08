const ROLES = {
  ADMIN: 'ADMIN',
  DIRECTOR: 'DIRECTOR',
  JEFE_UNIDAD: 'JEFE_UNIDAD',
  USUARIO: 'USUARIO'
};

const DOCUMENT_STATUS = {
  DRAFT: 'DRAFT',
  IN_PROCESS: 'IN_PROCESS',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ARCHIVED: 'ARCHIVED'
};

const WORKFLOW_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED'
};

const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  DOWNLOAD: 'DOWNLOAD',
  SHARE: 'SHARE',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT'
};

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'image/jpeg',
  'image/png'
];

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 52428800; // 50MB

module.exports = {
  ROLES,
  DOCUMENT_STATUS,
  WORKFLOW_STATUS,
  AUDIT_ACTIONS,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE
};
