import { check } from 'express-validator/check';

/**
* Adds validations to the activate/deactivate routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const accountStatusValidations = () => [
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
