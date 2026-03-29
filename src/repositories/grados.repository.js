const supabase = require('../db/supabase');

async function getAllDegrees() {
  const { data, error } = await supabase
    .from('grados')
    .select('*')
    .order('creado_en', { ascending: true });

  if (error) throw error;
  return data;
}

async function getLastDegree() {
  const { data, error } = await supabase
    .from('grados')
    .select('*')
    .order('creado_en', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function insertDegree(block) {
  const payload = {
    persona_id: block.persona_id,
    institucion_id: block.institucion_id,
    programa_id: block.programa_id,
    fecha_inicio: block.fecha_inicio || null,
    fecha_fin: block.fecha_fin,
    titulo_obtenido: block.titulo_obtenido,
    numero_cedula: block.numero_cedula || null,
    titulo_tesis: block.titulo_tesis || null,
    menciones: block.menciones || null,
    hash_actual: block.hash_actual,
    hash_anterior: block.hash_anterior,
    nonce: block.nonce,
    firmado_por: block.firmado_por
  };

  const { data, error } = await supabase
    .from('grados')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function deleteAllDegrees() {
  const { error } = await supabase
    .from('grados')
    .delete()
    .not('id', 'is', null);

  if (error) throw error;
}

async function insertManyDegrees(blocks) {
  const payload = blocks.map((block) => ({
    id: block.id,
    persona_id: block.persona_id,
    institucion_id: block.institucion_id,
    programa_id: block.programa_id,
    fecha_inicio: block.fecha_inicio || null,
    fecha_fin: block.fecha_fin,
    titulo_obtenido: block.titulo_obtenido,
    numero_cedula: block.numero_cedula || null,
    titulo_tesis: block.titulo_tesis || null,
    menciones: block.menciones || null,
    hash_actual: block.hash_actual,
    hash_anterior: block.hash_anterior,
    nonce: block.nonce,
    firmado_por: block.firmado_por
  }));

  const { error } = await supabase
    .from('grados')
    .insert(payload);

  if (error) throw error;
}

module.exports = {
  getAllDegrees,
  getLastDegree,
  insertDegree,
  deleteAllDegrees,
  insertManyDegrees
};