import { accountdb } from './accountController';
import handleNewTransaction from '../helpers/handleNewTransaction';

export const transactionsdb = [];

/**
 * @class TransactionController
 * @classdesc Performs account transactions
 */

export class TransactionController {
  /**
   * Credits the user's bank account
   * @param {object} request
   * @param {object} response
   * @returns {object} A success message with the new transaction details or an error message
   * @memberof TransactionController
   */

  static credit(request, response) {
    const { amount } = request.body;
    const foundAccount = accountdb.find(
      account => account.accountNumber === Number(request.params.accountNumber),
    );
    if (foundAccount) {
      const newTransaction = {
        id: transactionsdb.length + 1,
        createdOn: new Date().toLocaleString(),
        type: 'credit',
        accountNumber: Number(request.params.accountNumber),
        cashier: request.decoded.id,
        amount: Number(amount),
        oldBalance: foundAccount.balance,
        newBalance: foundAccount.balance + Number(amount),
      };
      transactionsdb.push(newTransaction);
      return handleNewTransaction(response, newTransaction);
    }
    return response.status(404).json({ status: 404, error: 'Account not found for the given account number' });
  }

  /**
   * Debits a user's account
   * @param {object} request
   * @param {object} response
   * @returns {object} A success message with the new transaction details or an error message
   * @memberof TransactionController
   */

  static debit(request, response) {
    const { amount } = request.body;
    const foundAccount = accountdb.find(
      account => account.accountNumber === Number(request.params.accountNumber),
    );
    if (foundAccount) {
      if (foundAccount.balance < Number(amount)) {
        return response.status(400).json({ status: 400, error: 'Insufficient Funds' });
      }
      const newTransaction = {
        id: transactionsdb.length + 1,
        createdOn: new Date().toLocaleString(),
        type: 'debit',
        accountNumber: Number(request.params.accountNumber),
        cashier: request.decoded.id,
        amount: Number(amount),
        oldBalance: foundAccount.balance,
        newBalance: foundAccount.balance - Number(amount),
      };
      transactionsdb.push(newTransaction);
      return handleNewTransaction(response, newTransaction);
    }
    return response.status(404).json({ status: 404, error: 'Account not found for the given account number' });
  }
}
