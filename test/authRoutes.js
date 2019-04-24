import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../API/app';
import users from '../API/models/user';

chai.should();

chai.use(chaiHttp);

const signUpURL = '/api/v1/auth/signup';

describe('AUTHENTICATION', () => {
  describe('POST /auth/signup', () => {
    after((done) => {
      const resetQuery = `
        DELETE FROM users;
      `;

      users.query(resetQuery)
        .then(() => {
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it(`should create user account if all fields are
    filled correctly`, (done) => {
      const userDetails1 = {
        email: 'osaukhu.bi@gmail.com',
        firstName: 'Osaukhu',
        lastName: 'Iyamuosa',
        password: 'ukhu7',
        type: 'client',
        isAdmin: 'false',
      };
      chai.request(app)
        .post(signUpURL)
        .send(userDetails1)
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('data');
          response.body.data.should.have.property('token');
          done();
        });
    });

    it(`should respond with a 400 Bad Request Error if user tries
    to signup with an already existent email`, (done) => {
      const userDetails2 = {
        email: 'osaukhu.bi@gmail.com',
        firstName: 'Osaukhu',
        lastName: 'Iyamuosa',
        password: 'ukhu7',
        type: 'client',
        isAdmin: 'false',
      };
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails2)
        .end((error, response) => {
          response.should.have.status(409);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          done();
        });
    });

    it(`should respond with a 400 Bad Request Error if
    any of the fields are missing`, (done) => {
      const userDetails4 = {
        email: 'osaukhu4.bi@gmail.com',
        lastName: 'Iyamuosa',
        password: 'ukhu7',
        type: 'client',
        isAdmin: 'false',
      };
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails4)
        .end((error, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('errors');
          response.body.errors.should.be.a('object');
          done();
        });
    });

    it(`should respond with a 400 Bad Request Error if any of
    the fields are empty or undefined`, (done) => {
      const userDetails5 = {
        email: 'osaukhu5.bi@gmail.com',
        firstName: '',
        lastName: 'Iyamuosa',
        password: 'ukhu7',
        type: 'client',
        isAdmin: 'false',
      };
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails5)
        .end((error, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('errors');
          response.body.errors.should.be.a('object');
          done();
        });
    });
  });

  describe('POST /auth/signin', () => {
    let resToken;

    before((done) => {
      const userDetails = {
        email: 'lylsoul@gmail.com',
        firstName: 'Osaukhu',
        lastName: 'Iyamuosa',
        password: 'ukhu7',
        type: 'client',
        isAdmin: 'false',
      };
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails)
        .end((error, response) => {
          resToken = response.body.data.token;
          done();
        });
    });

    after((done) => {
      const resetQuery = `
        DELETE FROM users;
      `;

      users.query(resetQuery)
        .then(() => {
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it(`should sign the user in if the user provides
    the correct sign in details`, (done) => {
      const loginDetails = {
        email: 'lylsoul@gmail.com',
        password: 'ukhu7',
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(loginDetails)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('data');
          response.body.data.should.have
            .keys('token', 'id', 'firstName', 'email', 'lastName');
          done();
        });
    });

    it(`should return a 428 Precondition Required error stating that
    an already logged in user should log out first`, (done) => {
      const loginDetails = {
        email: 'lylsoul@gmail.com',
        password: 'ukhu7',
        token: resToken,
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(loginDetails)
        .end((error, response) => {
          response.should.have.status(428);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          done();
        });
    });

    it(`should return a 403 Forbiden Error if an already logged in
    user tries to log in again but with the wrong token`, (done) => {
      const loginDetails = {
        email: 'lylsoul@gmail.com',
        password: 'ukhu7',
        token: 'bvhshjwe6778bvw67324r',
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(loginDetails)
        .end((error, response) => {
          response.should.have.status(403);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should
            .equal('FORBIDDEN REQUEST - Wrong or invalid token');
          done();
        });
    });

    it(`should return a 401 Unauthorized Error if the given
    email is not in the DB`, (done) => {
      const loginDetails = {
        email: 'seven@gmail.com',
        password: 'ukhu7',
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(loginDetails)
        .end((error, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should.equal('Email or password is wrong');
          done();
        });
    });

    it(`should return a 401 Unauthorized Error if the
    password entered is incorrect`, (done) => {
      const loginDetails = {
        email: 'lylsoul@gmail.com',
        password: 'ukhu777',
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(loginDetails)
        .end((error, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should.equal('Email or password is wrong');
          done();
        });
    });
  });
});
