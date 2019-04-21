import accounts from '../models/account';

/**
 * Handles sending back a response for the newly created transation
 * @param {object} response
 * @param {object} newTransaction
 * @returns {object} the newly created transation details
 * @memberof ControllerHelpers
 */

const handleNewTransaction = (response, newTransaction) => {
  const {
    id, cashier, amount, type,
  } = newTransaction;

  const accountQuery = `
  UPDATE accounts
  SET balance=$1
  WHERE account_number=$2;
`;

  accounts.query(accountQuery,
    [newTransaction.new_balance, newTransaction.account_number])
    .then((accountResponse2) => {
      response.status(201).json({
        status: 201,
        data: {
          transactionId: id,
          accountNumber: newTransaction.account_number,
          amount,
          cashier,
          transactionType: type,
          accountBalance: newTransaction.new_balance,
        },
      });
    });

  // accountdb.find(account => account.accountNumber === Number(accountNumber))
  //   .balance = newBalance;
};

export default handleNewTransaction;
