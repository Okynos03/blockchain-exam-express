require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 8001),
  nodeUrl: process.env.NODE_URL || `http://localhost:${process.env.PORT || 8001}`,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
  powDifficulty: Number(process.env.POW_DIFFICULTY || 3),
  requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS || 5000)
};