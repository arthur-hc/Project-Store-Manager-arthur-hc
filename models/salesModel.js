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

module.exports = {
  create,
  getAll,
  getById,
};