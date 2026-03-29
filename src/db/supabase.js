const { createClient } = require('@supabase/supabase-js');
const env = require('../config/env');

if (!env.supabaseUrl || !env.supabaseKey) {
  throw new Error('Faltan SUPABASE_URL o SUPABASE_KEY en el archivo .env');
}

const supabase = createClient(env.supabaseUrl, env.supabaseKey);

module.exports = supabase;