const sinon = require('sinon');
const { expect } = require('chai');

const productsModel = require('../../models/productsModel');
const productsService = require('../../services/productsService');
const salesModel = require('../../models/salesModel');
const salesService = require('../../services/salesService');

const payloadProduct = {
  _id: '604cb554311d68f491ba5781',
  name: 'Produto do Batista',
  quantity: 150,
};

const { _id, name, quantity } = payloadProduct;

// PRODUCTS SERVICES
describe('Insere um novo produto no BD', () => {

  describe('quando o payload informado não é válido', () => {
    
    it('retorna um erro', async () => {
      const response = await productsService.create();
      const { err } = response;
      expect(err).exist;
      expect(err).to.be.an('object')
      expect(err.code).to.be.equal('invalid_data');
      expect(err.message).to.be.equal('"name" is required');
    });

    it('retorna um erro', async () => {
      const response = await productsService.create(1);
      const { err } = response;
      expect(err).exist;
      expect(err).to.be.an('object')
      expect(err.code).to.be.equal('invalid_data');
      expect(err.message).to.be.equal('"name" must be a string');
    });

    it('retorna um erro', async () => {
      const response = await productsService.create('Novo Produto');
      const { err } = response;
      expect(err).exist;
      expect(err).to.be.an('object')
      expect(err.code).to.be.equal('invalid_data');
      expect(err.message).to.be.equal('"quantity" is required');
    });

    it('retorna um erro', async () => {
      const response = await productsService.create('Novo Produto', -12);
      const { err } = response;
      expect(err).exist;
      expect(err).to.be.an('object')
      expect(err.code).to.be.equal('invalid_data');
      expect(err.message).to.be.equal('"quantity" must be larger than or equal to 1');
    });
  });

  describe('quando o produto informado já existe', () => {
    before(() => {
      sinon.stub(productsModel, 'findOneByName')
        .resolves(true);
    });

    after(() => {
      productsModel.findOneByName.restore();
    });

    it('retorna um erro', async () => {
      const response = await productsService.create(name, quantity);
      const { err } = response;
      expect(err).exist;
      expect(err).to.be.an('object');
      expect(err.code).to.be.equal('invalid_data');
      expect(err.message).to.be.equal('Product already exists');
    });
  });

  describe('quando o produto é criado criado com sucesso', () => {
    before(() => {
      sinon.stub(productsModel, 'findOneByName')
        .resolves(false);
      sinon.stub(productsModel, 'create')
        .resolves(payloadProduct);
    });

    after(() => {
      productsModel.findOneByName.restore();
      productsModel.create.restore();
    });

    it('retorna o produto criado com as suas informações', async () => {
      const response = await productsService.create(name, quantity);
      expect(response).to.be.an('object');
      expect(response).to.be.equal(payloadProduct);
      expect(response).to.include.all.keys('_id', 'name', 'quantity');
    });
  });
});

describe('Busca todos os produtos no BD', () => {

  describe('quando existem', () => {

    before(() => {
      sinon.stub(productsModel, 'getAll')
        .resolves([payloadProduct]);
    });

    after(() => {
      productsModel.getAll.restore();
    });

    it('retorna um objeto com um array com todos os produtos', async () => {
      const response = await productsService.getAll();
      expect(response).to.be.an('object');
      expect(response.products[0]).to.be.equal(payloadProduct);
      expect(response.products[0]).to.include.all.keys('_id', 'name', 'quantity');
    });
  });
});

