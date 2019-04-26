import { check } from 'express-validator/check';
import { makeLowerCase } from './customValidation';

/**
* Adds validations to the accounts routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const accountValidations = () => [
  check('type')
    .exists().withMessage('Account type is missing')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage(
      'Account type cannot be blank. It can either be savings or current',
    )
    .isAlpha()
    .withMessage(
      'Account type must be alphabets and can either be savings or current',
    )
    .blacklist(' ')
    .customSanitizer(value => makeLowerCase(value))
    .isIn(['current', 'savings'])
    .withMessage('Account type must be either savings or current'),
];

export default accountValidations;
