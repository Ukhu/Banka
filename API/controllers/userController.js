import bcrypt from 'bcrypt';
import isLoggedIn from '../helpers/isLoggedIn';
import handlePasswordComparison from '../helpers/handlePasswordComparison';
import { handleNewUser } from '../helpers/handleNewEntity';
import users from '../models/user';
import accounts from '../models/account';

/**
 * @class UserController
 * @classdesc Performs operations on user entity
 */

export default class UserController {
  /**
   * Adds a new user to the database
   * @param {object} request
   * @param {object} response
   * @returns {object}
   * A response status and the created user or an error message
   * @memberof UserController
   */

  static createUser(request, response) {
    if (request.body.token || request.query.token
      || request.headers['x-access-token']) {
      const token = request.body.token
      || request.query.token || request.headers['x-access-token'];

      if (isLoggedIn(token)) {
        response.status(428).json({
          status: 428,
          error: 'Logout existing user account before attempting this action',
        });
        return;
      }
    }

    const {
      email, firstName, lastName,
    } = request.body;

    bcrypt.hash(request.body.password, 10, (error, hash) => {
      if (error) {
        response.status(500).json({ status: 500, error });
      }
      const password = hash;

      const queryString = `
            INSERT INTO
            users(email, first_name, last_name, password)
            VALUES($1, $2, $3, $4)
            returning *;
          `;

      users.query(queryString,
        [email, firstName, lastName, password])
        .then(queryResponse => handleNewUser(response, queryResponse.rows[0]))
        .catch(() => response.status(500).json({
          status: 500,
          error: 'Error occured!',
        }));
    });
  }

  /**
   * Adds a new staff to the database
   * @param {object} request
   * @param {object} response
   * @returns {object}
   * A response status and the created staff or an error message
   * @memberof UserController
   */

  static createStaff(request, response) {
    const {
      email, firstName, lastName, isAdmin,
    } = request.body;

    bcrypt.hash('000000', 10, (error, hash) => {
      if (error) {
        response.status(500).json({ status: 500, error });
      }
      const password = hash;

      const queryString = `
            INSERT INTO
            users(email, first_name, last_name, password, type, isAdmin)
            VALUES($1, $2, $3, $4, $5, $6)
            returning *;
          `;

      users.query(queryString,
        [email, firstName, lastName, password, 'staff', isAdmin])
        .then(queryResponse => handleNewUser(response, queryResponse.rows[0]))
        .catch(() => response.status(500).json({
          status: 500,
          error: 'Error occured!',
        }));
    });
  }

  /**
   * Signs in an existing user
   * @param {object} request
   * @param {object} response
   * @returns {object}
   * A response status and the user's details or an error message
   * @memberof UserController
   */

  static loginUser(request, response) {
    if (request.body.token || request.query.token
      || request.headers['x-access-token']) {
      const token = request.body.token
      || request.query.token || request.headers['x-access-token'];

      if (isLoggedIn(token)) {
        return response.status(428).json({
          status: 428,
          error: 'Logout existing user account before logging in again',
        });
      }
    }
    const queryString = `
        SELECT * FROM users
        WHERE email=$1;
      `;

    return users.query(queryString, [request.body.email])
      .then((queryResponse) => {
        if (queryResponse.rows.length < 1) {
          return response.status(401).json({
            status: 401,
            error: 'Email or password is wrong',
          });
        }
        const [accountOwner] = queryResponse.rows;
        return handlePasswordComparison(response, accountOwner,
          request.body.password, accountOwner.password);
      }).catch(() => response.status(500).json({
        status: 500,
        error: 'Error occured!',
      }));
  }

  /**
   * Gets all the accounts belong to a user
   * @param {object} request
   * @param {object} response
   * @returns {object}
   * A response status and the user's accounts or an error message
   * @memberof UserController
   */

  static getUserAccounts(request, response) {
    const { userEmail } = request.params;

    const userQuery = `
      SELECT id FROM users
      WHERE email=$1;
    `;

    users.query(userQuery, [userEmail])
      .then((userResponse) => {
        if (userResponse.rows.length > 0) {
          const { id } = userResponse.rows[0];

          const signedInUserQuery = `
            SELECT type FROM users
            WHERE email=$1;
          `;

          users.query(signedInUserQuery, [request.decoded.email])
            .then((userResponse2) => {
              const { type } = userResponse2.rows[0];

              if (userEmail !== request.decoded.email && type === 'client') {
                response.status(403).json({
                  status: 403,
                  error: 'You can only view your own accounts',
                });
                return;
              }

              const accountsQuery = `
                SELECT * FROM accounts
                WHERE owner=$1;
              `;

              accounts.query(accountsQuery, [`{${id}}`])
                .then((accountResponse) => {
                  const formattedRows = accountResponse.rows
                    .map(userAccounts => ({
                      createdOn: userAccounts.created_on,
                      accountNumber: userAccounts.account_number,
                      type: userAccounts.type,
                      status: userAccounts.status,
                      balance: userAccounts.balance,
                    }));

                  response.status(200).json({
                    status: 200,
                    data: formattedRows,
                  });
                });
            });
        } else {
          response.status(404).json({
            status: 404,
            error: 'No User found with the given email',
          });
        }
      })
      .catch(() => {
        response.status(500).json({
          status: 500,
          error: 'Error occured!',
        });
      });
  }
}
