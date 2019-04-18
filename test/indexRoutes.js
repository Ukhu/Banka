import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../API/app';

chai.should();

chai.use(chaiHttp);

describe('GENERAL', () => {
  describe('GET /', () => {
    it('should display the available endpoints if the user visits the root route', (done) => {
      chai.request(app)
        .get('/')
        .end((error, response) => {
          response.body.should.be.a('object');
          response.body.should.have.keys('message', 'endpoints');
          response.body.message.should.equal('Welcome to Banka API, check out the available endpoints below');
          response.body.endpoints.should.have.keys('createUser', 'loginUser', 'createBankAccount', 'activateDeactivate', 'deleteUser', 'debitBankAccount', 'creditBankAccount');
        });
      done();
    });
  });

  describe('All Routes', () => {
    it('should return a message if the user enters an unavailable endpoint', (done) => {
      chai.request(app)
        .get('/wrongendpoint')
        .end((error, response) => {
          response.body.should.be.a('object');
          response.body.should.have.property('message');
          response.body.message.should.equal('Endpoint not found, check the root route to know the available routes');
        });
      done();
    });
  });
});
