/**
 * Handles sending back a response to the user for newly created account
 * @param {object} response
 * @param {object} newAccount
 * @param {object} owner
 * @returns {object} the newly created account details
 * @memberof ControllerHelpers
 */

const handleNewAccount = (response, newAccount, owner) => {
  const { type, balance } = newAccount;

  return response.status(201).json({
    status: 201,
    data: {
      accountNumber: newAccount.account_number,
      firstName: owner.first_name,
      lastName: owner.last_name,
      email: owner.email,
      type,
      openingBalance: balance,
    },
  });
};

export default handleNewAccount;
