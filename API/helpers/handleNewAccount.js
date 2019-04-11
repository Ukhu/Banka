const handleNewAccount = (res, newAccount, owner) => {
  const { firstname, lastname, email } = owner;
  const { accountNumber, type, balance } = newAccount;

  return res.status(201).json({
    status: 201,
    data: {
      accountNumber,
      firstname,
      lastname,
      email,
      type,
      openingBalance: balance,
    },
  });
};

export default handleNewAccount;
