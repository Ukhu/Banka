import { param } from 'express-validator/check';

/**
* Adds validations to the transaction routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const transactionValidation = () => [
  param('transactionId')
    .exists().withMessage('Transaction ID missing')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Transaction ID cannot be blank')
    .isUUID()
    .withMessage('Transaction ID must be a valid UUID'),
];

export default transactionValidation;
