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

module.exports = {
  create,
  inputProductsQuantityValidation,
  availableProductsValidation,
  availableInStockValidation,
  updateQuantityProducts,
};