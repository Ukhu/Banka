import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../API/app';

chai.should();

chai.use(chaiHttp);
// Parent block

describe('Authentication', () => {
  describe('POST /auth/signup', () => {
    it('should create user account if all fields are filled correctly', (done) => {
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

    it('should respond with a 400 Bad Request Error if user tries to signup with an already existent email', (done) => {
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

    it('should respond with a 400 Bad Request Error if any of the fields are missing', (done) => {
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

    it('should respond with a 400 Bad Request Error if any of the fields are empty or undefined', (done) => {
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

  describe('POST /auth/signin', () => {
    let resToken;

    before((done) => {
      const userDetails = {
        email: 'lylsoul@gmail.com',
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
          if (res) {
            resToken = res.body.data.token;
            Promise.resolve(done());
          } else {
            Promise.resolve(done(err));
          }
        });
    });

    it('should sign the user in if the user provides the correct sign in details', (done) => {
      const loginDetails = {
        email: 'lylsoul@gmail.com',
        password: 'ukhu7',
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(loginDetails)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.have.keys('token', 'id', 'firstname', 'email', 'lastname');
          done();
        });
    });

    it('should return a 428 Precondition Required error stating that an already logged in user should log out first', (done) => {
      const loginDetails = {
        email: 'lylsoul@gmail.com',
        password: 'ukhu7',
        token: resToken,
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(loginDetails)
        .end((err, res) => {
          res.should.have.status(428);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          done();
        });
    });

    it('should return a 403 Forbiden Error if an already logged in user tries to log in again but with the wrong token', (done) => {
      const loginDetails = {
        email: 'lylsoul@gmail.com',
        password: 'ukhu7',
        token: 'bvhshjwe6778bvw67324r',
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(loginDetails)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          res.body.error.should.equal('FORBIDDEN REQUEST - Wrong or invalid token');
          done();
        });
    });

    it('should return a 401 Unauthorized Error if the given email is not in the DB', (done) => {
      const loginDetails = {
        email: 'seven@gmail.com',
        password: 'ukhu7',
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(loginDetails)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          res.body.error.should.equal('No User found for the provided email!');
          done();
        });
    });

    it('should return a 401 Unauthorized Error if the password entered is incorrect', (done) => {
      const loginDetails = {
        email: 'lylsoul@gmail.com',
        password: 'ukhu777',
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(loginDetails)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          res.body.error.should.equal('Incorrect password');
          done();
        });
    });
  });
});

describe('Account', () => {
  describe('POST /accounts', () => {
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
          if (res) {
            Promise.resolve(done());
          } else {
            Promise.resolve(done(err));
          }
        });
    });

    it('should create a bank account if all fields are filled correctly', (done) => {
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

    it('should return a 404 Not Found error if there is no user in the DB with the given userID', (done) => {
      const accountOpeningDetails = {
        userId: 4,
        type: 'current',
        token: resToken,
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .send(accountOpeningDetails)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          done();
        });
    });

    it('should return a 403 Forbidden Error if no token is provided', (done) => {
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

    it('should return a 403 Forbidden Error if a wrong token is provided', (done) => {
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

    it('should return a 400 Bad Request Error if any of the other fields are missing', (done) => {
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

    it('should return a 400 Bad Request Error if any of the other fields are of the wrong type or value', (done) => {
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
