const salesService = require('../services/salesService');

const create = async (req, res) => {
  const products = req.body;

  const response = await salesService.create(products);

  if (response.err && response.err.code === 'invalid_data') {
    return res.status(422).json(response);
  }

  if (response.err && response.err.code === 'stock_problem') {
    return res.status(404).json(response);
  }

  return res.status(200).json(response);
};

const getAll = async (_req, res) => {
  const response = await salesService.getAll();

  return res.status(200).json(response);
};

const getById = async (req, res) => {
  const { id } = req.params;

  const response = await salesService.getById(id);

  if (response.err) {
    return res.status(404).json(response);
  }

  return res.status(200).json(response);
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const products = req.body;

  const response = await salesService.updateById(id, products);

  if (response.err) {
    return res.status(422).json(response);
  }

  return res.status(200).json(response);
};

module.exports = {
  create,
  getAll,
  getById,
  updateById,
};