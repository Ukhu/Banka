import users from '../models/user';

/**
 * Checks if the user is an admin or not
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @returns {object} an error message to the user
 * @memberof Authorization
 */

export const isAdmin = (request, response, next) => {
  const decodedUser = request.decoded;

  const userQuery = `
    SELECT type, isAdmin FROM users
    WHERE id=$1;
  `;

  users.query(userQuery, [`{${decodedUser.id}}`])
    .then((userResponse) => {
      const [accountOwner] = userResponse.rows;

      if (accountOwner.type === 'staff' && accountOwner.isadmin === true) {
        next();
      } else {
        response.status(403).json({
          status: 403,
          error: 'Forbidden Access! Only an admin can carry out this operation',
        });
      }
    }).catch(() => {
      response.status(500).json({
        status: 500,
        error: 'Error occured!',
      });
    });
};

/**
 * Checks if the user is a staff or not
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @returns {object} an error message to the user
 * @memberof Authorization
 */

export const isStaff = (request, response, next) => {
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

/**
 * Checks if the user is a cashier or not
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @returns {object} an error message to the user
 * @memberof Authorization
 */

export const isCashier = (request, response, next) => {
  const decodedUser = request.decoded;

  const userQuery = `
    SELECT type, isadmin FROM users
    WHERE id=$1;
  `;

  users.query(userQuery, [`{${decodedUser.id}}`])
    .then((userResponse) => {
      const [accountOwner] = userResponse.rows;

      if (userResponse.rows.length === 0) {
        response.status(404).json({
          status: 404,
          error: 'This user is not in the database',
        });
      } else if (accountOwner.type === 'staff'
      && accountOwner.isadmin === false) {
        next();
      } else {
        response.status(403).json({
          status: 403,
          error: 'Forbidden Access! Only a cashier can make this transaction',
        });
      }
    }).catch(() => {
      response.status(500).json({
        status: 500,
        error: 'Error occured!',
      });
    });
};
