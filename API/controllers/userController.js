import bcrypt from 'bcrypt';
import checkLoginStatus from '../helpers/checkLoginStatus';
import handlePasswordComparison from '../helpers/handlePasswordComparison';
import hanldeNewUser from '../helpers/handleNewUser';

export const users = [];

/**
 * @class UserController
 * @classdesc Performs operations on user entity
 */

export class UserController {
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
      email, firstName, lastName, password, type, isAdmin,
    } = request.body;

    bcrypt.hash(password, 10, (error, hash) => {
      if (error) {
        response.status(500).json({ status: 500, error });
      } else {
        const newUser = {
          id: users.length + 1,
          email,
          firstName,
          lastName,
          password: hash,
          type,
          isAdmin,
        };

        users.push(newUser);

        hanldeNewUser(response, newUser);
      }
    });
  }

  /**
   * Signs in an existing user
   * @param {object} request
   * @param {object} response
   * @returns {object} A response status and the user's details or an error message
   * @memberof UserController
   */

  static loginUser(request, response) {
    if (request.body.token || request.query.token || request.headers['x-access-token']) {
      checkLoginStatus(request, response);
    } else {
      const accountOwner = users.find(user => user.email === request.body.email);

      if (!accountOwner) {
        response.status(401).json({ status: 401, error: 'Email or password is wrong' });
      } else {
        handlePasswordComparison(response, accountOwner, request.body.password, accountOwner.password);
      }
    }
  }
}
