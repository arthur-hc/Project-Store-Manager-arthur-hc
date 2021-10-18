const sinon = require('sinon');
const { expect } = require('chai');

const productsService = require('../../services/productsService');
const productsController = require('../../controllers/productsController');

const salesService = require('../../services/salesService');
const salesController = require('../../controllers/salesController');

const payloadProduct = {
  _id: '604cb554311d68f491ba5781',
  name: 'Produto do Batista',
  quantity: 150,
};

const payloadSales = [{
  _id: '604cb554311d68f491ba5782',
  itensSold: payloadProduct,
}];

// PRODUCTS CONTROLLERS

describe('Ao chamar o controller de create products', () => {

  describe('quando o produto não é criado', () => {
    const response = {};
    const request = {};

    before(() => {
      request.body = {};

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();
      sinon.stub(productsService, 'create')
        .resolves({  err: 'motivo do erro' });
    });

    after(() => {
      productsService.create.restore();
    });

    it('é chamado o status com o código 422 com o json contendo o motivo do erro', async () => {
      await productsController.create(request, response);
      expect(response.status.calledWith(422)).to.be.equal(true);
      expect(response.json.calledWith({  err: 'motivo do erro' })).to.be.equal(true);
    });
  });

  describe('quando é inserido com sucesso', () => {
    const response = {};
    const request = {};

    before(() => {
      request.body = {
        name: payloadProduct.name,
        quantity: payloadProduct.quantity,
      };

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();

      sinon.stub(productsService, 'create')
      .resolves(payloadProduct);
    })

    after(() => {
      productsService.create.restore();
    });

    it('é chamado o status com o código 201, retornando o novo produto', async () => {
      await productsController.create(request, response);
      expect(response.status.calledWith(201)).to.be.equal(true);
      expect(response.json.calledWith(payloadProduct)).to.be.equal(true);
    });
  });
});

