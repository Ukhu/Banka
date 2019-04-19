import { check, param } from 'express-validator/check';

/**
* Adds validations to the transaction routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const transactionValidation = () => [
  param('accountNumber')
    .exists().withMessage('No account number provided in route parameters')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Acount number in route parameters cannot be empty')
    .isNumeric()
    .withMessage('Account number must be a number')
    .isLength({ min: 7, max: 7 })
    .withMessage('Account number must be 7 digits'),
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
