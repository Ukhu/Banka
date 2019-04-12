import { verify } from 'jsonwebtoken';
import { validationResult } from 'express-validator/check';
import dotenv from 'dotenv';

dotenv.config();

const isAuthorized = (req, res, next) => {
  const errorFormatter = ({ location, msg, param }) => `${location}[${param}]: ${msg}`;

  const result = validationResult(req).formatWith(errorFormatter);

  if (!result.isEmpty()) {
    res.status(400).json({ status: 400, error: result.array({ onlyFirstError: true }) });
  } else {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
      verify(token, process.env.JWT_KEY, (err, decod) => {
        if (err) {
          res.status(403).json({
            status: 403,
            error: 'FORBIDDEN REQUEST - Wrong Token',
          });
        } else {
          req.decoded = decod;
          next();
        }
      });
    } else {
      res.status(403).json({
        status: 403,
        error: 'FORBIDDEN REQUEST - No Token Provided',
      });
    }
  }
};

export default isAuthorized;
