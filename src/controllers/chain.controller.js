const degreeService = require('../services/degree.service');

async function getChain(req, res, next) {
  try {
    const chain = await degreeService.getChain();
    return res.json({
      length: chain.length,
      chain
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getChain
};