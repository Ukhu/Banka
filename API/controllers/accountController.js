import { users } from './UserController';

export default class AccountController {
  static createAccount(req, res) {
    const { userId, type } = req.body;

    const accountdb = [];

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

    let owner;

    users.forEach((user) => {
      if (user.id === Number(userId)) {
        owner = {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        };
      }
      return owner;
    });

    if (owner) {
      res.status(201).json({
        status: 201,
        data: {
          accountNumber: newAccount.accountNumber,
          firstname: owner.firstname,
          lastname: owner.lastname,
          email: owner.email,
          type,
          openingBalance: newAccount.balance,
        },
      });
    } else {
      res.status(404).json({ status: 404, error: 'Account owner not found' });
    }
  }
}
