import { check, param } from 'express-validator/check';

/**
* Adds validations to the activate/deactivate routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const accountStatusValidations = () => [
  param('accountNumber')
    .exists().withMessage('No account number provided in route parameters')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Acount number in route parameters cannot be empty')
    .isNumeric()
    .withMessage('Account number must be a number')
    .isLength({ min: 7, max: 7 })
    .withMessage('Account number must be 7 digits'),
  check('status')
    .exists().withMessage('Account status not supplied')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Account status cannot be empty')
    .isString()
    .withMessage('Account status must be string')
    .trim()
    .isIn(['active', 'dormant'])
    .withMessage('must be either active or dormant'),
];

export default accountStatusValidations;
