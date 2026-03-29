const express = require('express');
const controller = require('../controllers/nodes.controller');

const router = express.Router();

router.post('/bootstrap', controller.bootstrapNodes);
router.post('/register', controller.registerNode);
router.post('/join', controller.joinBootstrap);
router.get('/', controller.getPeers);
router.get('/resolve', controller.resolveNodes);

module.exports = router;