import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Checks if a user is authenticated before accessing protected middlewares
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @returns {object} an error message for authentication errors
 * @memberof Authentication
 */

const isAuthorized = (request, response, next) => {
  const token = request.body.token
    || request.query.token || request.headers['x-access-token'];

  if (token) {
    verify(token, process.env.JWT_KEY, (error, decoded) => {
      if (error) {
        response.status(401).json({
          status: 401,
          error: 'Unauthorized Access',
        });
      } else {
        request.decoded = decoded;
        next();
      }
    });
  } else {
    response.status(401).json({
      status: 401,
      error: 'Unauthorized Access',
    });
  }
};

export default isAuthorized;
