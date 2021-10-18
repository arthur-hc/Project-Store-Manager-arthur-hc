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

module.exports = {
  create,
};