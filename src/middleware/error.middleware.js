const logger = require('../utils/logger');

module.exports = function errorHandler(err, req, res, next) {
  logger.error('Error no controlado', {
    message: err.message,
    stack: err.stack
  });

  return res.status(500).json({
    error: 'Error interno del servidor',
    detail: err.message
  });
};