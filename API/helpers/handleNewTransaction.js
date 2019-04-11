import { accountdb } from '../controllers/accountController';

const handleNewTransaction = (res, newTransaction) => {
  const {
    id, newBalance, cashier, accountNumber, amount, type,
  } = newTransaction;

  accountdb.filter(acc => acc.accountNumber === Number(accountNumber))[0]
    .balance = newBalance;

  return res.status(201).json({
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
