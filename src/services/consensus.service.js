const peers = require('./peers.service');
const propagation = require('./propagation.service');
const blockchain = require('../blockchain/blockchain');
const logger = require('../utils/logger');
const gradosRepository = require('../repositories/grados.repository');

async function resolveConflicts() {
  const peerUrls = peers.getUrls();
  const localChain = await gradosRepository.getAllDegrees();
  let bestChain = localChain;
  let replaced = false;

  for (const peerUrl of peerUrls) {
    const data = await propagation.getFromPeer(peerUrl, '/api/chain');
    if (!data || !Array.isArray(data.chain)) continue;

    if (data.chain.length > bestChain.length) {
      const validation = blockchain.validateChain(data.chain);
      if (validation.valid) {
        bestChain = data.chain;
        replaced = true;
      }
    }
  }

  logger.info('Consensus ejecutado', {
    localLength: localChain.length,
    bestLength: bestChain.length,
    replaced
  });

  return {
    replaced,
    chain: bestChain,
    message: replaced
      ? 'La cadena local debe ser reemplazada por una más larga y válida'
      : 'La cadena local ya es la más larga válida'
  };
}

module.exports = {
  resolveConflicts
};