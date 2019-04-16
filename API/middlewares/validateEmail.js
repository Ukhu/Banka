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
  const owner = users.find(user => user.email === request.body.email);

  if (owner) {
    return response.status(400).json({ status: 400, error: 'body[email]: Email already exists' });
  }

  return next();
};

export default validateEmail;
