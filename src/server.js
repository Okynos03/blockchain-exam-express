const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');

app.listen(env.port, () => {
  logger.info('Servidor iniciado', {
    port: env.port,
    nodeUrl: env.nodeUrl,
    difficulty: env.powDifficulty
  });
});