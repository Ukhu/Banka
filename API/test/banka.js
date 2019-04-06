import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.should();

chai.use(chaiHttp);
// Parent block

describe('Authentication', () => {
  describe('Signup', () => {
    it('it should create user account if all fields are filled correctly', (done) => {
      const user = {
        email: 'osaukhu.bi@gmail.com',
        firstname: 'Osaukhu',
        lastname: 'Iyamuosa',
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
        lastname: 'Iyamuosa',
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
          res.body.should.have.property('errors');
          res.body.errors.should.be.a('array');
          done();
        });
    });

    it('it should respond with an error message if any of the fields are empty or undefined', (done) => {
      const user = {
        email: 'osaukhu.bi@gmail.com',
        firstname: '',
        lastname: 'Iyamuosa',
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
          res.body.should.have.property('errors');
          res.body.errors.should.be.a('array');
          done();
        });
    });
  });
});
