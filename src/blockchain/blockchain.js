const crypto = require('crypto');
const env = require('../config/env');
const { normalizeDegreeRow } = require('../utils/normalize');

class Blockchain {
  constructor() {
    this.pendingTransactions = [];
    this.difficulty = env.powDifficulty || 3;
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
    const expectedPreviousHash = previousBlock ? previousBlock.hash_actual : '000';

    if (block.hash_anterior !== expectedPreviousHash) {
      return {
        valid: false,
        reason: 'hash_anterior no coincide con el bloque previo'
      };
    }

    const recalculatedHash = this.calculateHashFromData({
      persona_id: block.persona_id,
      institucion_id: block.institucion_id,
      titulo_obtenido: block.titulo_obtenido,
      fecha_fin: block.fecha_fin,
      hash_anterior: block.hash_anterior,
      nonce: block.nonce
    });

    if (recalculatedHash !== block.hash_actual) {
      return {
        valid: false,
        reason: 'hash_actual inválido'
      };
    }

    if (!String(block.hash_actual).startsWith('0'.repeat(this.difficulty))) {
      return {
        valid: false,
        reason: 'proof of work inválido'
      };
    }

    return { valid: true };
  }

  validateChain(chain) {
    if (!Array.isArray(chain) || chain.length === 0) {
      return { valid: true };
    }

    for (let i = 0; i < chain.length; i += 1) {
      const current = normalizeDegreeRow(chain[i]);
      const previous = i === 0 ? null : normalizeDegreeRow(chain[i - 1]);

      const result = this.validateBlock(current, previous);
      if (!result.valid) {
        return result;
      }
    }

    return { valid: true };
  }

  addPendingTransaction(transaction) {
    this.pendingTransactions.push(transaction);
    return this.pendingTransactions;
  }

  getPendingTransactions() {
    return [...this.pendingTransactions];
  }

  clearPendingTransactions() {
    this.pendingTransactions = [];
  }
}

module.exports = new Blockchain();