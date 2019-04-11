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
    const foundAccount = accountdb.filter(acc => acc.accountNumber === Number(accountNumber));
    if (foundAccount.length > 0) {
      if (foundAccount[0].status === 'active') {
        foundAccount[0].status = 'dormant';
      } else {
        foundAccount[0].status = 'active';
      }
      accountdb.filter(acc => acc.accountNumber === Number(accountNumber))[0]
        .status = foundAccount[0].status;
      return res.status(200).json({
        status: 200,
        data: {
          accountNumber: foundAccount[0].accountNumber,
          status: foundAccount[0].status,
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
    const foundAccount = accountdb.filter(acc => acc.accountNumber === Number(accountNumber));
    const index = accountdb.indexOf(...foundAccount);

    if (index >= 0) {
      accountdb.splice(index, 1);

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
