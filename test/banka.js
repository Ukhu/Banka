import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../API/app';

chai.should();

chai.use(chaiHttp);
// Parent block

describe('Authentication', () => {
  describe('POST /auth/signup', () => {
    before((done) => {
      const userDetails1 = {
        email: 'osaukhu1.bi@gmail.com',
        firstname: 'Osaukhu',
        lastname: 'Iyamuosa',
        password: 'ukhu7',
        type: 'client',
        isAdmin: 'false',
      };
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails1)
        .end();
      done();
    });

    it('should create user account if all fields are filled correctly', (done) => {
      const userDetails2 = {
        email: 'osaukhu2.bi@gmail.com',
        firstname: 'Osaukhu',
        lastname: 'Iyamuosa',
        password: 'ukhu7',
        type: 'client',
        isAdmin: 'false',
      };
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails2)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          done();
        });
    });

    it('should respond with a 400 Bad Request Error if user tries to signup with an already existent email', (done) => {
      const userDetails3 = {
        email: 'osaukhu1.bi@gmail.com',
        firstname: 'Osaukhu',
        lastname: 'Iyamuosa',
        password: 'ukhu7',
        type: 'client',
        isAdmin: 'false',
      };
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails3)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          done();
        });
    });

    it('should respond with a 400 Bad Request Error if any of the fields are missing', (done) => {
      const userDetails4 = {
        email: 'osaukhu4.bi@gmail.com',
        lastname: 'Iyamuosa',
        password: 'ukhu7',
        type: 'client',
        isAdmin: 'false',
      };
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails4)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.be.a('array');
          done();
        });
    });

    it('should respond with a 400 Bad Request Error if any of the fields are empty or undefined', (done) => {
      const userDetails5 = {
        email: 'osaukhu5.bi@gmail.com',
        firstname: '',
        lastname: 'Iyamuosa',
        password: 'ukhu7',
        type: 'client',
        isAdmin: 'false',
      };
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails5)
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
    let userid;

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
          userid = res.body.data.id;
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
        userId: userid,
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
        userId: 0,
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
        userId: userid,
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
        userId: userid,
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
        userId: userid,
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
        userId: userid,
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

  describe('PATCH /accounts/<accountNumber>', () => {
    let userToken;
    let userid;
    let staffToken;
    let userAccountNum;

    before((done) => {
      const userDetails = {
        email: 'dummyuser@gmail.com',
        firstname: 'Dummy',
        lastname: 'User',
        password: 'userdummy1',
        type: 'client',
        isAdmin: 'false',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails)
        .end((err, res) => {
          userid = res.body.data.id;
          userToken = res.body.data.token;

          if (res) {
            Promise.resolve(done());
          } else {
            Promise.resolve(done(err));
          }
        });
    });

    before((done) => {
      const staffDetails = {
        email: 'staff@gmail.com',
        firstname: 'Staff',
        lastname: 'Admin',
        password: 'admin123',
        type: 'staff',
        isAdmin: 'true',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(staffDetails)
        .end((err, res) => {
          staffToken = res.body.data.token;
          if (res) {
            Promise.resolve(done());
          } else {
            Promise.reject(done(err));
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
        .end((err, res) => {
          userAccountNum = res.body.data.accountNumber;
          if (res) {
            Promise.resolve(done());
          } else {
            Promise.reject(done(err));
          }
        });
    });

    it('should successfully update the user status to active or dormant', (done) => {
      const token = {
        token: staffToken,
      };

      chai.request(app)
        .patch(`/api/v1/accounts/${userAccountNum}`)
        .send(token)
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.have.keys('accountNumber', 'status');
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
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          res.body.error.should.equal('No account found for the specified entity');
        });
      done();
    });

    it('should return a 403 Forbidden Error if an unauthenticated user tries to access the endpoint', (done) => {
      chai.request(app)
        .patch(`/api/v1/accounts/${userAccountNum}`)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          res.body.error.should.equal('FORBIDDEN REQUEST - No Token Provided');
        });
      done();
    });

    it('should return a 403 Forbidden Error if a user who is not a staff tries to access the endpoint', (done) => {
      const token = {
        token: userToken,
      };

      chai.request(app)
        .patch(`/api/v1/accounts/${userAccountNum}`)
        .send(token)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          res.body.error.should.equal('FORBIDDEN - Only Staff can access make this transaction!');
        });
      done();
    });
  });
});

