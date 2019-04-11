// User controller
import bcrypt from 'bcrypt';
import checkLoginStatus from '../helpers/checkLoginStatus';
import handlePswrdComparison from '../helpers/handlePswrdComparison';
import hanldeNewUser from '../helpers/handleNewUser';

export const users = [];

export class UserController {
  static createUser(req, res) {
    const {
      email, firstname, lastname, password, type, isAdmin,
    } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        res.status(500).json({ status: 500, error: err });
      } else {
        const newUser = {
          id: users.length + 1,
          email,
          firstname,
          lastname,
          password: hash,
          type,
          isAdmin,
        };

        users.push(newUser);

        hanldeNewUser(res, newUser);
      }
    });
  }

  static loginUser(req, res) {
    if (req.body.token || req.query.token || req.headers['x-access-token']) {
      checkLoginStatus(req, res);
    } else {
      const owner = users.filter(user => user.email === req.body.email);

      if (owner.length === 0) {
        res.status(401).json({ status: 401, error: 'No User found for the provided email!' });
      } else {
        handlePswrdComparison(res, owner[0], req.body.password, owner[0].password);
      }
    }
  }
}
