const { normalizeNodeUrl } = require('../utils/validators');
const env = require('../config/env');

class PeerStore {
  constructor() {
    this.peers = new Map();
  }

  add(url) {
    const normalized = normalizeNodeUrl(url);
    if (!normalized || normalized === normalizeNodeUrl(env.nodeUrl)) return null;

    const existing = this.peers.get(normalized);
    if (existing) {
      existing.lastSeen = Date.now();
      this.peers.set(normalized, existing);
      return existing;
    }

    const peer = {
      url: normalized,
      lastSeen: Date.now(),
      failures: 0
    };

    this.peers.set(normalized, peer);
    return peer;
  }

  addMany(nodes = []) {
    nodes.forEach((node) => this.add(node));
    return this.getAll();
  }

  markSuccess(url) {
    const normalized = normalizeNodeUrl(url);
    const peer = this.peers.get(normalized);
    if (!peer) return;
    peer.lastSeen = Date.now();
    peer.failures = 0;
    this.peers.set(normalized, peer);
  }

  markFailure(url) {
    const normalized = normalizeNodeUrl(url);
    const peer = this.peers.get(normalized);
    if (!peer) return;
    peer.failures += 1;
    this.peers.set(normalized, peer);
  }

  getAll() {
    return Array.from(this.peers.values());
  }

  getUrls() {
    return this.getAll().map((peer) => peer.url);
  }
}

module.exports = new PeerStore();