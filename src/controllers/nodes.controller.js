const peers = require('../services/peers.service');
const propagation = require('../services/propagation.service');
const logger = require('../utils/logger');

async function bootstrapNodes(req, res, next) {
  try {
    const { nodes } = req.body;

    if (!Array.isArray(nodes) || nodes.length === 0) {
      return res.status(400).json({ error: 'Debes enviar un arreglo nodes con al menos una URL' });
    }

    const peerList = peers.addMany(nodes);
    logger.info('Bootstrap completado', { totalPeers: peerList.length });

    return res.json({ peers: peerList });
  } catch (error) {
    return next(error);
  }
}

async function registerNode(req, res, next) {
  try {
    const { node } = req.body;

    if (!node) {
      return res.status(400).json({ error: 'Debes enviar la propiedad node' });
    }

    peers.add(node);
    return res.json({ peers: peers.getUrls() });
  } catch (error) {
    return next(error);
  }
}

async function getPeers(req, res, next) {
  try {
    return res.json({ peers: peers.getAll() });
  } catch (error) {
    return next(error);
  }
}

async function resolveNodes(req, res, next) {
  try {
    const consensus = require('../services/consensus.service');
    const result = await consensus.resolveConflicts();
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function ping(req, res) {
  return res.json({ status: 'ok' });
}

async function joinBootstrap(req, res, next) {
  try {
    const { bootstrapUrl } = req.body;
    if (!bootstrapUrl) {
      return res.status(400).json({ error: 'Debes enviar bootstrapUrl' });
    }

    const response = await propagation.registerOnBootstrap(bootstrapUrl);
    if (response?.peers) {
      peers.addMany(response.peers);
      peers.add(bootstrapUrl);
    }

    return res.json({
      message: 'Nodo registrado en bootstrap',
      peers: peers.getAll()
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  bootstrapNodes,
  registerNode,
  getPeers,
  resolveNodes,
  ping,
  joinBootstrap
};