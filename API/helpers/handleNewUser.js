import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Hanldes sending back a response for the newly created user
 * @param {object} response
 * @param {object} newUser
 * @returns {object} the newly created user details
 * @memberof ControllerHelpers
 */

const handleNewUser = (response, newUser) => {
  const uniqueDetails = {
    id: newUser.id,
    email: newUser.email,
  };
  // create token
  const token = sign(uniqueDetails, process.env.JWT_KEY, { expiresIn: '1hr' });

  return response.status(201).json({
    status: 201,
    data: {
      token,
      id: newUser.id,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      email: newUser.email,
    },
  });
};

export default handleNewUser;
