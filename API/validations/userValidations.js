import { check } from 'express-validator/check';

/**
* Adds validations to the user routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const userValidation = () => [
  check('email')
    .exists().withMessage('Email not provided')
    .isEmail()
    .withMessage('Invalid email')
    .trim(),
  check('firstName')
    .exists().withMessage('Firstname not provided')
    .isAlpha()
    .withMessage('Firstname can only contain alphabets')
    .trim(),
  check('lastName')
    .exists().withMessage('Lastname not provided')
    .isAlpha()
    .withMessage('Last name can only contain alphabets')
    .trim(),
  check('password')
    .exists().withMessage('No password provided')
    .trim(),
  check('type')
    .exists().withMessage('User type is not specified - either client or staff')
    .isIn(['client', 'staff']),
  check('isAdmin')
    .exists().withMessage('Admin status has to be specified - either true or false')
    .isIn(['true', 'false']),
];

export default userValidation;
