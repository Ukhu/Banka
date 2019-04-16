import { users } from '../controllers/userController';

/**
 * Checks if the user is a staff or not
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @returns {object} an error message to the user
 * @memberof Authorization
 */

const isStaff = (request, response, next) => {
  const decodedUser = request.decoded;

  const owner = users.find(user => user.id === decodedUser.id);

  if (owner.type === 'staff') {
    next();
  } else {
    response.status(403).json({ status: 403, error: 'FORBIDDEN - Only Staff can access make this transaction!' });
  }
};

export default isStaff;
