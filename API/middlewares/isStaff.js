import users from '../models/user';

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

  const userQuery = `
    SELECT type FROM users
    WHERE id=$1;
  `;

  users.query(userQuery, [`{${decodedUser.id}}`])
    .then((userResponse) => {
      const [accountOwner] = userResponse.rows;

      if (accountOwner.type === 'staff') {
        next();
      } else {
        response.status(403).json({
          status: 403,
          error: 'Forbidden Access! Only a staff can carry out this operation',
        });
      }
    }).catch(() => {
      response.status(500).json({
        status: 500,
        error: 'Error occured!',
      });
    });
};

export default isStaff;
