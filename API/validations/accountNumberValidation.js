import { param } from 'express-validator/check';

/**
* Adds validations to the delete account route
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const deleteAccountValidation = () => [
  param('accountNumber')
    .exists().withMessage('No account number provided in route parameters')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Acount number in route parameters cannot be empty')
    .isNumeric()
    .withMessage('Account number must be a number')
    .isLength({ min: 7, max: 7 })
    .withMessage('Account number must be 7 digits'),
];

export default deleteAccountValidation;
