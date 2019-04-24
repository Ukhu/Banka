import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../API/app';
import users from '../API/models/user';

chai.should();

chai.use(chaiHttp);

describe('TRANSACTIONS', () => {
  describe('POST /transactions/<accountNumber>/credit', () => {
    let userToken;
    let userid;
    let cashierToken;
    let userAccountNum;

    before((done) => {
      const userDetails = {
        email: 'depositor@gmail.com',
        firstName: 'Money',
        lastName: 'Depositor',
        password: 'credit1',
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
      const cashierDetails = {
        email: 'cashier@gmail.com',
        firstName: 'Staff',
        lastName: 'Cashier',
        password: 'cashier1',
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

    it(`should successfully credit the user bank account if the
    correct details are provided`, (done) => {
      const creditTransDetails = {
        type: 'credit',
        accountNumber: String(userAccountNum),
        amount: '400.50',
        token: cashierToken,
      };

      chai.request(app)
        .post(`/api/v1/transactions/${userAccountNum}/credit`)
        .send(creditTransDetails)
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.keys('status', 'data');
          response.body.data.should.be.a('object');
          response.body.data.should.have
            .keys('transactionId', 'accountNumber', 'amount', 'cashier',
              'transactionType', 'accountBalance');
          done();
        });
    });

    it(`should return a 404 Not Found Error if there is no bank account 
    for the specified account number`, (done) => {
      const creditTransDetails = {
        type: 'credit',
        accountNumber: '1234567',
        amount: '400.50',
        token: cashierToken,
      };

      chai.request(app)
        .post('/api/v1/transactions/1234567/credit')
        .send(creditTransDetails)
        .end((error, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should
            .equal('Account not found for the given account number');
          done();
        });
    });

    it(`should return a 403 Forbidden Error if a user who is not a
    cashier tries to access the endpoint`, (done) => {
      const creditTransDetails = {
        type: 'credit',
        accountNumber: String(userAccountNum),
        amount: '400.50',
        token: userToken,
      };

      chai.request(app)
        .post(`/api/v1/transactions/${userAccountNum}/credit`)
        .send(creditTransDetails)
        .end((error, response) => {
          response.should.have.status(403);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should
            .equal('FORBIDDEN - Only Cashier can make this transaction!');
          done();
        });
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
          userid = response.body.data.id;
          userToken = response.body.data.token;
          done();
        });
    });

    before((done) => {
      const cashierDetails = {
        email: 'cashier2@gmail.com',
        firstName: 'Staff',
        lastName: 'Cashier',
        password: 'cashier2',
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
        userId: userid,
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
        type: 'credit',
        accountNumber: String(userAccountNum),
        amount: '5000',
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

    it(`should successfully debit the user bank account if the
    correct details are provided`, (done) => {
      const debitTransDetails = {
        type: 'debit',
        accountNumber: String(userAccountNum),
        amount: '400.50',
        token: cashierToken,
      };

      chai.request(app)
        .post(`/api/v1/transactions/${userAccountNum}/debit`)
        .send(debitTransDetails)
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.keys('status', 'data');
          response.body.data.should.be.a('object');
          response.body.data.should.have
            .keys('transactionId', 'accountNumber', 'amount', 'cashier',
              'transactionType', 'accountBalance');
          done();
        });
    });

    it(`should return a 400 Bad Request Error if the user tries
    to withdraw above his account balance`, (done) => {
      const debitTransDetails = {
        type: 'debit',
        accountNumber: String(userAccountNum),
        amount: '6720.55',
        token: cashierToken,
      };

      chai.request(app)
        .post(`/api/v1/transactions/${userAccountNum}/debit`)
        .send(debitTransDetails)
        .end((error, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.keys('status', 'error');
          response.body.error.should.be.a('string');
          response.body.error.should.equal('Insufficient Funds');
          done();
        });
    });

    it(`should return a 404 Not Found Error if there is no bank 
    account for the specified account number`, (done) => {
      const debitTransDetails = {
        type: 'debit',
        accountNumber: '1234567',
        amount: '400.50',
        token: cashierToken,
      };

      chai.request(app)
        .post('/api/v1/transactions/1234567/debit')
        .send(debitTransDetails)
        .end((error, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should
            .equal('Account not found for the given account number');
          done();
        });
    });

    it(`should return a 403 Forbidden Error if a user who is
    not a cashier tries to access the endpoint`, (done) => {
      const debitTransDetails = {
        type: 'debit',
        accountNumber: String(userAccountNum),
        amount: '400.50',
        token: userToken,
      };

      chai.request(app)
        .post(`/api/v1/transactions/${userAccountNum}/debit`)
        .send(debitTransDetails)
        .end((error, response) => {
          response.should.have.status(403);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error.should
            .equal('FORBIDDEN - Only Cashier can make this transaction!');
          done();
        });
    });
  });

  describe('GET /transactions/<transaction-id>', () => {
    let userToken;
    let cashierToken;
    let userAccountNum;
    let id;

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
        .end((error, response) => {
          id = response.body.data.transactionId;
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

    it('should successfully get the details of a particular transaction',
      (done) => {
        chai.request(app)
          .get(`/api/v1/transactions/${id}`)
          .send({ token: userToken })
          .end((error, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('data');
            response.body.data.should.be.a('array');
            response.body.data.length.should.equal(1);
            done();
          });
      });

    it(`it should return a 404 error if the transaction Id specified is
    not in the DB`,
    (done) => {
      chai.request(app)
        .get('/api/v1/transactions/40e6215d-b5c6-4896-987c-f30f3678f608')
        .send({ token: userToken })
        .end((error, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.be.a('string');
          response.body.error
            .should.equal('Account not found for the given ID');
          done();
        });
    });
  });
});
