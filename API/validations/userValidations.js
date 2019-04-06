import { check } from 'express-validator/check';

const userValidation = () => [
  check('email')
    .exists().withMessage('Email not provided')
    .isEmail()
    .withMessage('Invalid email')
    .trim(),
  check('firstname')
    .exists().withMessage('Firstname not provided')
    .isAlpha()
    .withMessage('Firstname can only contain alphabets')
    .trim(),
  check('lastname')
    .exists().withMessage('Lastname not provided')
    .isAlpha()
    .withMessage('Last name can only contain alphabets')
    .trim(),
  check('password')
    .exists().withMessage('No password provided')
    .trim(),
  check('type')
    .exists().withMessage('User type is not specified')
    .isIn(['client', 'staff']),
  check('isAdmin')
    .exists().withMessage('Admin status has to be specified')
    .isIn(['true', 'false']),
];

export default userValidation;
