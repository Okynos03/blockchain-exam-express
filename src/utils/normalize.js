function normalizeDegreeRow(row) {
  return {
    id: row.id,
    persona_id: row.persona_id,
    institucion_id: row.institucion_id,
    programa_id: row.programa_id,
    fecha_inicio: row.fecha_inicio,
    fecha_fin: row.fecha_fin,
    titulo_obtenido: row.titulo_obtenido,
    numero_cedula: row.numero_cedula,
    titulo_tesis: row.titulo_tesis,
    menciones: row.menciones,
    firmado_por: row.firmado_por,
    hash_actual: row.hash_actual,
    hash_anterior: row.hash_anterior,
    nonce: row.nonce,
    creado_en: row.creado_en
  };
}

module.exports = {
  normalizeDegreeRow
};