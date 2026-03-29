const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
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

app.get('/', (req, res) => {
  res.json({
    message: 'Academic blockchain node active',
    docs: '/docs'
  });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/nodes', nodesRoutes);
app.use('/transactions', transactionsRoutes);
app.post('/internal/transactions', transactionsController.receiveInternalTransaction);
app.post('/mine', blocksController.mineBlock);
app.use('/blocks', blocksRoutes);
app.use('/chain', chainRoutes);
app.use('/ping', healthRoutes);
app.use('/personas', personasRoutes);
app.use('/instituciones', institucionesRoutes);
app.use('/programas', programasRoutes);
app.use('/niveles-grado', nivelesRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;