describe('Busca um produto no BD pelo ID', () => {

  describe('quando existe', () => {
    before(() => {
      sinon.stub(productsModel, 'getById')
        .resolves(payloadProduct);
    });

    after(() => {
      productsModel.getById.restore();
    });

    it('retorna um objeto com as informações do produto', async () => {
      const response = await productsService.getById('604cb554311d68f491ba5781');
      expect(response).to.be.an('object');
      expect(response).to.be.equal(payloadProduct);
      expect(response._id).to.be.equal(_id);
      expect(response.name).to.be.equal(name);
      expect(response.quantity).to.be.equal(quantity);
    });
  });

  describe('quando não existe', () => {
    before(() => {
      sinon.stub(productsModel, 'getById')
        .resolves(null);
    });

    after(() => {
      productsModel.getById.restore();
    });

    it('retorna uma mensagem de erro de produto não encontrado', async () => {
      const response = await productsService.getById('604cb554311d68f491ba5781');
      const { err } = response;
      expect(err).exist;
      expect(err).to.be.an('object');
      expect(err.code).to.be.equal('not_found');
      expect(err.message).to.be.equal('Product not found');
    });
  });

  describe('quando é um ID inválido', () => {
    before(() => {
      sinon.stub(productsModel, 'getById')
        .resolves({ message: 'Wrong ID' });
    });

    after(() => {
      productsModel.getById.restore();
    });

    it('retorna uma mensagem de erro de id inválido', async () => {
      const response = await productsService.getById('ID inválido');
      const { err } = response;
      expect(err).exist;
      expect(err).to.be.an('object');
      expect(err.code).to.be.equal('invalid_data');
      expect(err.message).to.be.equal('Wrong id format');
    });
  });
});

describe('Atualiza um produto no BD pelo ID', () => {

  describe('quando o payload informado não é válido', () => {
    
    it('retorna um erro', async () => {
      const response = await productsService.updateById();
      const { err } = response;
      expect(err).exist;
      expect(err).to.be.an('object')
      expect(err.code).to.be.equal('invalid_data');
      expect(err.message).to.be.equal('"name" is required');
    });
  });

  describe('quando o ID não é encontrado', () => {
    before(() => {
      sinon.stub(productsModel, 'getById')
        .resolves(null);
    });

    after(() => {
      productsModel.getById.restore();
    });

    it('retorna uma mensagem de erro de produto não encontrado', async () => {
      const response = await productsService.updateById('604cb554311d68f491ba5781', 'Novo Produto', 130);
      const { err } = response;
      expect(err).exist;
      expect(err).to.be.an('object');
      expect(err.code).to.be.equal('not_found');
      expect(err.message).to.be.equal('Product not found');
    });
  });

  describe('quando atualizado', () => {
    before(() => {
      sinon.stub(productsModel, 'getById')
        .resolves(payloadProduct);
      sinon.stub(productsModel, 'updateById')
        .resolves({ _id, name: 'Novo Produto', quantity: 20 });
    });

    after(() => {
      productsModel.getById.restore();
      productsModel.updateById.restore();
    });

    it('retorna uma objeto com as informações do produto atualizado', async () => {
      const response = await productsService.updateById(_id, 'Novo Produto', 20);
      expect(response).to.be.an('object');
      expect(response).to.include.all.keys('_id', 'name', 'quantity');
      expect(response).to.be.deep.equal({ _id, name: 'Novo Produto', quantity: 20 })
    });
  });  
});

describe('Deleta um produto no BD pelo ID', () => {

  describe('quando não encontra um produto com o ID', () => {
    before(() => {
      sinon.stub(productsModel, 'getById')
        .resolves(null);
    });

    after(() => {
      productsModel.getById.restore();
    });

    it('retorna uma mensagem de erro de produto não encontrado', async () => {
      const response = await productsService.deleteById('604cb554311d68f491ba5781');
      const { err } = response;
      expect(err).exist;
      expect(err).to.be.an('object');
      expect(err.code).to.be.equal('not_found');
      expect(err.message).to.be.equal('Product not found');
    });
  });

  describe('quando é um ID inválido', () => {

    before(() => {
      sinon.stub(productsModel, 'getById')
        .resolves({ message: 'Wrong id format' });
      sinon.stub(productsModel, 'deleteById')
      .resolves({ message: 'Wrong id format' });
    });

    after(() => {
      productsModel.getById.restore();
      productsModel.deleteById.restore();
    });

    it('retorna uma mensagem de erro de id inválido', async () => {
      const response = await  productsService.deleteById('604cb554311d68f491ba5781');
      const { err } = response;
      expect(err).exist;
      expect(err).to.be.an('object');
      expect(err.code).to.be.equal('invalid_data');
      expect(err.message).to.be.equal('Wrong id format');
    });
  });

  describe('quando deletado com sucesso', () => {
    before(() => {
      sinon.stub(productsModel, 'getById')
        .resolves(payloadProduct);
      sinon.stub(productsModel, 'deleteById')
      .resolves(payloadProduct);
    });

    after(() => {
      productsModel.getById.restore();
      productsModel.deleteById.restore();
    });
    
    it('retorna o produto deletado', async () => {
      const response = await productsService.deleteById('604cb554311d68f491ba5781');
      expect(response).to.be.an('object');
      expect(response).to.include.all.keys('_id', 'name', 'quantity');
      expect(response).to.be.deep.equal(payloadProduct);
    })
  });
});

