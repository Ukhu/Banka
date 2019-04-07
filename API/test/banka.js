import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.should();

chai.use(chaiHttp);
// Parent block

describe('Authentication', () => {
  describe('POST /auth/signup', () => {
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

    it('it should respond with a 400 Bad Request Error if user tries to signup with an already existent email', (done) => {
      before(() => {
        const userDetails = {
          email: 'osaukhu.bi@gmail.com',
          firstname: 'Osaukhu',
          lastname: 'Iyamuosa',
          password: 'ukhu7',
          type: 'client',
          isAdmin: 'false',
        };
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(userDetails)
          .end();
        done();
      });

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
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          done();
        });
    });

    it('it should respond with a 400 Bad Request Error if any of the fields are missing', (done) => {
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

    it('it should respond with a 400 Bad Request Error if any of the fields are empty or undefined', (done) => {
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

describe('Account', () => {
  let resToken;

  before((done) => {
    const userDetails = {
      email: 'oshu.bi@gmail.com',
      firstname: 'Osaukhu',
      lastname: 'Iyamuosa',
      password: 'ukhu7',
      type: 'client',
      isAdmin: 'false',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(userDetails)
      .end((err, res) => {
        resToken = res.body.data.token;
      });
    done();
  });

  describe('POST /accounts', () => {
    it('it should create a bank account if all fields are filled correctly', (done) => {
      const accountOpeningDetails = {
        userId: 2,
        type: 'current',
        token: resToken,
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .send(accountOpeningDetails)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.have.property('firstname');
          res.body.data.should.have.property('lastname');
          res.body.data.should.have.property('email');
          done();
        });
    });

    it('it should return a 403 Forbidden Error if no token is provided', (done) => {
      const accountOpeningDetails = {
        userId: 2,
        type: 'current',
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .send(accountOpeningDetails)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });

    it('it should return a 403 Forbidden Error if a wrong token is provided', (done) => {
      const accountOpeningDetails = {
        userId: 2,
        type: 'current',
        token: 'wr@ngtoke#',
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .send(accountOpeningDetails)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });

    it('it should return a 400 Bad Request Error if any of the other fields are missing', (done) => {
      const accountOpeningDetails = {
        userId: 2,
        token: resToken,
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .send(accountOpeningDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });

    it('it should return a 400 Bad Request Error if any of the other fields are of the wrong type or value', (done) => {
      const accountOpeningDetails = {
        userId: 2,
        token: resToken,
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .send(accountOpeningDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
  });
});
