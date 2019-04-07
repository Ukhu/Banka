import { validationResult } from 'express-validator/check';
import { users } from '../controllers/UserController';

const validateEmail = (req, res, next) => {
  const errorFormatter = ({ location, msg, param }) => `${location}[${param}]: ${msg}`;

  const result = validationResult(req).formatWith(errorFormatter);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array({ onlyFirstError: true }) });
  }

  let msg;

  users.forEach((user) => {
    if (user.email === req.body.email) {
      msg = 'body[email]: Email already exists';
    }
  });

  if (msg) {
    return res.status(400).json({ status: 400, error: msg });
  }

  return next();
};

export default validateEmail;
