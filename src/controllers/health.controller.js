function ping(req, res) {
  return res.json({ status: 'ok' });
}

module.exports = { ping };