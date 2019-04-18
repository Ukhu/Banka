/**
 * Handles sending back a response to the user for newly created account
 * @param {object} response
 * @param {object} newAccount
 * @param {object} owner
 * @returns {object} the newly created account details
 * @memberof ControllerHelpers
 */

const handleNewAccount = (response, newAccount, owner) => {
  const { firstName, lastName, email } = owner;
  const { accountNumber, type, balance } = newAccount;

  return response.status(201).json({
    status: 201,
    data: {
      accountNumber,
      firstName,
      lastName,
      email,
      type,
      openingBalance: balance,
    },
  });
};

export default handleNewAccount;
