import { check } from 'express-validator/check';
import { capitaliseFirstLetter, makeLowerCase } from './customValidation';

/**
* Adds validations to the user routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

export const clientValidation = () => [
  check('email')
    .exists().withMessage('Email is missing')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage(
      'Email cannot be blank',
    )
    .isEmail()
    .withMessage('Not a valid email address')
    .customSanitizer(value => makeLowerCase(value))
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
    .isLength({ min: 2, max: 15 })
    .withMessage('Firstname must be at least 2 characters, and maximum 15')
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
    .isLength({ min: 2, max: 15 })
    .withMessage('Lastname must be at least 2 characters, and maximum 15')
    .blacklist(' ')
    .customSanitizer(value => capitaliseFirstLetter(value)),
  check('password')
    .exists().withMessage('Password is missing')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage(
      'Password cannot be blank',
    )
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be at least 6 characters')
    .blacklist(' '),
];

/**
* Adds validations to the user routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

export const staffValidation = () => [
  check('email')
    .exists().withMessage('Email is missing')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage(
      'Email cannot be blank',
    )
    .isEmail()
    .withMessage('Not a valid email address')
    .customSanitizer(value => makeLowerCase(value))
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
    .isLength({ min: 2, max: 15 })
    .withMessage('Firstname must be at least 2 characters, and maximum 15')
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
    .isLength({ min: 2, max: 15 })
    .withMessage('Lastname must be at least 2 characters, and maximum 15')
    .blacklist(' ')
    .customSanitizer(value => capitaliseFirstLetter(value)),
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
