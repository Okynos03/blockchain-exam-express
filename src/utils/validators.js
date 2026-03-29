function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateTransaction(transaction = {}) {
  const required = [
    'persona_id',
    'institucion_id',
    'programa_id',
    'fecha_fin',
    'titulo_obtenido',
    'firmado_por'
  ];

  const missing = required.filter((field) => !isNonEmptyString(String(transaction[field] ?? '')).valueOf());

  if (missing.length > 0) {
    return {
      valid: false,
      error: `Faltan campos requeridos: ${missing.join(', ')}`
    };
  }

  return { valid: true };
}

function normalizeNodeUrl(url = '') {
  return String(url).trim().replace(/\/+$/, '');
}

module.exports = {
  validateTransaction,
  normalizeNodeUrl
};