describe('Ao chamar o controller de getAll products', () => {

  describe('quando há produtos criados', () => {
    const response = {};
    const request = {};

    before(() => {
      request.body = {};

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();

      sinon.stub(productsService, 'getAll')
      .resolves([payloadProduct]);
    })

    after(() => {
      productsService.getAll.restore();
    });

    it('é chamado com status 200, retornando um array contendo os produtos', async () => {
      await productsController.getAll(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
      expect(response.json.calledWith([payloadProduct])).to.be.equal(true);
    })
  });
});

describe('Ao chamar o controller de getById products', () => {

  describe('quando não existe', () => {
    
    const response = {};
    const request = {};

    before(() => {
      request.body = {};
      request.params = { id: 'ID inexistente' }

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();
      sinon.stub(productsService, 'getById')
        .resolves({  err: 'motivo do erro' });
    });

    after(() => {
      productsService.getById.restore();
    });

    it('é chamado o status com o código 422 com o json contendo o motivo do erro', async () => {
      await productsController.getById(request, response);
      expect(response.status.calledWith(422)).to.be.equal(true);
      expect(response.json.calledWith({  err: 'motivo do erro' })).to.be.equal(true);
    });
  });

  describe('quando existe', () => {
    
    const response = {};
    const request = {};

    before(() => {
      request.body = {};
      request.params = { id: 'ID para busca' }

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();
      sinon.stub(productsService, 'getById')
        .resolves(payloadProduct);
    });

    after(() => {
      productsService.getById.restore();
    });

    it('é chamado o status com o código 200 com o json contendo o produto buscado', async () => {
      await productsController.getById(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
      expect(response.json.calledWith(payloadProduct)).to.be.equal(true);
    });
  });
});

describe('Ao chamar o controller de updateById products', () => {

  describe('quando não existe ou ocorre algum erro', () => {
    
    const response = {};
    const request = {};

    before(() => {
      request.body = {};
      request.params = { id: 'ID inexistente' }

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();
      sinon.stub(productsService, 'updateById')
        .resolves({  err: 'motivo do erro' });
    });

    after(() => {
      productsService.updateById.restore();
    });

    it('é chamado o status com o código 422 com o json contendo o motivo do erro', async () => {
      await productsController.updateById(request, response);
      expect(response.status.calledWith(422)).to.be.equal(true);
      expect(response.json.calledWith({  err: 'motivo do erro' })).to.be.equal(true);
    });
  });

  describe('quando é editado com sucesso', () => {
    
    const response = {};
    const request = {};

    before(() => {
      request.body = {};
      request.params = { id: 'ID para busca' }

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();
      sinon.stub(productsService, 'updateById')
        .resolves(payloadProduct);
    });

    after(() => {
      productsService.updateById.restore();
    });

    it('é chamado o status com o código 200 com o json contendo o produto editado', async () => {
      await productsController.updateById(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
      expect(response.json.calledWith(payloadProduct)).to.be.equal(true);
    });
  });
});

describe('Ao chamar o controller de deleteById products', () => {

  describe('quando não existe ou ocorre algum erro', () => {
    
    const response = {};
    const request = {};

    before(() => {
      request.body = {};
      request.params = { id: 'ID inexistente' }

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();
      sinon.stub(productsService, 'deleteById')
        .resolves({  err: 'motivo do erro' });
    });

    after(() => {
      productsService.deleteById.restore();
    });

    it('é chamado o status com o código 422 com o json contendo o motivo do erro', async () => {
      await productsController.deleteById(request, response);
      expect(response.status.calledWith(422)).to.be.equal(true);
      expect(response.json.calledWith({  err: 'motivo do erro' })).to.be.equal(true);
    });
  });

  describe('quando é deletado com sucesso', () => {
    
    const response = {};
    const request = {};

    before(() => {
      request.body = {};
      request.params = { id: 'ID para busca' }

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();
      sinon.stub(productsService, 'deleteById')
        .resolves(payloadProduct);
    });

    after(() => {
      productsService.deleteById.restore();
    });

    it('é chamado o status com o código 200 com o json contendo o produto deletado', async () => {
      await productsController.deleteById(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
      expect(response.json.calledWith(payloadProduct)).to.be.equal(true);
    });
  });
});

describe('Ao chamar o controller de findOneByName products', () => {

  describe('quando é encontrado com sucesso', () => {
    
    const response = {};
    const request = {};

    before(() => {
      request.body = {};

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();
      sinon.stub(productsService, 'findOneByName')
        .resolves(payloadProduct);
    });

    after(() => {
      productsService.findOneByName.restore();
    });

    it('é chamado o status com o código 200 com o json contendo o produto encontrado', async () => {
      await productsController.findOneByName(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
      expect(response.json.calledWith(payloadProduct)).to.be.equal(true);
    });
  });
});

// SALES CONTROLLERS

describe('Ao chamar o controller de create sales', () => {

  describe('quando a venda não é criada por erro nos dados', () => {
    const response = {};
    const request = {};

    before(() => {
      request.body = {};

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();
      sinon.stub(salesService, 'create')
        .resolves({ err: { code: 'invalid_data' } });
    });

    after(() => {
      salesService.create.restore();
    });

    it('é chamado o status com o código 422 com o json contendo o motivo do erro', async () => {
      await salesController.create(request, response);
      expect(response.status.calledWith(422)).to.be.equal(true);
      expect(response.json.calledWith({ err: { code: 'invalid_data' } })).to.be.equal(true);
    });
  });

  describe('quando a venda não é criada por problema com estoque', () => {
    const response = {};
    const request = {};

    before(() => {
      request.body = {};

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();
      sinon.stub(salesService, 'create')
        .resolves({ err: { code: 'stock_problem' } });
    });

    after(() => {
      salesService.create.restore();
    });

    it('é chamado o status com o código 404 com o json contendo o motivo do erro', async () => {
      await salesController.create(request, response);
      expect(response.status.calledWith(404)).to.be.equal(true);
      expect(response.json.calledWith({ err: { code: 'stock_problem' } })).to.be.equal(true);
    });
  });

  describe('quando a venda é inserida com sucesso', () => {
    const response = {};
    const request = {};

    before(() => {
      request.body = {
        products: [payloadSales]
      };

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();

      sinon.stub(salesService, 'create')
      .resolves(payloadSales);
    })

    after(() => {
      salesService.create.restore();
    });

    it('é chamado o status com o código 200, retornando o nova venda', async () => {
      await salesController.create(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
      expect(response.json.calledWith(payloadSales)).to.be.equal(true);
    });
  });
});

describe('Ao chamar o controller de getAll sales', () => {

  describe('quando há vendas criadas', () => {
    const response = {};
    const request = {};

    before(() => {
      request.body = {};

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();

      sinon.stub(salesService, 'getAll')
      .resolves([payloadProduct]);
    })

    after(() => {
      salesService.getAll.restore();
    });

    it('é chamado com status 200, retornando um array contendo as vendas', async () => {
      await salesController.getAll(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
      expect(response.json.calledWith([payloadProduct])).to.be.equal(true);
    })
  });
});

describe('Ao chamar o controller de getById sales', () => {

  describe('quando não existe', () => {
    
    const response = {};
    const request = {};

    before(() => {
      request.body = {};
      request.params = { id: 'ID inexistente' }

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();
      sinon.stub(salesService, 'getById')
        .resolves({  err: 'motivo do erro' });
    });

    after(() => {
      salesService.getById.restore();
    });

    it('é chamado o status com o código 404 com o json contendo o motivo do erro', async () => {
      await salesController.getById(request, response);
      expect(response.status.calledWith(404)).to.be.equal(true);
      expect(response.json.calledWith({  err: 'motivo do erro' })).to.be.equal(true);
    });
  });

  describe('quando existe', () => {
    
    const response = {};
    const request = {};

    before(() => {
      request.body = {};
      request.params = { id: 'ID para busca' }

      response.status = sinon.stub()
        .returns(response);
      response.json = sinon.stub()
        .returns();
      sinon.stub(salesService, 'getById')
        .resolves(payloadSales);
    });

    after(() => {
      salesService.getById.restore();
    });

    it('é chamado o status com o código 200 com o json contendo o produto buscado', async () => {
      await salesController.getById(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
      expect(response.json.calledWith(payloadSales)).to.be.equal(true);
    });
  });
});
