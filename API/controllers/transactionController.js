import { accountdb } from './accountController';
import handleNewTransaction from '../helpers/handleNewTransaction';

export const transactionsdb = [];

export class TransactionController {
  static credit(req, res) {
    const { type, accountNumber, amount } = req.body;
    if (req.params.accountNumber !== accountNumber) {
      return res.status(400).json({ status: 400, error: 'Account number in params must match account number given' });
    }
    const foundAccount = accountdb.filter(
      account => account.accountNumber === Number(accountNumber),
    );
    if (foundAccount.length > 0) {
      const newTransaction = {
        id: transactionsdb.length + 1,
        createdOn: new Date().toLocaleString(),
        type,
        accountNumber: Number(accountNumber),
        cashier: req.decoded.id,
        amount: Number(amount),
        oldBalance: foundAccount[0].balance,
        newBalance: foundAccount[0].balance + Number(amount),
      };
      return handleNewTransaction(res, newTransaction);
    }
    return res.status(404).json({ status: 404, error: 'Account not found for the given account number' });
  }

  static debit(req, res) {
    const { type, accountNumber, amount } = req.body;
    if (req.params.accountNumber !== accountNumber) {
      return res.status(400).json({ status: 400, error: 'Account number in params must match account number given' });
    }
    const foundAccount = accountdb.filter(
      account => account.accountNumber === Number(accountNumber),
    );
    if (foundAccount.length > 0) {
      if (foundAccount[0].balance < Number(amount)) {
        return res.status(400).json({ status: 400, error: 'Insufficient Funds' });
      }
      const newTransaction = {
        id: transactionsdb.length + 1,
        createdOn: new Date().toLocaleString(),
        type,
        accountNumber: Number(accountNumber),
        cashier: req.decoded.id,
        amount: Number(amount),
        oldBalance: foundAccount[0].balance,
        newBalance: foundAccount[0].balance - Number(amount),
      };
      return handleNewTransaction(res, newTransaction);
    }
    return res.status(404).json({ status: 404, error: 'Account not found for the given account number' });
  }
}
