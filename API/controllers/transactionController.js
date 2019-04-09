import { accountdb } from './accountController';
import { request } from 'https';

export const transactionsdb = [];

export class TransactionController {
  static credit(req, res) {
    const {
      type, accountNumber, amount,
    } = req.body;

    if (type !== 'credit') {
      return res.status(400).json({ status: 400, error: 'Bad Request' });
    }

    let foundAccount;

    accountdb.forEach((acc) => {
      if (acc.accountNumber === Number(accountNumber)) {
        foundAccount = {
          balance: acc.balance,
        };
      }
    });

    if (foundAccount) {
      const newTransaction = {
        id: transactionsdb.length + 1,
        createdOn: new Date().toLocaleString(),
        type,
        accountNumber: Number(accountNumber),
        cashier: req.decoded.id,
        amount: Number(amount),
        oldBalance: foundAccount.balance,
        newBalance: foundAccount.balance + Number(amount),
      };

      accountdb.forEach((acc) => {
        if (acc.accountNumber === accountNumber) {
          acc.balance = newTransaction.newBalance;
        }
      });

      transactionsdb.push(newTransaction);

      const { id, newBalance, cashier } = newTransaction;

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
    }
    return res.status(404).json({ status: 400, error: 'Account not found for the given account number' });
  }
}
