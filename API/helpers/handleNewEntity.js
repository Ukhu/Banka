import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';
import accounts from '../models/account';

dotenv.config();

/**
 * Handles sending back a response to the user for newly created account
 * @param {object} response
 * @param {object} newAccount
 * @param {object} owner
 * @returns {object} the newly created account details
 * @memberof ControllerHelpers
 */

export const handleNewAccount = (response, newAccount, owner) => {
  const { type, balance } = newAccount;

  return response.status(201).json({
    status: 201,
    data: [{
      accountNumber: newAccount.account_number,
      firstName: owner.first_name,
      lastName: owner.last_name,
      email: owner.email,
      type,
      openingBalance: balance,
    }],
  });
};

/**
 * Handles sending back a response for the newly created transation
 * @param {object} response
 * @param {object} newTransaction
 * @returns {object} the newly created transation details
 * @memberof ControllerHelpers
 */

export const handleNewTransaction = (response, newTransaction) => {
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
    .then(() => {
      response.status(201).json({
        status: 201,
        data: [{
          transactionId: id,
          accountNumber: newTransaction.account_number,
          amount,
          cashier,
          transactionType: type,
          accountBalance: newTransaction.new_balance,
        }],
      });
    });
};

/**
 * Hanldes sending back a response for the newly created user
 * @param {object} response
 * @param {object} newUser
 * @returns {object} the newly created user details
 * @memberof ControllerHelpers
 */

export const handleNewUser = (response, newUser) => {
  if (newUser.type !== 'staff') {
    const uniqueDetails = {
      id: newUser.id,
      email: newUser.email,
    };

    const token = sign(uniqueDetails, process.env.JWT_KEY,
      { expiresIn: '1hr' });

    return response.status(201).json({
      status: 201,
      data: [{
        token,
        id: newUser.id,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        email: newUser.email,
      }],
    });
  }

  return response.status(201).json({
    status: 201,
    data: [{
      id: newUser.id,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      email: newUser.email,
    }],
  });
};
