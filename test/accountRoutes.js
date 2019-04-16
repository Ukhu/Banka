import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../API/app';

chai.should();

chai.use(chaiHttp);

describe('ACCOUNTS', () => {
  describe('POST /accounts', () => {
    let resToken;
    let userid;

    before((done) => {
      const userDetails = {
        email: 'oshu.bi@gmail.com',
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
          userid = response.body.data.id;
          resToken = response.body.data.token;
          if (response) {
            Promise.resolve(done());
          } else {
            Promise.resolve(done(error));
          }
        });
    });

    it('should create a bank account if all fields are filled correctly', (done) => {
      const accountOpeningDetails = {
        userId: userid,
        type: 'current',
        token: resToken,
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .send(accountOpeningDetails)
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('data');
          response.body.data.should.have.property('firstName');
          response.body.data.should.have.property('lastName');
          response.body.data.should.have.property('email');
          done();
        });
    });

    it('should return a 404 Not Found error if there is no user in the DB with the given userID', (done) => {
      const accountOpeningDetails = {
        userId: 0,
        type: 'current',
        token: resToken,
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .send(accountOpeningDetails)
        .end((error, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          done();
        });
    });

    it('should return a 403 Forbidden Error if no token is provided', (done) => {
      const accountOpeningDetails = {
        userId: userid,
        type: 'current',
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .send(accountOpeningDetails)
        .end((error, response) => {
          response.should.have.status(403);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          done();
        });
    });

    it('should return a 403 Forbidden Error if a wrong token is provided', (done) => {
      const accountOpeningDetails = {
        userId: userid,
        type: 'current',
        token: 'wr@ngtoke#',
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .send(accountOpeningDetails)
        .end((error, response) => {
          response.should.have.status(403);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          done();
        });
    });

    it('should return a 400 Bad Request Error if any of the other fields are missing', (done) => {
      const accountOpeningDetails = {
        userId: userid,
        token: resToken,
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .send(accountOpeningDetails)
        .end((error, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('errors');
          done();
        });
    });

    it('should return a 400 Bad Request Error if any of the other fields are of the wrong type or value', (done) => {
      const accountOpeningDetails = {
        userId: userid,
        token: resToken,
      };
      chai.request(app)
        .post('/api/v1/accounts')
        .send(accountOpeningDetails)
        .end((error, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('errors');
          done();
        });
    });
  });

  describe('PATCH /accounts/<accountNumber>', () => {
    let userToken;
    let userid;
    let staffToken;
    let userAccountNumber;

    before((done) => {
      const userDetails = {
        email: 'dummyuser@gmail.com',
        firstName: 'Dummy',
        lastName: 'User',
        password: 'userdummy1',
        type: 'client',
        isAdmin: 'false',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails)
        .end((error, response) => {
          userid = response.body.data.id;
          userToken = response.body.data.token;

          if (response) {
            Promise.resolve(done());
          } else {
            Promise.resolve(done(error));
          }
        });
    });

    before((done) => {
      const staffDetails = {
        email: 'staff@gmail.com',
        firstName: 'Staff',
        lastName: 'Admin',
        password: 'admin123',
        type: 'staff',
        isAdmin: 'true',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(staffDetails)
        .end((error, response) => {
          staffToken = response.body.data.token;
          if (response) {
            Promise.resolve(done());
          } else {
            Promise.reject(done(error));
          }
        });
    });

    before((done) => {
      const userCreateAccDetails = {
        userId: userid,
        type: 'current',
        token: userToken,
      };

      chai.request(app)
        .post('/api/v1/accounts')
        .send(userCreateAccDetails)
        .end((error, response) => {
          userAccountNumber = response.body.data.accountNumber;
          if (response) {
            Promise.resolve(done());
          } else {
            Promise.reject(done(error));
          }
        });
    });

    it('should successfully update the user status to active or dormant', (done) => {
      const token = {
        token: staffToken,
      };

      chai.request(app)
        .patch(`/api/v1/accounts/${userAccountNumber}`)
        .send(token)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('data');
          response.body.data.should.have.keys('accountNumber', 'status');
        });
      done();
    });

    it('should return a 404 Not Found Error if the account number specified in the params is not in the database', (done) => {
      const token = {
        token: staffToken,
      };

      chai.request(app)
        .patch('/api/v1/accounts/2468123')
        .send(token)
        .end((error, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should.equal('No account found for the provided entity');
        });
      done();
    });

    it('should return a 403 Forbidden Error if an unauthenticated user tries to access the endpoint', (done) => {
      chai.request(app)
        .patch(`/api/v1/accounts/${userAccountNumber}`)
        .end((error, response) => {
          response.should.have.status(403);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should.equal('FORBIDDEN REQUEST - No Token Provided');
        });
      done();
    });

    it('should return a 403 Forbidden Error if a user who is not a staff tries to access the endpoint', (done) => {
      const token = {
        token: userToken,
      };

      chai.request(app)
        .patch(`/api/v1/accounts/${userAccountNumber}`)
        .send(token)
        .end((error, response) => {
          response.should.have.status(403);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should.equal('FORBIDDEN - Only Staff can access make this transaction!');
        });
      done();
    });
  });

  describe('DELETE /accounts/<accountNumber>', () => {
    let userToken;
    let userid;
    let staffToken;
    let userAccountNum;

    before((done) => {
      const userDetails = {
        email: 'dummyuser2@gmail.com',
        firstName: 'Dummyy',
        lastName: 'User',
        password: 'userdummy2',
        type: 'client',
        isAdmin: 'false',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails)
        .end((error, response) => {
          userid = response.body.data.id;
          userToken = response.body.data.token;

          if (response) {
            Promise.resolve(done());
          } else {
            Promise.resolve(done(error));
          }
        });
    });

    before((done) => {
      const staffDetails = {
        email: 'admin2@gmail.com',
        firstName: 'Staff',
        lastName: 'Adminn',
        password: 'admin2',
        type: 'staff',
        isAdmin: 'true',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(staffDetails)
        .end((error, response) => {
          staffToken = response.body.data.token;
          if (response) {
            Promise.resolve(done());
          } else {
            Promise.reject(done(error));
          }
        });
    });

    before((done) => {
      const userCreateAccDetails = {
        userId: userid,
        type: 'current',
        token: userToken,
      };

      chai.request(app)
        .post('/api/v1/accounts')
        .send(userCreateAccDetails)
        .end((error, response) => {
          userAccountNum = response.body.data.accountNumber;
          if (response) {
            Promise.resolve(done());
          } else {
            Promise.reject(done(error));
          }
        });
    });

    it('should successfully delete a bank account', (done) => {
      const token = {
        token: staffToken,
      };

      chai.request(app)
        .delete(`/api/v1/accounts/${userAccountNum}`)
        .send(token)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('message');
          response.body.message.should.equal('Account successfully deleted');
        });
      done();
    });

    it('should return a 404 Not Found Error if the account number specified in the params is not in the database', (done) => {
      const token = {
        token: staffToken,
      };

      chai.request(app)
        .delete('/api/v1/accounts/2468123')
        .send(token)
        .end((error, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should.equal('No account found for the provided entity');
        });
      done();
    });

    it('should return a 403 Forbidden Error if an unauthenticated user tries to access the endpoint', (done) => {
      chai.request(app)
        .delete(`/api/v1/accounts/${userAccountNum}`)
        .end((error, response) => {
          response.should.have.status(403);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should.equal('FORBIDDEN REQUEST - No Token Provided');
        });
      done();
    });

    it('should return a 403 Forbidden Error if a user who is not a staff tries to access the endpoint', (done) => {
      const token = {
        token: userToken,
      };

      chai.request(app)
        .delete(`/api/v1/accounts/${userAccountNum}`)
        .send(token)
        .end((error, response) => {
          response.should.have.status(403);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should.equal('FORBIDDEN - Only Staff can access make this transaction!');
        });
      done();
    });
  });
});
