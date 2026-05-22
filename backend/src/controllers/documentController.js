const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');
const { DOCUMENT_STATUS, ROLES } = require('../utils/constants');

/**
 * Get all documents
 */
const getAllDocuments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, userId, search } = req.query;

    // TODO: Replace with database query
    // const documents = await Document.findAll({
    //   where: { ...(status && { status }), ...(userId && { ownerId: userId }) },
    //   limit: parseInt(limit),
    //   offset: (parseInt(page) - 1) * parseInt(limit),
    //   include: ['owner']
    // });

    const documents = [
      {
        id: 1,
        title: 'Propuesta de Enmienda Constitucional',
        description: 'Enmienda relacionada con derechos civiles',
        status: DOCUMENT_STATUS.APPROVED,
        owner: { id: 1, name: 'Admin User' },
        fileUrl: '/documents/doc-1.pdf',
        createdAt: '2026-05-10',
        updatedAt: '2026-05-11'
      },
      {
        id: 2,
        title: 'Proyecto de Ley de Tributación',
        description: 'Reforma tributaria para el 2026',
        status: DOCUMENT_STATUS.IN_PROCESS,
        owner: { id: 2, name: 'Director' },
        fileUrl: '/documents/doc-2.pdf',
        createdAt: '2026-05-09',
        updatedAt: '2026-05-12'
      }
    ];

    const total = documents.length;
    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    };

    logger.info(`Documents list retrieved by ${req.user.email} - Page: ${page}, Status: ${status}`);

    return ApiResponse.paginated(res, documents, pagination, 'Documentos obtenidos correctamente', 200);
  } catch (err) {
    logger.error('Get all documents error:', err);
    next(err);
  }
};

/**
 * Create new document
 */
const createDocument = async (req, res, next) => {
  try {
    const { title, description, content, category } = req.body;

    // Validation
    if (!title || !description) {
      return ApiResponse.error(res, 'Título y descripción son requeridos', 400);
    }

    // Validate title length
    if (title.length < 5 || title.length > 255) {
      return ApiResponse.error(res, 'El título debe tener entre 5 y 255 caracteres', 400);
    }

    // TODO: Create document in database
    // const newDocument = await Document.create({
    //   title,
    //   description,
    //   content,
    //   category,
    //   status: DOCUMENT_STATUS.DRAFT,
    //   ownerId: req.user.id
    // });

    const newDocument = {
      id: 3,
      title,
      description,
      content: content || '',
      category: category || 'General',
      status: DOCUMENT_STATUS.DRAFT,
      owner: { id: req.user.id, name: req.user.name },
      fileUrl: `/documents/doc-3.pdf`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    logger.info(`Document created by ${req.user.email}: "${title}"`);

    return ApiResponse.success(res, newDocument, 'Documento creado correctamente', 201);
  } catch (err) {
    logger.error('Create document error:', err);
    next(err);
  }
};

/**
 * Get document by ID
 */
const getDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return ApiResponse.error(res, 'ID de documento inválido', 400);
    }

    // TODO: Replace with database query
    // const document = await Document.findByPk(id, { include: ['owner'] });

    const document = {
      id: parseInt(id),
      title: 'Propuesta de Enmienda Constitucional',
      description: 'Enmienda relacionada con derechos civiles',
      content: 'Contenido detallado del documento...',
      category: 'Legislativo',
      status: DOCUMENT_STATUS.APPROVED,
      owner: { id: 1, name: 'Admin User' },
      fileUrl: '/documents/doc-1.pdf',
      versions: [
        {
          id: 1,
          version: 1,
          createdAt: '2026-05-10',
          createdBy: { id: 1, name: 'Admin User' }
        }
      ],
      comments: [
        {
          id: 1,
          author: { id: 2, name: 'Director' },
          text: 'Excelente propuesta',
          createdAt: '2026-05-11'
        }
      ],
      createdAt: '2026-05-10',
      updatedAt: '2026-05-11'
    };

    if (!document) {
      return ApiResponse.error(res, 'Documento no encontrado', 404);
    }

    logger.info(`Document ${id} retrieved by ${req.user.email}`);

    return ApiResponse.success(res, document, 'Documento obtenido correctamente', 200);
  } catch (err) {
    logger.error('Get document by ID error:', err);
    next(err);
  }
};

/**
 * Update document
 */
const updateDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, content, category } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
      return ApiResponse.error(res, 'ID de documento inválido', 400);
    }

    // Validate required fields
    if (!title || !description) {
      return ApiResponse.error(res, 'Título y descripción son requeridos', 400);
    }

    // TODO: Check document ownership and update
    // const document = await Document.findByPk(id);
    // if (!document) {
    //   return ApiResponse.error(res, 'Documento no encontrado', 404);
    // }
    // if (document.ownerId !== req.user.id && req.user.role !== ROLES.ADMIN) {
    //   return ApiResponse.error(res, 'No tiene permiso para editar este documento', 403);
    // }
    // await document.update({ title, description, content, category });

    const updatedDocument = {
      id: parseInt(id),
      title,
      description,
      content: content || '',
      category: category || 'General',
      status: DOCUMENT_STATUS.IN_PROCESS,
      owner: { id: req.user.id, name: req.user.name },
      fileUrl: `/documents/doc-${id}.pdf`,
      createdAt: '2026-05-10',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    logger.info(`Document ${id} updated by ${req.user.email}`);

    return ApiResponse.success(res, updatedDocument, 'Documento actualizado correctamente', 200);
  } catch (err) {
    logger.error('Update document error:', err);
    next(err);
  }
};

