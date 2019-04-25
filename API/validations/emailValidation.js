import { param } from 'express-validator/check';

/**
* Adds validations to the routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const emailValidation = () => [
  param('userEmail')
    .exists().withMessage('Email is missing')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage(
      'Email cannot be blank',
    )
    .isEmail()
    .withMessage('Not a valid email address')
    .normalizeEmail()
    .blacklist(' '),
];

export default emailValidation;
