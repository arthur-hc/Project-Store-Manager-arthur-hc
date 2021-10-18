const { ObjectId } = require('mongodb');
const mongoConnection = require('./connection');

const create = async (products) => {
  try {
    const db = await mongoConnection.getConnection();
    const newSale = await db.collection('sales').insertOne({ itensSold: products });
    return {
      _id: newSale.insertedId,
      itensSold: products,
    };
  } catch (err) {
    return err;
  }
};

const getAll = async () => {
  try {
    const db = await mongoConnection.getConnection();
    const allSales = await db.collection('sales').find().toArray();
    return allSales;
  } catch (err) {
    return err;
  }
};

const getById = async (id) => {
  try {
    const db = await mongoConnection.getConnection();
    const sale = await db.collection('sales').findOne(new ObjectId(id));
    return sale;
  } catch (err) {
    return err;
  }
};

const updateById = async (id, products) => {
  try {
    const db = await mongoConnection.getConnection();
    await db.collection('sales')
    .updateOne({ _id: new ObjectId(id) }, { $set: { itensSold: products } });
    return { _id: id, itensSold: products };
  } catch (err) {
    return err;
  }
};

const deleteById = async (id) => {
  try {
    const db = await mongoConnection.getConnection();
    const product = await db.collection('sales').deleteOne({ _id: ObjectId(id) });
    if (product.deletedCount === 0) return null;
    return true;
  } catch (err) {
    return err;
  }
};

module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};