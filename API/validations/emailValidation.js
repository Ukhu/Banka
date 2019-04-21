import { param } from 'express-validator/check';

/**
* Adds validations to the routes
* @returns {array} an array containing the Check API validations
* @memberof Validation
*/

const emailValidation = () => [
  param('userEmail')
    .exists().withMessage('Email not provided')
    .isEmail()
    .withMessage('Email provided is not a valid email')
    .trim(),
];

export default emailValidation;
