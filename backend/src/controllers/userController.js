const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');
const { ROLES } = require('../utils/constants');

/**
 * Get all users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, active } = req.query;

    // TODO: Replace with database query
    // const users = await User.findAll({
    //   where: { ...(role && { role }), ...(active && { active }) },
    //   limit: parseInt(limit),
    //   offset: (parseInt(page) - 1) * parseInt(limit)
    // });

    const users = [
      {
        id: 1,
        email: 'admin@asamblea.gob.ec',
        name: 'Admin User',
        role: ROLES.ADMIN,
        active: true,
        createdAt: '2026-01-15',
        updatedAt: '2026-01-15'
      },
      {
        id: 2,
        email: 'director@asamblea.gob.ec',
        name: 'Director',
        role: ROLES.DIRECTOR,
        active: true,
        createdAt: '2026-01-15',
        updatedAt: '2026-01-15'
      },
      {
        id: 3,
        email: 'usuario@asamblea.gob.ec',
        name: 'Usuario Normal',
        role: ROLES.USUARIO,
        active: true,
        createdAt: '2026-02-01',
        updatedAt: '2026-02-01'
      }
    ];

    const total = users.length;
    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    };

    logger.info(`Users list retrieved by ${req.user.email} - Page: ${page}`);

    return ApiResponse.paginated(res, users, pagination, 'Usuarios obtenidos correctamente', 200);
  } catch (err) {
    logger.error('Get all users error:', err);
    next(err);
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return ApiResponse.error(res, 'ID de usuario inválido', 400);
    }

    // Check authorization
    if (req.user.id !== parseInt(id) && req.user.role !== ROLES.ADMIN) {
      logger.warn(`Unauthorized access attempt to user ${id} by ${req.user.email}`);
      return ApiResponse.error(res, 'No tiene permiso para acceder a este usuario', 403);
    }

    // TODO: Replace with database query
    // const user = await User.findByPk(id);
    const user = {
      id: parseInt(id),
      email: 'user@asamblea.gob.ec',
      name: 'User Name',
      role: ROLES.USUARIO,
      active: true,
      createdAt: '2026-01-15',
      updatedAt: '2026-01-15',
      department: 'Departamento de Documentos',
      phone: '+593-XXX-XXXX'
    };

    if (!user) {
      return ApiResponse.error(res, 'Usuario no encontrado', 404);
    }

    logger.info(`User ${id} retrieved by ${req.user.email}`);

    return ApiResponse.success(res, user, 'Usuario obtenido correctamente', 200);
  } catch (err) {
    logger.error('Get user by ID error:', err);
    next(err);
  }
};

/**
 * Create new user (Admin only)
 */
const createUser = async (req, res, next) => {
  try {
    const { email, password, name, role, department } = req.body;

    // Validations
    if (!email || !password || !name || !role) {
      return ApiResponse.error(res, 'Email, contraseña, nombre y rol son requeridos', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return ApiResponse.error(res, 'Email inválido', 400);
    }

    // Validate role
    if (!Object.values(ROLES).includes(role)) {
      return ApiResponse.error(res, 'Rol inválido', 400);
    }

    // Validate password strength
    if (password.length < 8) {
      return ApiResponse.error(res, 'La contraseña debe tener al menos 8 caracteres', 400);
    }

    // TODO: Check if user exists
    // const existingUser = await User.findOne({ where: { email } });
    // if (existingUser) {
    //   return ApiResponse.error(res, 'El usuario ya existe', 409);
    // }

    // TODO: Hash password and create user
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const newUser = await User.create({
    //   email,
    //   password: hashedPassword,
    //   name,
    //   role,
    //   department,
    //   active: true
    // });

    const newUser = {
      id: 4,
      email,
      name,
      role,
      department,
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    logger.info(`User created by ${req.user.email}: ${email}`);

    return ApiResponse.success(res, newUser, 'Usuario creado correctamente', 201);
  } catch (err) {
    logger.error('Create user error:', err);
    next(err);
  }
};

/**
 * Update user
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, department, phone } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
      return ApiResponse.error(res, 'ID de usuario inválido', 400);
    }

    // Check authorization
    if (req.user.id !== parseInt(id) && req.user.role !== ROLES.ADMIN) {
      logger.warn(`Unauthorized update attempt to user ${id} by ${req.user.email}`);
      return ApiResponse.error(res, 'No tiene permiso para actualizar este usuario', 403);
    }

    // Validate required fields
    if (!name || !email) {
      return ApiResponse.error(res, 'Nombre y email son requeridos', 400);
    }

    // TODO: Update user in database
    // const user = await User.findByPk(id);
    // if (!user) {
    //   return ApiResponse.error(res, 'Usuario no encontrado', 404);
    // }
    // await user.update({ name, email, department, phone });

    const updatedUser = {
      id: parseInt(id),
      email,
      name,
      role: ROLES.USUARIO,
      department,
      phone,
      active: true,
      createdAt: '2026-01-15',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    logger.info(`User ${id} updated by ${req.user.email}`);

    return ApiResponse.success(res, updatedUser, 'Usuario actualizado correctamente', 200);
  } catch (err) {
    logger.error('Update user error:', err);
    next(err);
  }
};

/**
 * Delete user (Admin only)
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return ApiResponse.error(res, 'ID de usuario inválido', 400);
    }

    // Prevent self deletion
    if (req.user.id === parseInt(id)) {
      return ApiResponse.error(res, 'No puede eliminar su propia cuenta', 400);
    }

    // TODO: Delete user from database
    // const user = await User.findByPk(id);
    // if (!user) {
    //   return ApiResponse.error(res, 'Usuario no encontrado', 404);
    // }
    // await user.destroy();

    logger.info(`User ${id} deleted by ${req.user.email}`);

    return ApiResponse.success(res, { id: parseInt(id) }, 'Usuario eliminado correctamente', 200);
  } catch (err) {
    logger.error('Delete user error:', err);
    next(err);
  }
};

/**
 * Change user role (Admin only)
 */
const changeUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
      return ApiResponse.error(res, 'ID de usuario inválido', 400);
    }

    // Validate role
    if (!role || !Object.values(ROLES).includes(role)) {
      return ApiResponse.error(res, 'Rol inválido', 400);
    }

    // TODO: Update user role in database
    // const user = await User.findByPk(id);
    // if (!user) {
    //   return ApiResponse.error(res, 'Usuario no encontrado', 404);
    // }
    // await user.update({ role });

    logger.info(`User ${id} role changed to ${role} by ${req.user.email}`);

    return ApiResponse.success(
      res,
      { id: parseInt(id), role },
      'Rol de usuario actualizado correctamente',
      200
    );
  } catch (err) {
    logger.error('Change user role error:', err);
    next(err);
  }
};

/**
 * Deactivate user (Admin only)
 */
const deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return ApiResponse.error(res, 'ID de usuario inválido', 400);
    }

    // Prevent self deactivation
    if (req.user.id === parseInt(id)) {
      return ApiResponse.error(res, 'No puede desactivar su propia cuenta', 400);
    }

    // TODO: Deactivate user in database
    // const user = await User.findByPk(id);
    // if (!user) {
    //   return ApiResponse.error(res, 'Usuario no encontrado', 404);
    // }
    // await user.update({ active: false });

    logger.info(`User ${id} deactivated by ${req.user.email}`);

    return ApiResponse.success(
      res,
      { id: parseInt(id), active: false },
      'Usuario desactivado correctamente',
      200
    );
  } catch (err) {
    logger.error('Deactivate user error:', err);
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  deactivateUser
};
