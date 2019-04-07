// User controller

import { sign } from 'jsonwebtoken';
import { getUsersLength, pushToDataStorage } from '../models/User';

export default class UserController {
  static createUser(req, res) {
    const {
      email, firstname, lastname, password, type, isAdmin,
    } = req.body;

    const id = getUsersLength() + 1;

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
    pushToDataStorage(newUser);

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
