const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const should = chai.should();

chai.use(chaiHttp);
// Parent block

describe('Preliminary', () => {
  describe('/GET', () => {
    it('it should display the default message', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
