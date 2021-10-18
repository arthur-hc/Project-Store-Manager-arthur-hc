const express = require('express');
const productsController = require('../controllers/productsController');

const router = express.Router();

router.post('/', productsController.create);

router.get('/', productsController.getAll);

router.get('/:id', productsController.getById);

router.put('/:id', productsController.updateById);

router.delete('/:id', productsController.deleteById);

module.exports = router;
