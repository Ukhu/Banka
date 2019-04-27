import { param } from 'express-validator/check';

/**
* Adds validations to the delete account route
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const deleteAccountValidation = () => [
  param('accountNumber')
    .exists().withMessage('Account number is missing')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Acount number cannot be blank')
    .isNumeric({ no_symbols: true })
    .withMessage('Account number must be a valid number')
    .isLength({ min: 7, max: 7 })
    .withMessage('Account number must be 7 digits'),
];

export default deleteAccountValidation;
