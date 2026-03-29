module.exports = function notFound(req, res) {
  return res.status(404).json({ error: 'Endpoint no encontrado' });
};