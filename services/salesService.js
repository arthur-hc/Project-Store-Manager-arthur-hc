const Joi = require('joi');
const { ObjectId } = require('mongodb');
const productsModel = require('../models/productsModel');
const salesModel = require('../models/salesModel');

const inputProductsQuantityValidation = (products) => Joi.array().items(Joi.object({
  productId: Joi.allow(),
  quantity: Joi.number().integer().min(1).not()
  .empty()
  .required(),
})).validate(products);

const availableProductsValidation = async (products) => {
  // FONT:
  // AWAIT MULTIPLE DB QUERIES: https://stackoverflow.com/questions/54548212/use-of-async-await-to-do-multiple-db-queries
  let nErrors = 0;
  const promises = [];
  try {
    products.forEach((product) => {
      promises.push(productsModel.getById(ObjectId(product.productId)));
    });
    const idsResults = await Promise.all(promises);
    idsResults.forEach((result) => {
      if (result === null) nErrors += 1;
    });
  } catch (error) {
    nErrors += 1;
  }
  if (nErrors > 0) {
    return { error: `${nErrors} problems` };
  }
  return true;
};

const availableInStockValidation = async (products) => {
  let nErrors = 0;
  const promises = [];
  try {
    products.forEach((product) => {
      promises.push(productsModel.getById(ObjectId(product.productId)));
    });
    const invetoryData = await Promise.all(promises);
    invetoryData.forEach((inventoryProduct, index) => {
      if (inventoryProduct.quantity < products[index].quantity) nErrors += 1;
    });
  } catch (error) {
    nErrors += 1;
  }
  if (nErrors > 0) {
    return { error: `${nErrors} problems` };
  }
  return true;
};

const updateQuantityProducts = async (products, operation) => {
  const promises = [];
  try {
    products.forEach(({ productId, quantity }) => {
      promises.push(productsModel
        .updateProductQuantityById(productId, operation === 'increase' ? quantity : -quantity));
    });
    await Promise.all(promises);
    return true;
  } catch (error) {
    return { error: error.message };
  }
};

const create = async (products) => {
  const quantity = inputProductsQuantityValidation(products);
  const available = await availableProductsValidation(products);
  const availableInStock = await availableInStockValidation(products);
  
  if (quantity.error || available.error) {
    return { err: { code: 'invalid_data', message: 'Wrong product ID or invalid quantity' } };
  }

  // PASSOU NA PRIMEIRA VALIDAÇÃO

  if (availableInStock.error) {
    return { err: { code: 'stock_problem', message: 'Such amount is not permitted to sell' } };
  }

  const response = await salesModel.create(products);

  await updateQuantityProducts(products, 'decrease');
  
  return response;
};

const getAll = async () => {
  const response = await salesModel.getAll();

  return { sales: response };
};

const getById = async (id) => {
  const response = await salesModel.getById(id);

  if (!response || response.message) {
    return { err: { code: 'not_found', message: 'Sale not found' } };
  }

  return response;
};

// PARA ADICIONAR UMA ATUALIZAÇÃO NO ESTOQUE NO UPDATE:
// 1- PRIMEIRO OBTENHA A VENDA QUE IRÁ SER EDITADA. 2- OBTENHA OS PRODUTOS E QTD QUE COMPÕE ESSA VENDA ANTES DE EDITAR. 3- INCREMENTE AO ESTOQUE A QTD DE PRODUTOS DA VENDA ANTES DE EDITAR. 4- RETIRE DO ESTOQUE TODOS OS PRODUTOS QUE COMPÕE A VENDA EDITADA
const updateById = async (id, products) => {
  const quantity = inputProductsQuantityValidation(products);
  const available = await availableProductsValidation(products);
  if (quantity.error || available.error) {
    return { err: { code: 'invalid_data', message: 'Wrong product ID or invalid quantity' } };
  }
  
  const response = await salesModel.updateById(id, products);

  if (!response || response.message) {
    return { err: { code: 'not_found', message: 'Sale not found' } };
  }

  return response;
};

const deleteById = async (id) => {
  const saleExists = await salesModel.getById(id);
  if (!saleExists) {
    return { err: { code: 'invalid_data', message: 'Wrong sale ID format' } };
  }

  const products = saleExists.itensSold;

  const response = await salesModel.deleteById(id);

  if (response.message) {
    return { err: { code: 'invalid_data', message: 'Wrong sale ID format' } };
  }

  await updateQuantityProducts(products, 'increase');

  return saleExists;
};

module.exports = {
  create,
  inputProductsQuantityValidation,
  availableProductsValidation,
  availableInStockValidation,
  updateQuantityProducts,
  getAll,
  getById,
  updateById,
  deleteById,
};