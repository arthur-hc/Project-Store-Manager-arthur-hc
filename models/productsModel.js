const mongoConnection = require('./connection');

const create = async (name, quantity) => {
  try {
    const db = await mongoConnection.getConnection();
    const newProduct = await db.collection('products').insertOne({ name, quantity });
    return {
      _id: newProduct.insertedId,
      name,
      quantity,
    };
  } catch (err) {
    return err;
  }
};

const findOneByName = async (name) => {
  const db = await mongoConnection.getConnection();
  const Product = await db.collection('products').findOne({ name });
  return Product;
};

module.exports = {
  create,
  findOneByName,
};