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

const checkLoginStatus = (request, response) => {
  const token = request.body.token || request.query.token || request.headers['x-access-token'];
  const result = verify(token, process.env.JWT_KEY, (error, decoded) => {
    if (error) {
      return response.status(403).json({
        status: 403,
        error: 'FORBIDDEN REQUEST - Wrong or invalid token',
      });
    }
    request.decoded = decoded;
    return response.status(428).json({ status: 428, error: 'Logout existing user account before logging in again' });
  });
  return result;
};

export default checkLoginStatus;
