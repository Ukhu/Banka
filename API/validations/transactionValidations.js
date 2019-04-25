import { check, param } from 'express-validator/check';

/**
* Adds validations to the transaction routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const transactionValidation = () => [
  param('accountNumber')
    .exists().withMessage('Account number is missing')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Acount number cannot be blank')
    .isNumeric()
    .withMessage('Account number must be a number')
    .isLength({ min: 7, max: 7 })
    .withMessage('Account number must be 7 digits'),
  check('amount')
    .exists().withMessage('Amount is missing')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Amount cannot be blank')
    .isFloat()
    .withMessage('Amount must be a Floating point number')
    .blacklist(' '),
];

export default transactionValidation;
