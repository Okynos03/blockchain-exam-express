const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');

app.listen(env.port, '0.0.0.0', () => {
  logger.info('Servidor iniciado', {
    port: env.port,
    nodeUrl: env.nodeUrl,
    difficulty: env.powDifficulty
  });
});