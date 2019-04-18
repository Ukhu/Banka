import { users } from '../controllers/userController';

/**
 * Checks if the email provided is already existing in the database
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @returns {object} an error response to the user
 * @memberof Validation
 */

const validateEmail = (request, response, next) => {
  const accountOwner = users.find(user => user.email === request.body.email);

  if (accountOwner) {
    return response.status(409).json({
      status: 409,
      error: 'Email already exists',
    });
  }

  return next();
};

export default validateEmail;
