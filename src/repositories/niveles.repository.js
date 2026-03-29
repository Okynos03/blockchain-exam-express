const supabase = require('../db/supabase');

async function getAll() {
  const { data, error } = await supabase.from('niveles_grado').select('*').order('id');
  if (error) throw error;
  return data;
}

module.exports = { getAll };