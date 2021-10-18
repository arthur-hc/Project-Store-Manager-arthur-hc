const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoConnection = require('../../models/connection');
const productsModel = require('../../models/productsModel');
const salesModel = require('../../models/salesModel');


let connectionMock;

before(async () => {
  const DBServer = new MongoMemoryServer();
  const URLMock = await DBServer.getUri();

  connectionMock = await MongoClient
    .connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then((conn) => conn.db('StoreManager'));

  
  sinon.stub(mongoConnection, 'getConnection').resolves(connectionMock);
});

after(async () => {
  await mongoConnection.getConnection.restore();
}); 

const payloadProduct = {
  name: 'Produto do Batista',
  quantity: 150,
};
const { name, quantity } = payloadProduct;

let temporaryId;

describe('Inicia a conexão', () => {

  describe('o BD utilizado', () => {

    it('possui o nome StoreManager', () => {
      const dbName = connectionMock.namespace;
      expect(dbName).to.be.equal('StoreManager');
    });
  });
})

// PRODUCTS MODEL
describe('Insere um novo produto no BD', () => {

  describe('quando é inserido com sucesso', () => {

    it('retorna um objeto com as propriedades corretas', async () => {
      const response = await productsModel.create(name, quantity);
      expect(response).to.be.a('object');
      expect(response).to.include.all.keys('_id', 'name', 'quantity');
      temporaryId = response._id;
    });
  });
});

describe('Busca todos os produos cadastrados no BD', () => {
  
  describe('quando a função é chamada', () => {
    it('retorna um array ', async () => {
      const response = await productsModel.getAll();
      expect(response).to.be.a('array');
      expect(response.length).to.be.equal(1);
    });
  });
});