/**
 * Delete document
 */
const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return ApiResponse.error(res, 'ID de documento inválido', 400);
    }

    // TODO: Check document ownership and delete
    // const document = await Document.findByPk(id);
    // if (!document) {
    //   return ApiResponse.error(res, 'Documento no encontrado', 404);
    // }
    // if (document.ownerId !== req.user.id && req.user.role !== ROLES.ADMIN) {
    //   return ApiResponse.error(res, 'No tiene permiso para eliminar este documento', 403);
    // }
    // await document.destroy();

    logger.info(`Document ${id} deleted by ${req.user.email}`);

    return ApiResponse.success(res, { id: parseInt(id) }, 'Documento eliminado correctamente', 200);
  } catch (err) {
    logger.error('Delete document error:', err);
    next(err);
  }
};

/**
 * Approve document
 */
const approveDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
      return ApiResponse.error(res, 'ID de documento inválido', 400);
    }

    // TODO: Update document status to approved
    // const document = await Document.findByPk(id);
    // if (!document) {
    //   return ApiResponse.error(res, 'Documento no encontrado', 404);
    // }
    // await document.update({ status: DOCUMENT_STATUS.APPROVED });

    logger.info(`Document ${id} approved by ${req.user.email}`);

    return ApiResponse.success(
      res,
      { id: parseInt(id), status: DOCUMENT_STATUS.APPROVED },
      'Documento aprobado correctamente',
      200
    );
  } catch (err) {
    logger.error('Approve document error:', err);
    next(err);
  }
};

/**
 * Reject document
 */
const rejectDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
      return ApiResponse.error(res, 'ID de documento inválido', 400);
    }

    // Validate reason
    if (!reason) {
      return ApiResponse.error(res, 'La razón del rechazo es requerida', 400);
    }

    // TODO: Update document status to rejected
    // const document = await Document.findByPk(id);
    // if (!document) {
    //   return ApiResponse.error(res, 'Documento no encontrado', 404);
    // }
    // await document.update({ status: DOCUMENT_STATUS.REJECTED, rejectionReason: reason });

    logger.info(`Document ${id} rejected by ${req.user.email}. Reason: ${reason}`);

    return ApiResponse.success(
      res,
      { id: parseInt(id), status: DOCUMENT_STATUS.REJECTED },
      'Documento rechazado correctamente',
      200
    );
  } catch (err) {
    logger.error('Reject document error:', err);
    next(err);
  }
};

/**
 * Add comment to document
 */
const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
      return ApiResponse.error(res, 'ID de documento inválido', 400);
    }

    // Validate comment text
    if (!text || text.length === 0) {
      return ApiResponse.error(res, 'El comentario no puede estar vacío', 400);
    }

    // TODO: Create comment in database
    // const comment = await Comment.create({
    //   text,
    //   documentId: id,
    //   userId: req.user.id
    // });

    const comment = {
      id: 1,
      text,
      author: { id: req.user.id, name: req.user.name },
      createdAt: new Date().toISOString()
    };

    logger.info(`Comment added to document ${id} by ${req.user.email}`);

    return ApiResponse.success(res, comment, 'Comentario agregado correctamente', 201);
  } catch (err) {
    logger.error('Add comment error:', err);
    next(err);
  }
};

/**
 * Get document history/versions
 */
const getDocumentHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return ApiResponse.error(res, 'ID de documento inválido', 400);
    }

    // TODO: Get document versions from database
    // const versions = await DocumentVersion.findAll({
    //   where: { documentId: id },
    //   order: [['createdAt', 'DESC']]
    // });

    const versions = [
      {
        id: 1,
        version: 1,
        title: 'Propuesta de Enmienda Constitucional',
        createdAt: '2026-05-10',
        createdBy: { id: 1, name: 'Admin User' },
        changes: 'Versión inicial'
      },
      {
        id: 2,
        version: 2,
        title: 'Propuesta de Enmienda Constitucional - Revisada',
        createdAt: '2026-05-11',
        createdBy: { id: 2, name: 'Director' },
        changes: 'Se agregaron comentarios de revisión'
      }
    ];

    logger.info(`Document ${id} history retrieved by ${req.user.email}`);

    return ApiResponse.success(res, versions, 'Historial del documento obtenido correctamente', 200);
  } catch (err) {
    logger.error('Get document history error:', err);
    next(err);
  }
};

module.exports = {
  getAllDocuments,
  createDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
  approveDocument,
  rejectDocument,
  addComment,
  getDocumentHistory
};