describe('Transactions', () => {
  describe('POST /transactions/<accountNumber>/credit', () => {
    let userToken;
    let userid;
    let cashierToken;
    let userAccountNum;

    before((done) => {
      const userDetails = {
        email: 'depositor@gmail.com',
        firstname: 'Money',
        lastname: 'Depositor',
        password: 'credit1',
        type: 'client',
        isAdmin: 'false',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails)
        .end((err, res) => {
          userid = res.body.data.id;
          userToken = res.body.data.token;

          if (res) {
            Promise.resolve(done());
          } else {
            Promise.resolve(done(err));
          }
        });
    });

    before((done) => {
      const cashierDetails = {
        email: 'cashier@gmail.com',
        firstname: 'Staff',
        lastname: 'Cashier',
        password: 'cashier1',
        type: 'staff',
        isAdmin: 'false',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(cashierDetails)
        .end((err, res) => {
          cashierToken = res.body.data.token;
          if (res) {
            Promise.resolve(done());
          } else {
            Promise.reject(done(err));
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
        .end((err, res) => {
          userAccountNum = res.body.data.accountNumber;
          if (res) {
            Promise.resolve(done());
          } else {
            Promise.reject(done(err));
          }
        });
    });

    it('should successfully credit the user bank account if the correct details are provided', (done) => {
      const creditTransDetails = {
        type: 'credit',
        accountNumber: String(userAccountNum),
        amount: '400.50',
        token: cashierToken,
      };

      chai.request(app)
        .post(`/api/v1/transactions/${userAccountNum}/credit`)
        .send(creditTransDetails)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.keys('status', 'data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.keys('transactionId', 'accountNumber', 'amount', 'cashier',
            'transactionType', 'accountBalance');
        });
      done();
    });

    it('should return a 404 Not Found Error if there is no bank account for the specified account number', (done) => {
      const creditTransDetails = {
        type: 'credit',
        accountNumber: '1234567',
        amount: '400.50',
        token: cashierToken,
      };

      chai.request(app)
        .post('/api/v1/transactions/1234567/credit')
        .send(creditTransDetails)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          res.body.error.should.equal('Account not found for the given account number');
        });
      done();
    });

    it('should return a 403 Forbidden Error if a user who is not a cashier tries to access the endpoint', (done) => {
      const creditTransDetails = {
        type: 'credit',
        accountNumber: String(userAccountNum),
        amount: '400.50',
        token: userToken,
      };

      chai.request(app)
        .post(`/api/v1/transactions/${userAccountNum}/credit`)
        .send(creditTransDetails)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          res.body.error.should.equal('FORBIDDEN - Only Cashier can access make this transaction!');
        });
      done();
    });

    it('should return a 400 Bad Request Error if the account number in the request params does not match the one in the body', (done) => {
      const creditTransDetails = {
        type: 'credit',
        accountNumber: String(1234567),
        amount: '400.50',
        token: cashierToken,
      };

      chai.request(app)
        .post('/api/v1/transactions/7654321/credit')
        .send(creditTransDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          res.body.error.should.equal('Account number in params must match account number given');
        });
      done();
    });
  });

  describe('POST /transactions/<accountNumber>/debit', () => {
    let userToken;
    let userid;
    let cashierToken;
    let userAccountNum;

    before((done) => {
      const userDetails = {
        email: 'withdrawer@gmail.com',
        firstname: 'Money',
        lastname: 'Withdrawer',
        password: 'debit1',
        type: 'client',
        isAdmin: 'false',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails)
        .end((err, res) => {
          userid = res.body.data.id;
          userToken = res.body.data.token;

          if (res) {
            Promise.resolve(done());
          } else {
            Promise.resolve(done(err));
          }
        });
    });

    before((done) => {
      const cashierDetails = {
        email: 'cashier2@gmail.com',
        firstname: 'Staff',
        lastname: 'Cashier',
        password: 'cashier2',
        type: 'staff',
        isAdmin: 'false',
      };

      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(cashierDetails)
        .end((err, res) => {
          cashierToken = res.body.data.token;
          if (res) {
            Promise.resolve(done());
          } else {
            Promise.reject(done(err));
          }
        });
    });

    before((done) => {
      const userCreateAccDetails = {
        userId: userid,
        type: 'savings',
        token: userToken,
      };

      chai.request(app)
        .post('/api/v1/accounts')
        .send(userCreateAccDetails)
        .end((err, res) => {
          userAccountNum = res.body.data.accountNumber;
          if (res) {
            Promise.resolve(done());
          } else {
            Promise.reject(done(err));
          }
        });
    });

    before((done) => {
      const creditTransDetails = {
        type: 'credit',
        accountNumber: String(userAccountNum),
        amount: '5000',
        token: cashierToken,
      };

      chai.request(app)
        .post(`/api/v1/transactions/${userAccountNum}/credit`)
        .send(creditTransDetails)
        .end((err, res) => {
          if (res) {
            Promise.resolve(done());
          } else {
            Promise.reject(done(err));
          }
        });
    });

    it('should successfully debit the user bank account if the correct details are provided', (done) => {
      const debitTransDetails = {
        type: 'debit',
        accountNumber: String(userAccountNum),
        amount: '400.50',
        token: cashierToken,
      };

      chai.request(app)
        .post(`/api/v1/transactions/${userAccountNum}/debit`)
        .send(debitTransDetails)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.keys('status', 'data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.keys('transactionId', 'accountNumber', 'amount', 'cashier',
            'transactionType', 'accountBalance');
        });
      done();
    });

    it('should return a 400 Bad Request Error if the user tries to withdraw above his account balance', (done) => {
      const debitTransDetails = {
        type: 'debit',
        accountNumber: String(userAccountNum),
        amount: '6720.55',
        token: cashierToken,
      };

      chai.request(app)
        .post(`/api/v1/transactions/${userAccountNum}/debit`)
        .send(debitTransDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.keys('status', 'error');
          res.body.error.should.be.a('string');
          res.body.error.should.equal('Insufficient Funds');
        });
      done();
    });

    it('should return a 404 Not Found Error if there is no bank account for the specified account number', (done) => {
      const debitTransDetails = {
        type: 'debit',
        accountNumber: '1234567',
        amount: '400.50',
        token: cashierToken,
      };

      chai.request(app)
        .post('/api/v1/transactions/1234567/debit')
        .send(debitTransDetails)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          res.body.error.should.equal('Account not found for the given account number');
        });
      done();
    });

    it('should return a 403 Forbidden Error if a user who is not a cashier tries to access the endpoint', (done) => {
      const debitTransDetails = {
        type: 'debit',
        accountNumber: String(userAccountNum),
        amount: '400.50',
        token: userToken,
      };

      chai.request(app)
        .post(`/api/v1/transactions/${userAccountNum}/debit`)
        .send(debitTransDetails)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          res.body.error.should.equal('FORBIDDEN - Only Cashier can access make this transaction!');
        });
      done();
    });

    it('should return a 400 Bad Request Error if the account number in the request params does not match the one in the body', (done) => {
      const debitTransDetails = {
        type: 'debit',
        accountNumber: String(1234567),
        amount: '400.50',
        token: cashierToken,
      };

      chai.request(app)
        .post('/api/v1/transactions/7654321/debit')
        .send(debitTransDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          res.body.error.should.equal('Account number in params must match account number given');
        });
      done();
    });
  });
});
