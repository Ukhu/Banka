import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const checkLoginStatus = (req, res) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  const result = verify(token, process.env.JWT_KEY, (err, decod) => {
    if (err) {
      return res.status(403).json({
        status: 403,
        error: 'FORBIDDEN REQUEST - Wrong or invalid token',
      });
    }
    req.decoded = decod;
    return res.status(428).json({ status: 428, error: 'Logout existing user account before logging in again' });
  });
  return result;
};

export default checkLoginStatus;