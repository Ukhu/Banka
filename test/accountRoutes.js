import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../API/app';
import users from '../API/models/user';

chai.should();

chai.use(chaiHttp);

describe('ACCOUNTS', () => {
  describe('POST /accounts', () => {
    let resToken;
    let userid;

    before((done) => {
      const userDetails = {
        email: 'osaukhu.bi@gmail.com',
        firstName: 'Osaukhu',
        lastName: 'Iyamuosa',
        password: 'ukhu123',
        type: 'client',
        isAdmin: 'false',
      };
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails)
        .end((error, response) => {
          userid = response.body.data.id;
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

    it('should create a bank account if all fields are filled correctly',
      (done) => {
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

    it('should return a 403 Forbidden Error if no token is provided',
      (done) => {
        const accountOpeningDetails = {
          userId: userid,
          type: 'current',
        };
        chai.request(app)
          .post('/api/v1/accounts')
          .send(accountOpeningDetails)
          .end((error, response) => {
            response.should.have.status(401);
            response.body.should.be.a('object');
            response.body.should.have.property('error');
            response.body.error.should.equal('Unauthorized Access');
            done();
          });
      });

    it('should return a 403 Forbidden Error if a wrong token is provided',
      (done) => {
        const accountOpeningDetails = {
          userId: userid,
          type: 'current',
          token: 'wr@ngtoke#',
        };
        chai.request(app)
          .post('/api/v1/accounts')
          .send(accountOpeningDetails)
          .end((error, response) => {
            response.should.have.status(401);
            response.body.should.be.a('object');
            response.body.should.have.property('error');
            response.body.error.should.equal('Unauthorized Access');
            done();
          });
      });

    it(`should return a 400 Bad Request Error if any of the
    other fields are missing`, (done) => {
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

    it(`should return a 400 Bad Request Error if any of the other 
    fields are of the wrong type or value`, (done) => {
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

  describe('GET /accounts', () => {
    let userToken;
    let userid;
    let staffToken;

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
          done();
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
          done();
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

    it('should successfully return all the accounts in the DB',
      (done) => {
        chai.request(app)
          .get('/api/v1/accounts')
          .send({ token: staffToken })
          .end((error, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('data');
            response.body.data.should.be.a('array');
            done();
          });
      });
  });

  describe('GET /accounts?status=active', () => {
    let userToken;
    let staffToken;

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
          userToken = response.body.data.token;
          done();
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
          done();
        });
    });

    before((done) => {
      const userCreateAccDetails = {
        type: 'current',
        token: userToken,
      };

      chai.request(app)
        .post('/api/v1/accounts')
        .send(userCreateAccDetails)
        .end((error, response) => {
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
        .end((error, response) => {
          done();
        });
    });

    before((done) => {
      const userCreateAccDetails = {
        type: 'current',
        token: userToken,
      };

      chai.request(app)
        .post('/api/v1/accounts')
        .send(userCreateAccDetails)
        .end((error, response) => {
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

    it(`should successfully return the accounts in the database
      based on the query filter`,
    (done) => {
      chai.request(app)
        .get('/api/v1/accounts?status=active')
        .send({ token: staffToken })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('data');
          response.body.data.should.be.a('array');
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
          done();
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
          done();
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

    it('should successfully update the user status to active or dormant',
      (done) => {
        const token = {
          status: 'active',
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
            done();
          });
      });

    it(`should return a 404 Not Found Error if the account number specified
    in the params is not in the database`, (done) => {
      const token = {
        status: 'dormant',
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
          response.body.error.should
            .equal('No account found for the given account number');
          done();
        });
    });

    it(`should return a 403 Forbidden Error if a user who is not a 
    staff tries to access the endpoint`, (done) => {
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
          response.body.error.should
            .equal('Forbidden Access! Only a staff can carry out this operation');
          done();
        });
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
          done();
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
          done();
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
          done();
        });
    });

    it(`should return a 404 Not Found Error if the account number specified in
    the params is not in the database`, (done) => {
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
          response.body.error.should
            .equal('No account found for the given account number');
          done();
        });
    });
  });

  describe('GET /accounts/<accountNumber>/transactions', () => {
    let userToken;
    let userToken2;
    let cashierToken;
    let userAccountNum;

    before((done) => {
      const userDetails = {
        email: 'withdrawer@gmail.com',
        firstName: 'Money',
        lastName: 'Withdrawer',
        password: 'debit1',
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
        email: 'account2@gmail.com',
        firstName: 'Dummy',
        lastName: 'Owner',
        password: 'dmmyOwn12',
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
        email: 'cashier@gmail.com',
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
        .end((error, response) => {
          userAccountNum = response.body.data.accountNumber;
          done();
        });
    });

    before((done) => {
      const creditTransDetails = {
        amount: 5000,
        token: cashierToken,
      };

      chai.request(app)
        .post(`/api/v1/transactions/${userAccountNum}/credit`)
        .send(creditTransDetails)
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
        .get(`/api/v1/accounts/${userAccountNum}/transactions`)
        .send({ token: cashierToken })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('data');
          response.body.data.should.be.a('array');
          response.body.data.length.should.equal(1);
          done();
        });
    });

    it(`should return a 403 error if a user tries to get the
    transaction history of an account that is not theirs`, (done) => {
      chai.request(app)
        .get(`/api/v1/accounts/${userAccountNum}/transactions`)
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

    it(`should return a 404 error if the account number 
    specified is not in the DB`, (done) => {
      chai.request(app)
        .get('/api/v1/accounts/1234567/transactions')
        .send({ token: cashierToken })
        .end((error, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error
            .should.equal('No account found for the given account number');
          done();
        });
    });
  });

  describe('GET /accounts/accountNumber>', () => {
    let userToken;
    let userToken2;
    let cashierToken;
    let userAccountNum;

    before((done) => {
      const userDetails = {
        email: 'withdrawer@gmail.com',
        firstName: 'Money',
        lastName: 'Withdrawer',
        password: 'debit1',
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
        email: 'withdrawer2@gmail.com',
        firstName: 'Money',
        lastName: 'Withdrawer',
        password: 'debit1',
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
        email: 'cashier@gmail.com',
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
        .end((error, response) => {
          userAccountNum = response.body.data.accountNumber;
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

    it(`should successfully return the details of 
    the given account number`, (done) => {
      chai.request(app)
        .get(`/api/v1/accounts/${userAccountNum}`)
        .send({ token: userToken })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('data');
          response.body.data.should.be.a('array');
          response.body.data.length.should.not.equal(0);
          done();
        });
    });

    it(`should return a 404 error if the specified account
      number is not in the database`, (done) => {
      chai.request(app)
        .get('/api/v1/accounts/1098765')
        .send({ token: userToken })
        .end((error, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should
            .equal('No account found for the given account number');
          done();
        });
    });

    it(`should return an error if a user tries to view the
      details an account that isn't theirs`, (done) => {
      chai.request(app)
        .get(`/api/v1/accounts/${userAccountNum}`)
        .send({ token: userToken2 })
        .end((error, response) => {
          response.should.have.status(403);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should
            .equal('You can only view your own account details');
          done();
        });
    });
  });
});
