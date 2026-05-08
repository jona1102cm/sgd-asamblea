const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'sgd_asamblea',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: false
  }
});

sequelize.authenticate()
  .then(() => {
    logger.info('Base de datos conectada exitosamente');
  })
  .catch(err => {
    logger.error('Error al conectar la base de datos:', err);
  });

module.exports = sequelize;
