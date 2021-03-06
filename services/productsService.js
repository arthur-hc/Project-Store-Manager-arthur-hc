const Joi = require('joi');
const productsModel = require('../models/productsModel');

const create = async (name, quantity) => {
  const bodyData = { name, quantity };

  const { error } = Joi.object({
    name: Joi.string().min(5).not().empty()
    .required(),
    quantity: Joi.number().integer().min(1).not()
    .empty()
    .required(),
  }).validate(bodyData);
  
  if (error) {
    return { err: { code: 'invalid_data', message: error.details[0].message } };
  }

  const productExists = await productsModel.findOneByName(name);
  if (productExists) {
    return { err: { code: 'invalid_data', message: 'Product already exists' } };
  }

  const response = await productsModel.create(name, quantity);

  return response;
};

const getAll = async () => {
  const response = await productsModel.getAll();

  return { products: response };
};

const getById = async (id) => {
  const response = await productsModel.getById(id);

  if (!response) {
    return { err: { code: 'not_found', message: 'Product not found' } };
  }

  if (response.message) {
    return { err: { code: 'invalid_data', message: 'Wrong id format' } };
  }

  return response;
};

const updateById = async (id, name, quantity) => {
  const bodyData = { name, quantity };

  const { error } = Joi.object({
    name: Joi.string().min(5).not().empty()
    .required(),
    quantity: Joi.number().integer().min(1).not()
    .empty()
    .required(),
  }).validate(bodyData);

  if (error) {
    return { err: { code: 'invalid_data', message: error.details[0].message } };
  }

  const productExists = await productsModel.getById(id);
  if (!productExists) {
    return { err: { code: 'not_found', message: 'Product not found' } };
  }

  const response = await productsModel.updateById(id, name, quantity);

  return response;
};

const deleteById = async (id) => {
  const productExists = await productsModel.getById(id);
  if (!productExists) {
    return { err: { code: 'not_found', message: 'Product not found' } };
  }

  const response = await productsModel.deleteById(id);

  if (response.message) {
    return { err: { code: 'invalid_data', message: 'Wrong id format' } };
  }

  return productExists;
};

const findOneByName = async (name) => {
  const response = await productsModel.findOneByName(name);

  return response;
};

module.exports = {
  create,
  findOneByName,
  getAll,
  getById,
  updateById,
  deleteById,
};