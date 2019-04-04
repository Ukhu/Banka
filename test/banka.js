const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const should = chai.should();

chai.use(chaiHttp);
// Parent block

describe('Authentication', () => {
  describe('Signup', () => {
    it('it should create user account if all fields are filled correctly', (done) => {
      const user = {
        email: 'osaukhu.bi@gmail.com',
        firstName: 'Osaukhu',
        lastName: 'Iyamuosa',
        password: 'ukhu7',
        type: 'client',
        isAdmin: 'false',
      };
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          done();
        });
    });

    it('it should respond with an error message if any of the fields are missing', (done) => {
      const user = {
        email: 'osaukhu.bi@gmail.com',
        lastName: 'Iyamuosa',
        password: 'ukhu7',
        type: 'client',
        isAdmin: 'false',
      };
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          done();
        });
    });

    it('it should respond with an error message if any of the fields are empty or undefined', (done) => {
      const user = {
        email: 'osaukhu.bi@gmail.com',
        firstName: '',
        lastName: 'Iyamuosa',
        password: 'ukhu7',
        type: 'client',
        isAdmin: 'false',
      };
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          done();
        });
    });
  });
});
