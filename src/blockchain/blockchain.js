const crypto = require('crypto');
const env = require('../config/env');
const { normalizeDegreeRow } = require('../utils/normalize');

class Blockchain {
  constructor() {
    this.pendingTransactions = [];
    this.difficulty = env.powDifficulty;
  }

  calculateHashFromData({
    persona_id,
    institucion_id,
    titulo_obtenido,
    fecha_fin,
    hash_anterior,
    nonce
  }) {
    const payload = [
      persona_id || '',
      institucion_id || '',
      titulo_obtenido || '',
      fecha_fin || '',
      hash_anterior || '',
      String(nonce ?? '')
    ].join('|');

    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  proofOfWork(transaction, previousHash) {
    let nonce = 0;
    let hash = '';

    do {
      hash = this.calculateHashFromData({
        ...transaction,
        hash_anterior: previousHash,
        nonce
      });
      nonce += 1;
    } while (!hash.startsWith('0'.repeat(this.difficulty)));

    return {
      nonce: nonce - 1,
      hash_actual: hash,
      hash_anterior: previousHash
    };
  }

  validateBlock(block, previousBlock) {
    const previousHash = previousBlock ? previousBlock.hash_actual : null;
module.exports = new Blockchain();