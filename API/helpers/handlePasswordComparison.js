import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Compares the password supplied by the user to the one in the database
 * @param {object} response
 * @param {object} accountOwner
 * @param {object} inputPassword
 * @param {object} realPassword
 * @returns {object}
 * the newly signed in user details on success or an error message
 * @memberof ControllerHelpers
 */

const handlePasswordComparison = (response, accountOwner,
  inputPassword, realPassword) => {
  const comparisonResult = bcrypt.compare(inputPassword, realPassword,
    (error, result) => {
      if (error) {
        return response.status(401).json({
          status: 401,
          error: 'Authentication failed!',
        });
      }
      if (result) {
        const uniqueDetails = {
          id: accountOwner.id,
          email: accountOwner.email,
        };

        const token = sign(uniqueDetails, process.env.JWT_KEY,
          { expiresIn: '1hr' });
        return response.status(200).json(
          {
            status: 200,
            data: [{
              token,
              id: accountOwner.id,
              firstName: accountOwner.first_name,
              lastName: accountOwner.last_name,
              email: accountOwner.email,
              type: accountOwner.type,
              isAdmin: accountOwner.isadmin,
            }],
          },
        );
      }
      return response.status(401).json({
        status: 401,
        error: 'Email or password is wrong',
      });
    });
  return comparisonResult;
};

export default handlePasswordComparison;
