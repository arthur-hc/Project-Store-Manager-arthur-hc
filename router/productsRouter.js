const express = require('express');
const productsController = require('../controllers/productsController');

const router = express.Router();

router.post('/', productsController.create);

module.exports = router;
