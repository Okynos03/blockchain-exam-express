const express = require('express');
const controller = require('../controllers/transactions.controller');

const router = express.Router();

router.post('/', controller.createTransaction);

module.exports = router;