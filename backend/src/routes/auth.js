const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

// Mock user database (replace with actual database queries)
const users = [
  {
    id: 1,
    email: 'admin@asamblea.gob.ec',
    password: '$2b$10$YIjlrHmMkxJqR7xUqI0rWuXr7m.7ZzO0qE0sZqK7q.q.q.q.q', // password: admin123
    name: 'Admin User',
    role: 'ADMIN'
  }
];

/**
 * POST /api/auth/login
 * Login endpoint
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validations
    if (!email || !password) {
      return ApiResponse.error(res, 'Email y contraseña son requeridos', 400);
    }

    // Find user
    const user = users.find(u => u.email === email);
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
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    logger.info(`User logged in: ${email}`);

    return ApiResponse.success(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }, 'Login exitoso', 200);
  } catch (err) {
    logger.error('Login error:', err);
    next(err);
  }
});

/**
 * POST /api/auth/register
 * Register endpoint
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validations
    if (!email || !password || !name) {
      return ApiResponse.error(res, 'Todos los campos son requeridos', 400);
    }

    // Check if user exists
    if (users.find(u => u.email === email)) {
      return ApiResponse.error(res, 'El usuario ya existe', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (mock)
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      role: 'USUARIO'
    };

    users.push(newUser);

    logger.info(`User registered: ${email}`);

    return ApiResponse.success(res, {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    }, 'Registro exitoso', 201);
  } catch (err) {
    logger.error('Register error:', err);
    next(err);
  }
});

/**
 * POST /api/auth/refresh
 * Refresh token endpoint
 */
router.post('/refresh', (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return ApiResponse.error(res, 'Token requerido', 400);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

    const newToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return ApiResponse.success(res, { token: newToken }, 'Token renovado', 200);
  } catch (err) {
    logger.error('Token refresh error:', err);
    next(err);
  }
});

module.exports = router;
