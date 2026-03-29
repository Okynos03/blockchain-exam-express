const express = require('express');
const controller = require('../controllers/chain.controller');

const router = express.Router();

router.get('/', controller.getChain);

module.exports = router;