// User controller

import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import checkLoginStatus from '../helpers/checkLoginStatus';
import handleCorrectPswrd from '../helpers/handleCorrectPswrd';

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
        const id = users.length + 1;

        const newUser = {
          id,
          email,
          firstname,
          lastname,
          password: hash,
          type,
          isAdmin,
        };

        // add the user to the database
        users.push(newUser);

        const createdUser = {
          id: newUser.id,
          email: newUser.email,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          type: newUser.type,
          isAdmin: newUser.isAdmin,
        };

        // create token
        const token = sign(createdUser, 'examplesecretword', { expiresIn: '1hr' });

        res.status(201).json({
          status: 201,
          data: {
            token,
            id: newUser.id,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email,
          },
        });
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
        handleCorrectPswrd(res, owner[0], req.body.password, owner[0].password);
      }
    }
  }
}
