import { users } from '../models/User';

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

    let ownerFirstname;
    let ownerLastname;
    let ownerEmail;

    users.forEach((user) => {
      if (user.id === Number(userId)) {
        ownerFirstname = user.firstname;
        ownerLastname = user.lastname;
        ownerEmail = user.email;
      }
    });

    res.status(201).json({
      status: 201,
      data: {
        accountNumber: newAccount.accountNumber,
        firstName: ownerFirstname,
        lastName: ownerLastname,
        email: ownerEmail,
        type,
        openingBalance: newAccount.balance,
      },
    });
  }
}
