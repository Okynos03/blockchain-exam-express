const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const nodesRoutes = require('./routes/nodes.routes');
const transactionsRoutes = require('./routes/transactions.routes');
const blocksRoutes = require('./routes/blocks.routes');
const chainRoutes = require('./routes/chain.routes');
const healthRoutes = require('./routes/health.routes');
const personasRoutes = require('./routes/personas.routes');
const institucionesRoutes = require('./routes/instituciones.routes');
const programasRoutes = require('./routes/programas.routes');
const nivelesRoutes = require('./routes/niveles.routes');
const transactionsController = require('./controllers/transactions.controller');
const blocksController = require('./controllers/blocks.controller');
const notFound = require('./middleware/notfound.middleware');
const errorHandler = require('./middleware/error.middleware');

const swaggerDocument = YAML.load('./openapi.yaml');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const apiPrefix = '/api';

app.use(`${apiPrefix}/nodes`, nodesRoutes);
app.use(`${apiPrefix}/transactions`, transactionsRoutes);
app.post(`${apiPrefix}/internal/transactions`, transactionsController.receiveInternalTransaction);
app.post(`${apiPrefix}/mine`, blocksController.mineBlock);
app.use(`${apiPrefix}/blocks`, blocksRoutes);
app.use(`${apiPrefix}/chain`, chainRoutes);
app.use(`${apiPrefix}/ping`, healthRoutes);
app.use(`${apiPrefix}/personas`, personasRoutes);
app.use(`${apiPrefix}/instituciones`, institucionesRoutes);
app.use(`${apiPrefix}/programas`, programasRoutes);
app.use(`${apiPrefix}/niveles-grado`, nivelesRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;