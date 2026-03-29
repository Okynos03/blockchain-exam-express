const blockchain = require('../blockchain/blockchain');
const { validateTransaction } = require('../utils/validators');
const propagation = require('../services/propagation.service');
const logger = require('../utils/logger');

async function createTransaction(req, res, next) {
  try {
    const transaction = req.body;
    const validation = validateTransaction(transaction);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    blockchain.addPendingTransaction(transaction);
    await propagation.propagateTransaction(transaction);

    logger.info('Transacción recibida y propagada', {
      persona_id: transaction.persona_id,
      titulo_obtenido: transaction.titulo_obtenido
    });

    return res.json({
      message: 'Transaction accepted',
      pending: blockchain.getPendingTransactions().length
    });
  } catch (error) {
    return next(error);
  }
}

async function receiveInternalTransaction(req, res, next) {
  try {
    const transaction = req.body;
    const validation = validateTransaction(transaction);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    blockchain.addPendingTransaction(transaction);

    logger.info('Transacción propagada recibida', {
      persona_id: transaction.persona_id,
      titulo_obtenido: transaction.titulo_obtenido
    });

    return res.json({ message: 'Transaction processed' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createTransaction,
  receiveInternalTransaction
};