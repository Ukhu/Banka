import { accountdb } from '../controllers/accountController';

/**
 * Handles sending back a response for the newly created transation
 * @param {object} response
 * @param {object} newTransaction
 * @returns {object} the newly created transation details
 * @memberof ControllerHelpers
 */

const handleNewTransaction = (response, newTransaction) => {
  const {
    id, newBalance, cashier, accountNumber, amount, type,
  } = newTransaction;

  accountdb.find(account => account.accountNumber === Number(accountNumber))
    .balance = newBalance;

  return response.status(201).json({
    status: 201,
    data: {
      transactionId: id,
      accountNumber,
      amount: parseFloat(amount),
      cashier: Number(cashier),
      transactionType: type,
      accountBalance: String(newBalance),
    },
  });
};

export default handleNewTransaction;
