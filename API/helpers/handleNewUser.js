import { sign } from 'jsonwebtoken';

const handleNewUser = (res, newUser) => {
  // create token
  const token = sign(newUser, 'examplesecretword', { expiresIn: '1hr' });

  return res.status(201).json({
    status: 201,
    data: {
      token,
      id: newUser.id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
    },
  });
};

export default handleNewUser;
