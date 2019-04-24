import accounts from '../models/account';
import handleNewTransaction from '../helpers/handleNewTransaction';
import transactions from '../models/transaction';

/**
 * @class TransactionController
 * @classdesc Performs account transactions
 */

export default class TransactionController {
  /**
   * Credits the user's bank account
   * @param {object} request
   * @param {object} response
   * @returns {object}
   * A success message with the new transaction details or an error message
   * @memberof TransactionController
   */

  static credit(request, response) {
    const { amount } = request.body;

    const accountQuery = `
      SELECT * FROM accounts
      WHERE account_number=$1
    `;

    accounts.query(accountQuery, [request.params.accountNumber])
      .then((accountResponse) => {
        if (accountResponse.rows.length > 0) {
          const [foundAccount] = accountResponse.rows;

          const newBalance = Number(foundAccount.balance) + Number(amount);

          const newTransaction = [
            'credit',
            Number(request.params.accountNumber),
            `{${request.decoded.id}}`,
            Number(amount),
            foundAccount.balance,
            newBalance];

          const transactionQuery = `
            INSERT INTO transactions
            (type, account_number, cashier, amount, old_balance, new_balance)
            VALUES($1, $2, $3, $4, $5, $6)
            returning *;
          `;

          transactions.query(transactionQuery, newTransaction)
            .then((transactionResponse) => {
              handleNewTransaction(response, transactionResponse.rows[0]);
            });
        } else {
          response.status(404).json({
            status: 404,
            error: 'Account not found for the given account number',
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
   * Debits a user's account
   * @param {object} request
   * @param {object} response
   * @returns {object}
   * A success message with the new transaction details or an error message
   * @memberof TransactionController
   */

  static debit(request, response) {
    const { amount } = request.body;

    const accountQuery = `
      SELECT * FROM accounts
      WHERE account_number=$1
    `;

    accounts.query(accountQuery, [request.params.accountNumber])
      .then((accountResponse) => {
        if (accountResponse.rows.length > 0) {
          const [foundAccount] = accountResponse.rows;

          if (foundAccount.balance < Number(amount)) {
            response.status(400).json({
              status: 400,
              error: 'Insufficient Funds',
            });
          } else {
            const newBalance = Number(foundAccount.balance) - Number(amount);

            const newTransaction = [
              'debit',
              Number(request.params.accountNumber),
              `{${request.decoded.id}}`,
              Number(amount),
              foundAccount.balance,
              newBalance];

            const transactionQuery = `
              INSERT INTO transactions
              (type, account_number, cashier, amount, old_balance, new_balance)
              VALUES($1, $2, $3, $4, $5, $6)
              returning *;
            `;

            transactions.query(transactionQuery, newTransaction)
              .then((transactionResponse) => {
                handleNewTransaction(response, transactionResponse.rows[0]);
              });
          }
        } else {
          response.status(404).json({
            status: 404,
            error: 'Account not found for the given account number',
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
   * Get details of a particular transaction
   * @param {object} request
   * @param {object} response
   * @returns {object}
   * An array containing transaction details or an error message
   * @memberof TransactionController
   */
  static getDetails(request, response) {
    const { transactionId } = request.params;

    const transactionQuery = `
      SELECT * FROM transactions
      WHERE id=$1;
    `;

    transactions.query(transactionQuery, [`{${transactionId}}`])
      .then((transactionResponse) => {
        if (transactionResponse.rows.length > 0) {
          const { id, type, amount } = transactionResponse.rows[0];

          response.status(200).json({
            status: 200,
            data: [{
              transactionId: id,
              createdOn: transactionResponse.rows[0].created_on,
              type,
              accountNumber: transactionResponse.rows[0].account_number,
              amount,
              oldBalance: transactionResponse.rows[0].old_balance,
              newBalance: transactionResponse.rows[0].new_balance,
            }],
          });
        } else {
          response.status(404).json({
            status: 404,
            error: 'Account not found for the given ID',
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
