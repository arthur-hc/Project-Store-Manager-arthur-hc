const productsService = require('../services/productsService');

const create = async (req, res) => {
  const { name, quantity } = req.body;

  const response = await productsService.create(name, quantity);

  if (response.err) {
    return res.status(422).json(response);
  }

  return res.status(201).json(response);
};

const getAll = async (_req, res) => {
  const response = await productsService.getAll();

  return res.status(200).json(response);
};

const getById = async (req, res) => {
  const { id } = req.params;

  const response = await productsService.getById(id);

  if (response.err) {
    return res.status(422).json(response);
  }

  return res.status(200).json(response);
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;

  const response = await productsService.updateById(id, name, quantity);

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