describe('Busca um produto no BD pelo nome', () => {

  describe('quando deletado com sucesso', () => {
    before(() => {
      sinon.stub(productsModel, 'findOneByName')
        .resolves(payloadProduct);
    });

    after(() => {
      productsModel.findOneByName.restore();
    });

    it('retorna o produto', async () => {
      const response = await productsService.findOneByName('Produto do Batista');
      expect(response).to.be.an('object');
      expect(response).to.include.all.keys('_id', 'name', 'quantity');
      expect(response).to.be.deep.equal(payloadProduct);
    });
  });
});

// SALES SERVICES
const payloadProducts = [{
  productId: '604cb554311d68f491ba5781',
  name: 'Produto do Batista',
  quantity: 150,
}];

const payloadSale = {
  _id: '604cb554311d68f491ba5782',
  itensSold: payloadProducts,
}



describe('Verifica a função de validação de input', () => {

  describe('quando o payload informado não é válido', () => {

    it('retorna um erro', () => {
      const { error } = salesService.inputProductsQuantityValidation('xablau');
      const message = error.message;
      expect(message).to.be.equal('"value" must be an array');
    });

    it('retorna um erro', () => {
      const { error } = salesService.inputProductsQuantityValidation([{ _id }]);
      const message = error.details[0].message;
      expect(message).to.be.equal('"quantity" is required');
    });

  });

  describe('quando o payload informado é válido', () => {
    it('não retorna null em error', () => {
      const { error } = salesService.inputProductsQuantityValidation([{ productId: _id, quantity: 200 }]);
      expect(error).to.be.null;
    });
  });
});

describe('Verifica a função de checagem de existência de um produto', () => {

  describe('quando passado um id inválido', () => {

    it('retorna uma mensagem avisando o erro', async () => {
      const response = await salesService.availableProductsValidation([{ productId: 'ID inválido', quantity: 200 }]);
      expect(response.error).to.be.equal('1 problems')
    });
  });

  describe('quando passado o id do produto não existe', () => {
    before(() => {
      sinon.stub(productsModel, 'getById')
        .resolves(null);
    });

    after(() => {
      productsModel.getById.restore();
    });

    it('retorna uma mensagem avisando o erro', async () => {
      const response = await salesService.availableProductsValidation([{ productId: 'ID inválido', quantity: 200 }]);
      expect(response.error).to.be.equal('1 problems')
    });
  });

  describe('quando o produto existe', () => {
    before(() => {
      sinon.stub(productsModel, 'getById')
        .resolves(payloadProduct);
    });

    after(() => {
      productsModel.getById.restore();
    });

    it('retorna true', async () => {
      const response = await salesService.availableProductsValidation([{ productId: '604cb554311d68f491ba5781', quantity: 200 }]);
      expect(response).to.be.true;
    });
  });
});

