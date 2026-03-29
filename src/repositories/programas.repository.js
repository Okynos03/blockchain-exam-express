const supabase = require('../db/supabase');

async function getAll() {
  const { data, error } = await supabase.from('programas').select('*').order('creado_en');
  if (error) throw error;
  return data;
}

async function getById(id) {
  const { data, error } = await supabase.from('programas').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

async function create(payload) {
  const { data, error } = await supabase.from('programas').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

async function update(id, payload) {
  const { data, error } = await supabase.from('programas').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

async function remove(id) {
  const { error } = await supabase.from('programas').delete().eq('id', id);
  if (error) throw error;
}

module.exports = { getAll, getById, create, update, remove };