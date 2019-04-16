import { users } from './userController';
import handleNewAccount from '../helpers/handleNewAccount';

export const accountdb = [];

/**
 * @class AccountController
 * @classdesc Performs operations on the bank account
 */

export class AccountController {
  /**
   * Creates a bank account for a user
   * @param {object} request
   * @param {object} response
   * @returns {object} A response status and the created account or an error message
   * @memberof AccountController
   */

  static createAccount(request, response) {
    const { userId, type } = request.body;

    const owner = users.find(user => user.id === Number(userId));

    if (owner) {
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

      handleNewAccount(response, newAccount, owner);
    } else {
      response.status(404).json({ status: 404, error: 'Account owner not found' });
    }
  }

  /**
   * Activates or deactivates a user account
   * @param {object} request
   * @param {object} response
   * @returns {object} the user's new account status on success or an error message
   * @memberof AccountController
   */

  static activateOrDeactivate(request, response) {
    const { accountNumber } = request.params;
    const foundAccount = accountdb.find(account => account.accountNumber === Number(accountNumber));
    if (foundAccount) {
      if (foundAccount.status === 'active') {
        foundAccount.status = 'dormant';
      } else {
        foundAccount.status = 'active';
      }
      accountdb.find(account => account.accountNumber === Number(accountNumber))
        .status = foundAccount.status;
      return response.status(200).json({
        status: 200,
        data: {
          accountNumber: foundAccount.accountNumber,
          status: foundAccount.status,
        },
      });
    }
    return response.status(404).json({
      status: 404,
      error: 'No account found for the provided entity',
    });
  }

  /**
   * Deletes a user bank account
   * @param {object} request
   * @param {object} response
   * @returns {object} A message signifying a successful deletion or an error
   * @memberof AccountController
   */

  static deleteAccount(request, response) {
    const { accountNumber } = request.params;
    const foundAccount = accountdb.find(account => account.accountNumber === Number(accountNumber));
    const index = accountdb.indexOf(foundAccount);

    if (index >= 0) {
      accountdb.splice(index, 1);

      return response.status(200).json({
        status: 200,
        message: 'Account successfully deleted',
      });
    }
    return response.status(404).json({
      status: 404,
      error: 'No account found for the provided entity',
    });
  }
}

// const users = [...accountdb];
// export default users;
