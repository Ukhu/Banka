import { users } from './userController';
import handleNewAccount from '../helpers/handleNewAccount';

export const accountdb = [];

export class AccountController {
  static createAccount(req, res) {
    const { userId, type } = req.body;

    const owner = users.filter(user => user.id === Number(userId));

    if (owner.length > 0) {
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

      handleNewAccount(res, newAccount, owner[0]);
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