describe('Verifica a função de checagem de disponibilidade de estoque', () => {

  describe('quando passado um id inválido', () => {

    it('retorna uma mensagem avisando o erro', async () => {
      const response = await salesService.availableInStockValidation([{ productId: 'ID inválido', quantity: 200 }]);
      expect(response.error).to.be.equal('1 problems')
    });
  });

  describe('quando a quantidade demandada é maior que a em estoque', () => {
    before(() => {
      sinon.stub(productsModel, 'getById')
        .resolves(payloadProduct); // qtd: 150
    });

    after(() => {
      productsModel.getById.restore();
    });

    it('retorna uma mensagem avisando o erro', async () => {
      const response = await salesService.availableInStockValidation([{ productId: _id, quantity: 200 }]);
      expect(response.error).to.be.equal('1 problems')
    });
  });

  describe('quando a quantidade demandada é menor que a em estoque', () => {
    before(() => {
      sinon.stub(productsModel, 'getById')
        .resolves(payloadProduct); // qtd: 150
    });

    after(() => {
      productsModel.getById.restore();
    });

    it('retorna uma mensagem avisando o erro', async () => {
      const response = await salesService.availableInStockValidation([{ productId: _id, quantity: 100 }]);
      expect(response).to.be.true;
    });
  });
});

describe('Atualiza a quantidade do produto em estoque', () => {

  describe('quando há um insucesso', () => {
    before(() => {
      sinon.stub(productsModel, 'updateProductQuantityById')
        .rejects({ message: 'Internal error' });
    });

    after(() => {
      productsModel.updateProductQuantityById.restore();
    });

    it('retorna uma mensagem de erro', async () => {
      const response = await salesService.updateQuantityProducts([{ productId: _id, quantity: 100 }]);
      expect(response).to.be.an('object');
      expect(response.error).to.be.equal('Internal error');
    });
  });

  describe('quando há sucesso', () => {
    before(() => {
      sinon.stub(productsModel, 'updateProductQuantityById')
        .resolves({ message: 'Updated' });
    });

    after(() => {
      productsModel.updateProductQuantityById.restore();
    });

    it('retorna true', async () => {
      const response = await salesService.updateQuantityProducts([{ productId: _id, quantity: 100 }]);
      expect(response).to.be.true;
    });
  });
});

describe('Cria uma nova venda', () => {

  describe('quando o payload informado não é válido', () => {
    before(() => {
      sinon.stub(salesService, 'inputProductsQuantityValidation')
        .returns({ error: 'Invalid Input' });

      sinon.stub(salesService, 'availableProductsValidation')
        .rejects({ error: 'Not Found' });

      sinon.stub(salesService, 'availableInStockValidation')
        .resolves({ message: 'Available' });
    });

    after(() => {
      salesService.inputProductsQuantityValidation.restore();
      salesService.availableProductsValidation.restore();
      salesService.availableInStockValidation.restore();
    });

    it('retorna uma mensagem de erro', async () => {
      const response = await salesService.create();
      expect(response).to.be.an('object');
      expect(response.err).to.be.deep.equal({ code: 'invalid_data', message: 'Wrong product ID or invalid quantity' });
    });
  });
});

describe('Busca todas as vendas', () => {

  describe('quando existem', () => {
    before(() => {
      sinon.stub(salesModel, 'getAll')
        .resolves(payloadProducts);
    });

    after(() => {
      salesModel.getAll.restore();
    });
  
    it('retorna um array com os produtos', async () => {
      const response = await salesService.getAll();
      expect(response).to.be.an('object');
      const { sales } = response;
      expect(sales[0]).to.be.deep.equal(payloadProducts[0]);
    });
  });
});

describe('Busca uma venda pelo id', () => {

  describe('quando não existe', () => {
    before(() => {
      sinon.stub(salesModel, 'getById')
        .resolves(null);
    });

    after(() => {
      salesModel.getById.restore();
    });
  
    it('retorna uma mensagem de erro', async () => {
      const response = await salesService.getById('604cb554311d68f491ba5781');
      expect(response).to.be.an('object');
      expect(response).to.be.deep.equal({ err: { code: 'not_found', message: 'Sale not found' } })
    });
  });

  describe('quando existe', () => {
    before(() => {
      sinon.stub(salesModel, 'getById')
        .resolves(payloadSale);
    });

    after(() => {
      salesModel.getById.restore();
    });
  
    it('retorna uma mensagem de erro', async () => {
      const response = await salesService.getById('604cb554311d68f491ba5782');
      expect(response).to.be.an('object');
      expect(response).to.be.deep.equal(payloadSale);
    });
  });
});