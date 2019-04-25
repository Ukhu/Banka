import { check } from 'express-validator/check';
import { capitaliseFirstLetter, makeLowerCase } from './customValidation';

/**
* Adds validations to the user routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const userValidation = () => [
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
  check('firstName')
    .exists().withMessage('Firstname is missing')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage(
      'Firstname cannot be blank',
    )
    .isAlpha()
    .withMessage('Firstname can only contain alphabets')
    .isLength({ min: 2 })
    .withMessage('Firstname must be at least 2 characters')
    .blacklist(' ')
    .customSanitizer(value => capitaliseFirstLetter(value)),
  check('lastName')
    .exists().withMessage('Lastname is missing')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage(
      'Lastname cannot be blank',
    )
    .isAlpha()
    .withMessage('Lastname can only contain alphabets')
    .isLength({ min: 2 })
    .withMessage('Lastname must be at least 2 characters')
    .blacklist(' ')
    .customSanitizer(value => capitaliseFirstLetter(value)),
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
  check('type')
    .exists()
    .withMessage('User type missing')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage(
      'User type cannot be blank. It must be either client or staff',
    )
    .blacklist(' ')
    .customSanitizer(value => makeLowerCase(value))
    .isIn(['client', 'staff'])
    .withMessage('User type can be either client or staff'),
  check('isAdmin')
    .exists()
    .withMessage('Admin status is missing')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage(
      'Admin status cannot be blank. It must be either true or false',
    )
    .blacklist(' ')
    .customSanitizer(value => makeLowerCase(value))
    .isIn(['true', 'false'])
    .withMessage('User type can be either true or false'),
];

export default userValidation;
