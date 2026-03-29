const blockchain = require('../blockchain/blockchain');
const gradosRepository = require('../repositories/grados.repository');
const logger = require('../utils/logger');

async function getChain() {
  return gradosRepository.getAllDegrees();
}

async function buildMinedBlock(transaction) {
  const lastDegree = await gradosRepository.getLastDegree();
  const previousHash = lastDegree ? lastDegree.hash_actual : '0';

  const { nonce, hash_actual, hash_anterior } = blockchain.proofOfWork(transaction, previousHash);

  return {
    ...transaction,
    nonce,
    hash_actual,
    hash_anterior
  };
}

async function mineFirstPendingBlock() {
  const pending = blockchain.getPendingTransactions();

  if (pending.length === 0) {
    return null;
  }

  const transaction = pending[0];
  const block = await buildMinedBlock(transaction);
  const inserted = await gradosRepository.insertDegree(block);
  blockchain.pendingTransactions.shift();

  logger.info('Bloque minado localmente', {
    hash_actual: inserted.hash_actual,
    persona_id: inserted.persona_id
  });

  return inserted;
}

async function acceptExternalBlock(block) {
  const chain = await gradosRepository.getAllDegrees();
  const previousBlock = chain.length > 0 ? chain[chain.length - 1] : null;
  const validation = blockchain.validateBlock(block, previousBlock);

  if (!validation.valid) {
    return validation;
  }

  await gradosRepository.insertDegree(block);
  return { valid: true };
}

module.exports = {
  getChain,
  buildMinedBlock,
  mineFirstPendingBlock,
  acceptExternalBlock
};