describe('Busca um produto no BD pelo ID', () => {

  describe('quando é existe', () => {

    it('retorna um objeto com as propriedades corretas', async () => {
      const response = await productsModel.getById(temporaryId);
      expect(response).to.be.a('object');
      expect(response).to.include.all.keys('_id', 'name', 'quantity');
    });
  });

  describe('quando não existe', () => {

    it('retorna null', async () => {
      const response = await productsModel.getById('6154d94a1772b7cb5baeaeda');
      expect(response).to.be.null;
    });
  });

  describe('ao passar um ID inválido', () => {

    it('retorna um erro', async () => {
      const response = await productsModel.getById('ID inválido');
      const message = response.message;
      expect(message).to.be.equal('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
    });
  });
});

describe('Atualiza um produto no BD pelo ID', () => {

  describe('quando atualizado', () => {

    it('retorna um objeto com todas as propriedades', async () => {
      const response = await productsModel.updateById(temporaryId, 'Novo Produto', 100);
      expect(response).to.be.a('object');
      expect(response._id).to.equal(temporaryId);
      expect(response.name).to.equal('Novo Produto')
      expect(response.quantity).to.equal(100)
    });
  });

  describe('ao passar um ID inválido', () => {

    it('retorna um erro', async () => {
      const response = await productsModel.updateById('ID inválido', 'Novo Produto', 100);
      const message = response.message;
      expect(message).to.be.equal('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
    });
  });
});

describe('Atualiza a quantidade de um produto no BD pelo ID', () => {
  describe('quando atualizado', () => {

    it('retorna o id do produto que teve a quantidade atualizada', async () => {
      const response = await productsModel.updateProductQuantityById(temporaryId, 200);
      expect(response).to.be.a('object');
      expect(response._id).to.equal(temporaryId);
    });
  });

  describe('ao passar um ID inválido', () => {

    it('retorna um erro', async () => {
      const response = await productsModel.updateProductQuantityById('ID inválido', 200);
      const message = response.message;
      expect(message).to.be.equal('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
    });
  });
});

describe('Busca um produto no BD pelo nome', () => {

  describe('quando existe', () => {
    it('retorna um objeto com suas propriedades', async () => {
      const response = await productsModel.findOneByName('Novo Produto');
      expect(response).to.be.a('object');
      expect(response).to.include.all.keys('_id', 'name', 'quantity');
      expect(response.name).to.equal('Novo Produto')
      expect(response.quantity).to.equal(300)
    });
  });

  describe('quando não existe', () => {
    it('retorna null', async () => {
      const response = await productsModel.findOneByName('Inexistente');
      expect(response).to.be.null;
    });
  });
});

describe('Deleta um produto no BD pelo ID', () => {

  describe('quando deletado', () => {

    it('retorna true', async () => {
      const response = await productsModel.deleteById(temporaryId);
      expect(response).to.be.true;
    });
  });

  describe('quando não deletado, pois não existe', () => {

    it('retorna null', async () => {
      const response = await productsModel.deleteById(temporaryId);
      expect(response).to.be.null;
    });
  });

  describe('quando não deletado, pois o ID é inválido', () => {

    it('retorna um erro', async () => {
      const response = await productsModel.deleteById('ID inválido');
      const message = response.message;
      expect(message).to.be.equal('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
    });
  });
});

// SALES MODEL
const payloadProducts = [{
  name: 'Produto do Batista',
  quantity: 150,
}];

describe('Insere uma nova venda no BD', () => {

  describe('quando é inserida com sucesso', () => {

    it('retorna um objetos, com as informações da venda', async () => {
      const response = await salesModel.create(payloadProducts);
      expect(response).to.be.a('object');
      expect(response).to.include.all.keys('_id', 'itensSold');
      expect(response.itensSold).to.be.equal(payloadProducts);
      temporaryId = response._id;
    });
  });
});

describe('Busca todas as vendas no BD', () => {

  describe('quando são encontradas com sucesso', () => {
    
    it('retorna um array', async () => {
      const response = await salesModel.getAll();
      expect(response).to.be.a('array');
      expect(response.length).to.be.equal(1);
      expect(response[0].itensSold).to.be.deep.equal(payloadProducts);
    });
  });
});

describe('Busca uma venda no BD pelo ID', () => {

  describe('quando é encontrada com sucesso', () => {

    it('retorna um objeto com as informações corretas', async () => {
      const response = await salesModel.getById(temporaryId);
      expect(response).to.be.a('object');
      expect(response).to.include.all.keys('_id', 'itensSold');
      expect(response._id).to.be.deep.equal(temporaryId);
    });
  });

  describe('quando não encontra', () => {

    it('retorna null', async () => {
      const response = await salesModel.getById('615b127cbc031bf17fb2dba7');
      expect(response).to.be.null;
    });
  });

  describe('quando passado um id invalido', () => {

    it('retorna um erro', async () => {
      const response = await salesModel.getById('ID inválido');
      const message = response.message;
      expect(message).to.be.equal('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
    });
  });
});

describe('Edita uma venda no BD pelo ID', () => {
  const updatedProducts = [{
    name: 'Produto do Sebastião',
    quantity: 20,
  }];

  describe('quando é editada com sucesso', () => {

    it('retorna um objeto', async () => {
      const response = await salesModel.updateById(temporaryId, updatedProducts);
      expect(response).to.be.a('object');
      expect(response).to.include.all.keys('_id', 'itensSold');
      expect(response._id).to.be.deep.equal(temporaryId);
      expect(response.itensSold).to.be.equal(updatedProducts);
    });
  });

  describe('quando passado um id invalido', () => {

    it('retorna um erro', async () => {
      const response = await salesModel.updateById('ID inválido', updatedProducts);
      const message = response.message;
      expect(message).to.be.equal('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
    });
  });
});

describe('Deleta uma venda no BD pelo ID', () => {

  describe('quando deletado', () => {

    it('retorna um true', async () => {
      const response = await salesModel.deleteById(temporaryId);
      expect(response).to.be.true;
    });
  });

  describe('quando não encontra o ID para deletar', () => {

    it('retorna um true', async () => {
      const response = await salesModel.deleteById('615b127cbc031bf17fb2dba7');
      expect(response).to.be.null;
    });
  });

  describe('quando passado um id invalido', () => {

    it('retorna um erro', async () => {
      const response = await salesModel.deleteById('ID inválido');
      const message = response.message;
      expect(message).to.be.equal('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
    });
  });
});
