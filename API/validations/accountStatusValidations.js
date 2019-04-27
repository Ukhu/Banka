import { check, param } from 'express-validator/check';
import { makeLowerCase } from './customValidation';

/**
* Adds validations to the activate/deactivate routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const accountStatusValidations = () => [
  param('accountNumber')
    .exists().withMessage('Account number is missing')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Acount number cannot be blank')
    .isNumeric({ no_symbols: true })
    .withMessage('Account number must be a valid number')
    .isLength({ min: 7, max: 7 })
    .withMessage('Account number must be 7 digits'),
  check('status')
    .exists().withMessage('Account status missing')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Account status cannot be blank')
    .isString()
    .withMessage('Account status must be string')
    .blacklist(' ')
    .customSanitizer(value => makeLowerCase(value))
    .isIn(['active', 'dormant'])
    .withMessage('Status must be either active or dormant'),
];

export default accountStatusValidations;
