const productsService = require('../services/productsService');

const create = async (req, res) => {
  const { name, quantity } = req.body;

  const response = await productsService.create(name, quantity);

  if (response.err) {
    return res.status(422).json(response);
  }

  return res.status(201).json(response);
};

module.exports = {
  create,
};