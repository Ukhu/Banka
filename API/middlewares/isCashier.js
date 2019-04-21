import users from '../models/user';

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

  const userQuery = `
    SELECT type, isadmin FROM users
    WHERE id=$1;
  `;

  users.query(userQuery, [`{${decodedUser.id}}`])
    .then((userResponse) => {
      const [accountOwner] = userResponse.rows;

      if (accountOwner.type === 'staff' && accountOwner.isadmin === false) {
        next();
      } else {
        response.status(403).json({
          status: 403,
          error: 'FORBIDDEN - Only Cashier can make this transaction!',
        });
      }
    }).catch((error) => {
      response.status(500).json({
        status: 500,
        error: 'Error occured!',
      });
    });
};

export default isCashier;
