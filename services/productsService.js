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

module.exports = {
  create,
  getAll,
};