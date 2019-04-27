import users from '../models/user';

/**
 * Checks if the email provided is already existing in the database
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @returns {object} an error response to the user
 * @memberof Validation
 */

const validateEmail = (request, response, next) => {
  const queryString = `
    SELECT * FROM users
    WHERE email=$1
  `;

  users.query(queryString, [request.body.email])
    .then((queryResponse) => {
      if (queryResponse.rows.length < 1) {
        next();
      } else {
        response.status(409).json({
          status: 409,
          error: 'Email already exists',
        });
      }
    }).catch(() => {
      response.status(500).json({
        status: 500,
        error: 'Error occured!',
      });
    });
};

export default validateEmail;
