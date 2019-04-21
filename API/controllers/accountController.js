import users from '../models/user';
import accounts from '../models/account';
import handleNewAccount from '../helpers/handleNewAccount';

/**
 * @class AccountController
 * @classdesc Performs operations on the bank account
 */

export default class AccountController {
  /**
   * Creates a bank account for a user
   * @param {object} request
   * @param {object} response
   * @returns {object}
   * A response status and the created account or an error message
   * @memberof AccountController
   */

  static createAccount(request, response) {
    const { type } = request.body;

    const userQuery = `
    SELECT * FROM users
    WHERE id=$1
  `;

    users.query(userQuery, [`{${request.decoded.id}}`])
      .then((userResponse) => {
        const [accountOwner] = userResponse.rows;

        const accountNumber = Math.floor(
          Math.random() * (10000000 - 1000000) + 1000000,
        );
        const newAccount = [
          accountNumber,
          `{${accountOwner.id}}`,
          type,
          'active',
          0.00,
        ];

        const accountQuery = `
            INSERT INTO accounts(account_number, owner, type, status, balance)
            VALUES($1, $2, $3, $4, $5)
            returning *;
          `;

        accounts.query(accountQuery, newAccount)
          .then((accountResponse) => {
            handleNewAccount(response, accountResponse.rows[0], accountOwner);
          });
      }).catch((err) => {
        response.status(500).json({
          status: 500,
          error: 'Error occured!',
        });
      });
  }

  /**
   * Gets the details of a particular account
   * @param {object} request
   * @param {object} response
   * @returns {object}
   * A response status and the created account or an error message
   * @memberof AccountController
   */

  static getAllAccounts(request, response) {
    const accountQuery = `
      SELECT * FROM accounts;
    `;

    accounts.query(accountQuery)
      .then((accountResponse) => {
        response.status(200).json({
          status: 200,
          data: accountResponse.rows,
        });
      })
      .catch(() => {
        response.status(500).json({
          status: 500,
          error: 'Error occured!',
        });
      });
  }

  /**
   * Gets the details of a particular account
   * @param {object} request
   * @param {object} response
   * @returns {object}
   * A response status and the created account or an error message
   * @memberof AccountController
   */

  static getAccountDetails(request, response) {
    const { accountNumber } = request.params;

    const accountQuery = `
      SELECT * FROM accounts
      WHERE account_number=$1
    `;

    accounts.query(accountQuery, [accountNumber])
      .then((accountResponse) => {
        if (accountResponse.rows.length > 0) {
          response.status(200).json({
            status: 200,
            data: accountResponse.rows,
          });
        } else {
          response.status(404).json({
            status: 404,
            error: 'No account found for the given account number',
          });
        }
      })
      .catch(() => {
        response.status(500).json({
          status: 500,
          error: 'Error occured!',
        });
      });
  }

  /**
   * Activates or deactivates a user account
   * @param {object} request
   * @param {object} response
   * @returns {object}
   * the user's new account status on success or an error message
   * @memberof AccountController
   */

  static activateOrDeactivate(request, response) {
    const { accountNumber } = request.params;
    const { status } = request.body;

    const accountQuery = `
      SELECT * FROM accounts
      WHERE account_number=$1
    `;

    accounts.query(accountQuery, [Number(accountNumber)])
      .then((accountResponse) => {
        if (accountResponse.rows.length > 0) {
          const accountQuery2 = `
            UPDATE accounts
            SET status=$1
            WHERE account_number=$2
            returning *;
          `;

          accounts.query(accountQuery2, [status, Number(accountNumber)])
            .then((accountResponse2) => {
              const [updatedAccount] = accountResponse2.rows;

              response.status(200).json({
                status: 200,
                data: {
                  accountNumber: updatedAccount.account_number,
                  status,
                },
              });
            });
        } else {
          response.status(404).json({
            status: 404,
            error: 'No account found for the given account number',
          });
        }
      })
      .catch(() => {
        response.status(500).json({
          status: 500,
          error: 'Error occured!',
        });
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

    const accountQuery = `
      SELECT id FROM accounts
      WHERE account_number=$1;
    `;

    accounts.query(accountQuery, [accountNumber])
      .then((accountResponse) => {
        if (accountResponse.rows.length > 0) {
          const [account] = accountResponse.rows;

          const deleteQuery = `
            DELETE FROM accounts
            WHERE id=$1
          `;

          accounts.query(deleteQuery, [`{${account.id}}`])
            .then(() => {
              response.status(200).json({
                status: 200,
                message: 'Account successfully deleted',
              });
            });
        } else {
          response.status(404).json({
            status: 404,
            error: 'No account found for the given account number',
          });
        }
      })
      .catch((error) => {
        response.status(500).json({
          status: 500,
          error: 'Error occured!',
        });
      });
  }

  /**
   * Gets the transaction history of a particular account
   * @param {object} request
   * @param {object} response
   * @returns {object} A message signifying a successful deletion or an error
   * @memberof AccountController
   */

  static transactionHistory(request, response) {
    const { accountNumber } = request.params;

    const accountQuery = `
      SELECT account_number FROM accounts
      WHERE account_number=$1;
    `;


    accounts.query(accountQuery, [accountNumber])
      .then((accountResponse) => {
        if (accountResponse.rows.length > 0) {
          const [account] = accountResponse.rows;

          const transactionQuery = `
            SELECT id, created_on, type, account_number,
            amount, old_balance, new_balance
            FROM transactions
            WHERE account_number=$1
          `;

          accounts.query(transactionQuery, [account.account_number])
            .then((transactionResponse) => {
              response.status(200).json({
                status: 200,
                data: transactionResponse.rows,
              });
            });
        } else {
          response.status(404).json({
            status: 404,
            error: 'No account found for the given account number',
          });
        }
      })
      .catch((error) => {
        response.status(500).json({
          status: 500,
          error: 'Error occured!',
        });
      });
  }
}
