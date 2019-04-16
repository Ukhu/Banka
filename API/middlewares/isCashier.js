import { users } from '../controllers/userController';

/**
 * Checks if the user is a cashier or not
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @returns {object} an error message to the user
 * @memberof Authorization
 */

const isCashier = (request, response, next) => {
  const decodedUser = request.decoded;

  const owner = users.find(user => user.id === decodedUser.id);

  if (owner.type === 'staff' && owner.isAdmin === 'false') {
    next();
  } else {
    response.status(403).json({ status: 403, error: 'FORBIDDEN - Only Cashier can access make this transaction!' });
  }
};

export default isCashier;
