import { check } from 'express-validator/check';

const transactionValidation = type => [
  check('type')
    .exists().withMessage('Transaction type not provided')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Blank spaces not allowed')
    .isString()
    .withMessage('Transaction type must be a string')
    .trim()
    .isIn([`${type}`]),
  check('accountNumber')
    .exists().withMessage('Account number not provided')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Account Number cannot be blank')
    .isInt()
    .withMessage('Account number can only be an integer')
    .isLength({ min: 7, max: 7 })
    .withMessage('Invalid Account number')
    .trim(),
  check('amount')
    .exists().withMessage('No amount specified')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Amount cannot be blank')
    .isFloat()
    .withMessage('Amount must be a Floating point number')
    .trim(),
];

export default transactionValidation;
