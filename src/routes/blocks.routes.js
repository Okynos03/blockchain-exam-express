const express = require('express');
const controller = require('../controllers/blocks.controller');

const router = express.Router();

router.post('/', controller.receiveBlock);

module.exports = router;