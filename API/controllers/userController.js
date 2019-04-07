// User controller

import { sign } from 'jsonwebtoken';

export const users = [];

export class UserController {
  static createUser(req, res) {
    const {
      email, firstname, lastname, password, type, isAdmin,
    } = req.body;

    const id = users.length + 1;

    const newUser = {
      id,
      email,
      firstname,
      lastname,
      password,
      type,
      isAdmin,
    };

    // add the user to the database
    users.push(newUser);

    // create token
    const token = sign(newUser, 'examplesecretword', { expiresIn: '1hr' });

    return res.status(201).json({
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
}
