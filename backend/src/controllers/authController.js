const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * Login controller
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validations
    if (!email || !password) {
      return ApiResponse.error(res, 'Email y contraseña son requeridos', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return ApiResponse.error(res, 'Email inválido', 400);
    }

    // TODO: Replace with database query
    // const user = await User.findOne({ where: { email } });
    const user = {
      id: 1,
      email: 'admin@asamblea.gob.ec',
      password: '$2b$10$YIjlrHmMkxJqR7xUqI0rWuXr7m.7ZzO0qE0sZqK7q.q.q.q', // password: admin123
      name: 'Admin User',
      role: 'ADMIN'
    };

    if (!user) {
      logger.warn(`Login attempt with invalid email: ${email}`);
      return ApiResponse.error(res, 'Credenciales inválidas', 401);
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.warn(`Login attempt with invalid password for user: ${email}`);
      return ApiResponse.error(res, 'Credenciales inválidas', 401);
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    logger.info(`User logged in: ${email}`);

    return ApiResponse.success(
      res,
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
      'Login exitoso',
      200
    );
  } catch (err) {
    logger.error('Login error:', err);
    next(err);
  }
};

/**
 * Register controller
 */
const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validations
    if (!email || !password || !name) {
      return ApiResponse.error(res, 'Todos los campos son requeridos', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return ApiResponse.error(res, 'Email inválido', 400);
    }

    // Validate password strength
    if (password.length < 8) {
      return ApiResponse.error(res, 'La contraseña debe tener al menos 8 caracteres', 400);
    }

    // TODO: Replace with database query
    // const existingUser = await User.findOne({ where: { email } });
    // if (existingUser) {
    //   return ApiResponse.error(res, 'El usuario ya existe', 409);
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: Create user in database
    // const newUser = await User.create({
    //   email,
    //   password: hashedPassword,
    //   name,
    //   role: 'USUARIO'
    // });

    const newUser = {
      id: 2,
      email,
      name,
      role: 'USUARIO'
    };

    logger.info(`User registered: ${email}`);

    return ApiResponse.success(
      res,
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      'Registro exitoso',
      201
    );
  } catch (err) {
    logger.error('Register error:', err);
    next(err);
  }
};

/**
 * Refresh token controller
 */
const refreshToken = (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return ApiResponse.error(res, 'Token requerido', 400);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', {
      ignoreExpiration: true
    });

    const newToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    logger.info(`Token refreshed for user: ${decoded.email}`);

    return ApiResponse.success(res, { token: newToken }, 'Token renovado', 200);
  } catch (err) {
    logger.error('Token refresh error:', err);
    next(err);
  }
};

/**
 * Logout controller
 */
const logout = (req, res, next) => {
  try {
    logger.info(`User logged out: ${req.user.email}`);

    return ApiResponse.success(
      res,
      {},
      'Logout exitoso',
      200
    );
  } catch (err) {
    logger.error('Logout error:', err);
    next(err);
  }
};

module.exports = {
  login,
  register,
  refreshToken,
  logout
};
