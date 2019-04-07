import { check } from 'express-validator/check';

const accountValidations = () => [
  check('userId')
    .exists().withMessage('User ID not supplied')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('User ID cannot be empty')
    .isNumeric()
    .withMessage('User ID must be an integer'),
  check('type')
    .exists().withMessage('Account type not supplied')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Account type cannot be empty')
    .isString()
    .withMessage('Account type must be string')
    .trim()
    .isIn(['current', 'savings']),
];

export default accountValidations;
