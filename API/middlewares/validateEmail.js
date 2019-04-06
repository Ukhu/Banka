import { validationResult } from 'express-validator/check';
import { users } from '../controllers/Users';

const validateEmail = (req, res, next) => {
  const errorFormatter = ({ location, msg, param }) => `${location}[${param}]: ${msg}`;

  const result = validationResult(req).formatWith(errorFormatter);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  let msg;

  users.forEach((user) => {
    if (user.email === req.body.email) {
      msg = 'body[email]: Email already exists';
    }
  });

  if (msg) {
    return res.json({ error: msg });
  }

  return next();
};

export default validateEmail;
