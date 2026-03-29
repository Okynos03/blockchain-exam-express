const degreeService = require('../services/degree.service');
const propagation = require('../services/propagation.service');
const logger = require('../utils/logger');

async function mineBlock(req, res, next) {
  try {
    const block = await degreeService.mineFirstPendingBlock();

    if (!block) {
      return res.status(400).json({ error: 'No hay transacciones pendientes para minar' });
    }

    await propagation.propagateBlock(block);

    logger.info('Bloque minado y propagado', {
      hash_actual: block.hash_actual
    });

    return res.json({ block });
  } catch (error) {
    return next(error);
  }
}

async function receiveBlock(req, res, next) {
  try {
    const { block } = req.body;

    if (!block) {
      return res.status(400).json({ error: 'Debes enviar un objeto block' });
    }

    const result = await degreeService.acceptExternalBlock(block);
    if (!result.valid) {
      
      return res.status(409).json({ error: result.reason });
    }

    logger.info('Bloque externo aceptado', {
      hash_actual: block.hash_actual
    });

    return res.json({ message: 'Block accepted' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  mineBlock,
  receiveBlock
};