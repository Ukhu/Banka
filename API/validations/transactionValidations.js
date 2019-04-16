import { check } from 'express-validator/check';

/**
* Adds validations to the transaction routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const transactionValidation = () => [
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
