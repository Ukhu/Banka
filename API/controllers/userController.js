import bcrypt from 'bcrypt';
import checkLoginStatus from '../helpers/checkLoginStatus';
import handlePasswordComparison from '../helpers/handlePasswordComparison';
import hanldeNewUser from '../helpers/handleNewUser';
import users from '../models/user';
import accounts from '../models/account';

// export const users = [];

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
    const {
      email, firstName, lastName, type, isAdmin,
    } = request.body;

    bcrypt.hash(request.body.password, 10, (error, hash) => {
      if (error) {
        response.status(500).json({ status: 500, error });
      } else {
        const password = hash;

        const queryString = `
          INSERT INTO
          users(email, first_name, last_name, password, type, isAdmin)
          VALUES($1, $2, $3, $4, $5, $6)
          returning *;
        `;

        users.query(queryString,
          [email, firstName, lastName, password, type, isAdmin])
          .then((queryResponse) => {
            hanldeNewUser(response, queryResponse.rows[0]);
          })
          .catch(() => {
            response.status(500).json({
              status: 500,
              error: 'Error occured!',
            });
          });
      }
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
      checkLoginStatus(request, response);
    } else {
      const queryString = `
        SELECT * FROM users
        WHERE email=$1
      `;

      users.query(queryString, [request.body.email])
        .then((queryResponse) => {
          if (queryResponse.rows.length < 1) {
            response.status(401).json({
              status: 401,
              error: 'Email or password is wrong',
            });
          } else {
            const [accountOwner] = queryResponse.rows;
            handlePasswordComparison(response, accountOwner,
              request.body.password, accountOwner.password);
          }
        }).catch(() => {
          response.status(500).json({
            status: 500,
            error: 'Error occured!',
          });
        });
    }
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

          const accountsQuery = `
            SELECT * FROM accounts
            WHERE owner=$1;
          `;

          accounts.query(accountsQuery, [`{${id}}`])
            .then((accountResponse) => {
              response.status(200).json({
                status: 200,
                data: accountResponse.rows,
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
