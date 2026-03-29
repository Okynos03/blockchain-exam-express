const repository = require('../repositories/programas.repository');

async function getAll(req, res, next) {
  try {
    const data = await repository.getAll();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const data = await repository.getById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Programa no encontrado' });
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = await repository.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const data = await repository.update(req.params.id, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await repository.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove };