const repository = require('../repositories/niveles.repository');

async function getAll(req, res, next) {
  try {
    const data = await repository.getAll();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll };