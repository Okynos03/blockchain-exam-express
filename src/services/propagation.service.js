const axios = require('axios');
const env = require('../config/env');
const peers = require('./peers.service');
const logger = require('../utils/logger');

const http = axios.create({
  timeout: env.requestTimeoutMs
});

async function postToPeer(url, path, payload) {
  try {
    const response = await http.post(`${url}${path}`, payload);
    peers.markSuccess(url);
    return response.data;
  } catch (error) {
    peers.markFailure(url);
    logger.warn('No se pudo propagar a peer', {
      url,
      path,
      error: error.message
    });
    return null;
  }
}

async function getFromPeer(url, path) {
  try {
    const response = await http.get(`${url}${path}`);
    peers.markSuccess(url);
    return response.data;
  } catch (error) {
    peers.markFailure(url);
    logger.warn('No se pudo consultar peer', {
      url,
      path,
      error: error.message
    });
    return null;
  }
}

async function propagateTransaction(transaction) {
  const urls = peers.getUrls();
  await Promise.all(urls.map((url) => postToPeer(url, '/api/internal/transactions', transaction)));
}

async function propagateBlock(block) {
  const urls = peers.getUrls();
  await Promise.all(urls.map((url) => postToPeer(url, '/api/blocks', { block })));
}

async function pingPeer(url) {
  return getFromPeer(url, '/api/ping');
}

async function registerOnBootstrap(bootstrapUrl) {
  return postToPeer(bootstrapUrl, '/api/nodes/register', { node: env.nodeUrl });
}

module.exports = {
  postToPeer,
  getFromPeer,
  propagateTransaction,
  propagateBlock,
  pingPeer,
  registerOnBootstrap
};