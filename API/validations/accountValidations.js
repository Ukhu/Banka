import { check } from 'express-validator/check';

/**
* Adds validations to the accounts routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const accountValidations = () => [
  check('type')
    .exists().withMessage('Account type not supplied')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Account type cannot be empty')
    .isString()
    .withMessage('Account type must be string')
    .trim()
    .isIn(['current', 'savings'])
    .withMessage('must be either savings or current'),
];

export default accountValidations;
