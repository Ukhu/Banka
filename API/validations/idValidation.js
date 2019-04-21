import { param } from 'express-validator/check';

/**
* Adds validations to the transaction routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const transactionValidation = () => [
  param('transactionId')
    .exists().withMessage('No transaction ID provided in route parameters')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Transaction ID in route parameters cannot be empty')
    .isUUID()
    .withMessage('Transaction ID must be a valid UUID'),
];

export default transactionValidation;
