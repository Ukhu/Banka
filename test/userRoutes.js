import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../API/app';
import users from '../API/models/user';

chai.should();

chai.use(chaiHttp);

describe('USER', () => {
  describe('GET /users/<user-email>/accounts', () => {
    let userToken;
    let userToken2;
    let cashierToken;

    before((done) => {
      const userDetails = {
        email: 'user@gmail.com',
        firstName: 'dummy',
        lastName: 'user',
        password: '_useR@',
        type: 'client',
        isAdmin: 'false',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails)
        .end((error, response) => {
          userToken = response.body.data.token;
          done();
        });
    });

    before((done) => {
      const userDetails = {
        email: 'user2@gmail.com',
        firstName: 'dummy',
        lastName: 'user',
        password: '_useR@',
        type: 'client',
        isAdmin: 'false',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails)
        .end((error, response) => {
          userToken2 = response.body.data.token;
          done();
        });
    });

    before((done) => {
      const cashierDetails = {
        email: 'staff@gmail.com',
        firstName: 'Staff',
        lastName: 'Cashier',
        password: 'c@SHIer_',
        type: 'staff',
        isAdmin: 'false',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(cashierDetails)
        .end((error, response) => {
          cashierToken = response.body.data.token;
          done();
        });
    });

    before((done) => {
      const userCreateAccDetails = {
        type: 'savings',
        token: userToken,
      };

      chai.request(app)
        .post('/api/v1/accounts')
        .send(userCreateAccDetails)
        .end(() => {
          done();
        });
    });

    before((done) => {
      const userCreateAccDetails = {
        type: 'savings',
        token: userToken,
      };

      chai.request(app)
        .post('/api/v1/accounts')
        .send(userCreateAccDetails)
        .end(() => {
          done();
        });
    });

    before((done) => {
      const userCreateAccDetails = {
        type: 'savings',
        token: userToken,
      };

      chai.request(app)
        .post('/api/v1/accounts')
        .send(userCreateAccDetails)
        .end(() => {
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

    it(`should successfully get the transaction details of a
    particular account`, (done) => {
      chai.request(app)
        .get('/api/v1/users/user@gmail.com/accounts')
        .send({ token: cashierToken })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('data');
          response.body.data.should.be.a('array');
          response.body.data.length.should.not.equal(0);
          done();
        });
    });

    it(`should return a 404 error if the there's no user with the given email
    specified is not in the DB`, (done) => {
      chai.request(app)
        .get('/api/v1/users/no-user@gmail.com/accounts')
        .send({ token: cashierToken })
        .end((error, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error
            .should.equal('No User found with the given email');
          done();
        });
    });

    it(`should return an error if the user tries to get the list
    of accounts that is not theirs`, (done) => {
      chai.request(app)
        .get('/api/v1/users/user@gmail.com/accounts')
        .send({ token: userToken2 })
        .end((error, response) => {
          response.should.have.status(403);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error
            .should.equal('You can only view your own transaction history');
          done();
        });
    });
  });
});
