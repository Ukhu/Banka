import { check } from 'express-validator/check';

/**
* Adds validations to the user routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const signinValidation = () => [
  check('email')
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
  check('password')
    .exists().withMessage('Password is missing')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage(
      'Lastname cannot be blank',
    )
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .blacklist(' '),
];

export default signinValidation;
