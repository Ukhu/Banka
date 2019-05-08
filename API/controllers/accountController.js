import users from '../models/user';
import accounts from '../models/account';
import { handleNewAccount } from '../helpers/handleNewEntity';
import { formatOutgoingCursor, formatIncomingCursor }
  from '../helpers/formatCursor';

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

        if (accountOwner.type === 'staff') {
          return response.status(403).json({
            status: 403,
            error: 'Staff cannot create a bank account',
          });
        }

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

        return accounts.query(accountQuery, newAccount)
          .then((accountResponse) => {
            handleNewAccount(response, accountResponse.rows[0], accountOwner);
          });
      }).catch(() => {
        response.status(500).json({
          status: 500,
          error: 'Error occured!',
        });
      });
  }

  /**
   * Gets all active, dormant or all accounts
   * @param {object} request
   * @param {object} response
   * @returns {object}
   * A response status and the list of accounts or an error message
   * @memberof AccountController
   */

  static getAccounts(request, response) {
    const { status } = request.query;

    if (status) {
      const accountQuery = `
      SELECT * FROM accounts
      WHERE status=$1;
    `;

      accounts.query(accountQuery, [status])
        .then((accountResponse) => {
          const formattedRows = accountResponse.rows
            .map(account => ({
              createdOn: account.created_on,
              accountNumber: account.account_number,
              owner: account.owner,
              type: account.type,
              status: account.status,
              balance: parseFloat(account.balance),
            }));

          response.status(200).json({
            status: 200,
            data: formattedRows,
          });
        })
        .catch(() => {
          response.status(500).json({
            status: 500,
            error: 'Error occured!',
          });
        });
    } else {
      const accountQuery = `
      SELECT * FROM accounts;
    `;

      accounts.query(accountQuery)
        .then((accountResponse) => {
          const formattedRows = accountResponse.rows
            .map(account => ({
              createdOn: account.created_on,
              accountNumber: account.account_number,
              owner: account.owner,
              type: account.type,
              status: account.status,
              balance: parseFloat(account.balance),
            }));

          response.status(200).json({
            status: 200,
            data: formattedRows,
          });
        })
        .catch(() => {
          response.status(500).json({
            status: 500,
            error: 'Error occured!',
          });
        });
    }
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
          const userQuery = `
            SELECT type FROM users
            WHERE email=$1;
          `;

          users.query(userQuery, [request.decoded.email])
            .then((userResponse) => {
              const user = userResponse.rows[0];

              const accountQuery2 = `
                SELECT account_number
                FROM accounts
                WHERE owner=$1;
              `;

              accounts.query(accountQuery2, [`{${request.decoded.id}}`])
                .then((accountResponse2) => {
                  const accountNumbers = accountResponse2.rows
                    .map(account => account.account_number);

                  if (accountNumbers.indexOf(Number(accountNumber)) < 0
                  && user.type === 'client') {
                    return response.status(403).json({
                      status: 403,
                      error: 'You can only view your own account details',
                    });
                  }

                  const {
                    owner, type, status, balance,
                  } = accountResponse.rows[0];

                  return response.status(200).json({
                    status: 200,
                    data: [{
                      createdOn: accountResponse.rows[0].created_on,
                      accountNumber: accountResponse.rows[0].account_number,
                      owner,
                      type,
                      status,
                      balance: parseFloat(balance),
                    }],
                  });
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
                data: [{
                  accountNumber: updatedAccount.account_number,
                  status,
                }],
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
      .catch(() => {
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
    const { after } = request.query;

    const accountQuery = `
      SELECT account_number FROM accounts
      WHERE account_number=$1;
    `;

    accounts.query(accountQuery, [accountNumber])
      .then((accountResponse) => {
        if (accountResponse.rows.length > 0) {
          const userQuery = `
            SELECT type FROM users
            WHERE email=$1;
          `;

          users.query(userQuery, [request.decoded.email])
            .then((userResponse) => {
              const user = userResponse.rows[0];

              const accountQuery2 = `
                  SELECT account_number
                  FROM accounts
                  WHERE owner=$1;
                `;

              accounts.query(accountQuery2, [`{${request.decoded.id}}`])
                .then((accountResponse2) => {
                  const accountNumbers = accountResponse2.rows
                    .map(account => account.account_number);

                  if (accountNumbers.indexOf(Number(accountNumber)) < 0
                  && user.type === 'client') {
                    return response.status(403).json({
                      status: 403,
                      error: 'You can only view your own transaction history',
                    });
                  }

                  const [account] = accountResponse.rows;

                  let transactionQuery;
                  let arrayValues = [];

                  if (after) {
                    transactionQuery = `
                    SELECT id, created_on, type, account_number,
                    amount, old_balance, new_balance
                    FROM transactions
                    WHERE account_number=$1
                    AND created_on < $2
                    ORDER BY created_on DESC
                    LIMIT 10;
                  `;

                    arrayValues = [account.account_number,
                      formatIncomingCursor(after)];
                  } else {
                    transactionQuery = `
                    SELECT id, created_on, type, account_number,
                    amount, old_balance, new_balance
                    FROM transactions
                    WHERE account_number=$1
                    ORDER BY created_on DESC
                    LIMIT 10;
                  `;

                    arrayValues = [account.account_number];
                  }

                  return accounts.query(transactionQuery,
                    [...arrayValues])
                    .then((transactionResponse) => {
                      const formattedRows = transactionResponse.rows
                        .map(transactions => ({
                          transactionId: transactions.id,
                          createdOn: transactions.created_on,
                          type: transactions.type,
                          accountNumber: transactions.account_number,
                          amount: parseFloat(transactions.amount),
                          oldBalance: parseFloat(transactions.old_balance),
                          newBalance: parseFloat(transactions.new_balance),
                        }));

                      const lastIndex = formattedRows.length - 1;

                      response.status(200).json({
                        status: 200,
                        cursor: {
                          after: formatOutgoingCursor(
                            transactionResponse.rows[lastIndex].created_on,
                          ),
                        },
                        data: formattedRows,
                      });
                    });
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
}
