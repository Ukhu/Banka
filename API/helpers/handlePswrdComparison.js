import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

const handlePswrdComparison = (res, owner, inputPwrd, realPwrd) => {
  const compare = bcrypt.compare(inputPwrd, realPwrd, (err, result) => {
    if (err) {
      return res.status(401).json({ status: 401, error: 'Authentication failed!' });
    }
    if (result) {
      const token = sign(owner, 'examplesecretword', { expiresIn: '1hr' });
      return res.status(200).json(
        {
          status: 200,
          data: {
            token,
            id: owner.id,
            firstname: owner.firstname,
            lastname: owner.lastname,
            email: owner.email,
          },
        },
      );
    }
    return res.status(401).json({ status: 401, error: 'Incorrect password' });
  });
  return compare;
};

export default handlePswrdComparison;
