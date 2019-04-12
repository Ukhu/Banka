import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const handleNewUser = (res, newUser) => {
  // create token
  const token = sign(newUser, process.env.JWT_KEY, { expiresIn: '1hr' });

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
