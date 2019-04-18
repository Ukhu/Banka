import { validationResult } from 'express-validator/check';

/**
 * Handles the errors gotten from the express-validator API
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @returns {object} the result of the validations
 * @memberof ValidationMiddleware
 */

const errorHandler = (request, response, next) => {
  const errors = {};

  const errorFormatter = ({ location, msg, param }) => {
    if (!Object.keys(errors).includes(location)) {
      errors[`${location}`] = {};
    }
    errors[`${location}`][`${param}`] = msg;

    return errors;
  };

  const validationResults = validationResult(request).array({ onlyFirstError: true });

  validationResults.forEach(resultObject => errorFormatter(resultObject));

  if (Object.keys(errors).length > 0) {
    response.status(400).json({ status: 400, errors });
  } else {
    next();
  }
};

export default errorHandler;
