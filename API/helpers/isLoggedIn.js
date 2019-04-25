import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Checks the login status of the user
 * @param {object} request
 * @param {object} response
 * @returns {object} An error message regarding the user's login status
 * @memberof AuthenticationHelpers
 */

const isLoggedIn = (token) => {
  let result;
  verify(token, process.env.JWT_KEY, (error, decoded) => {
    result = !!(decoded);
  });
  return result;
};

export default isLoggedIn;
