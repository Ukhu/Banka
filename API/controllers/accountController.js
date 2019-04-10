import { users } from './userController';

export const accountdb = [];

export class AccountController {
  static createAccount(req, res) {
    const { userId, type } = req.body;

    const newAccount = {
      id: accountdb.length + 100,
      accountNumber: Math.floor(Math.random() * (10000000 - 1000000) + 1000000),
      createdOn: new Date().toLocaleString(),
      owner: Number(userId),
      type,
      status: 'active',
      balance: 0.00,
    };

    accountdb.push(newAccount);

    let owner;

    users.forEach((user) => {
      if (user.id === Number(userId)) {
        owner = {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        };
      }
      return owner;
    });

    if (owner) {
      res.status(201).json({
        status: 201,
        data: {
          accountNumber: newAccount.accountNumber,
          firstname: owner.firstname,
          lastname: owner.lastname,
          email: owner.email,
          type,
          openingBalance: newAccount.balance,
        },
      });
    } else {
      res.status(404).json({ status: 404, error: 'Account owner not found' });
    }
  }

  static activateOrDeactivate(req, res) {
    const { accountNumber } = req.params;

    let foundAccount;

    accountdb.forEach((acc) => {
      if (acc.accountNumber === Number(accountNumber)) {
        foundAccount = {
          accNum: acc.accountNumber,
          status: acc.status,
        };
      }
    });

    if (foundAccount) {
      if (foundAccount.status === 'active') {
        foundAccount.status = 'dormant';
      } else {
        foundAccount.status = 'active';
      }

      accountdb.forEach((acc) => {
        if (acc.accountNumber === Number(accountNumber)) {
          acc.status = foundAccount.status;
        }
      });
      return res.status(200).json({
        status: 200,
        data: {
          accountNumber: foundAccount.accNum,
          status: foundAccount.status,
        },
      });
    }

    return res.status(404).json({
      status: 404,
      error: 'No account found for the provided entity',
    });
  }

  static deleteAccount(req, res) {
    const { accountNumber } = req.params;

    let accountIndex;

    accountdb.forEach((acc) => {
      if (acc.accountNumber === Number(accountNumber)) {
        accountIndex = accountdb.indexOf(acc);
      }
    });

    if (accountIndex) {
      accountdb.splice(accountIndex, 1);

      return res.status(200).json({
        status: 200,
        message: 'Account successfully deleted',
      });
    }

    return res.status(404).json({
      status: 404,
      error: 'No account found for the provided entity',
    });
  }
}
