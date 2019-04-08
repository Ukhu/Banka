// User controller

import { sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
      const token = req.body.token || req.query.token || req.headers['x-access-token'];
      verify(token, 'examplesecretword', (err, decod) => {
        if (err) {
          res.status(403).json({
            status: 403,
            error: 'FORBIDDEN REQUEST - Wrong or invalid token',
          });
        } else {
          req.decoded = decod;
          res.status(428).json({ status: 428, error: 'Logout existing user account before logging in again' });
        }
      });
    } else {
      let owner;

      users.forEach((user) => {
        if (user.email === req.body.email) {
          owner = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: user.password,
            type: user.type,
            isAdmin: user.isAdmin,
          };
        }
        return owner;
      });

      if (!owner) {
        res.status(401).json({ status: 401, error: 'Authentication failed!' });
      } else {
        bcrypt.compare(req.body.password, owner.password, (err, result) => {
          if (err) {
            res.status(401).json({ status: 401, error: 'Authentication failed!' });
          } else if (result) {
            const token = sign(owner, 'examplesecretword', { expiresIn: '1hr' });

            res.status(200).json(
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
          } else {
            res.status(401).json({ status: 401, error: 'Authentication failed' });
          }
        });
      }
    }
  }
}
