const express = require('express');

const app = express();

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const users = [];

app.post('/api/v1/auth/signup', (req, res) => {
  const id = Math.floor(Math.random() * 1001);

  let errMsg;

  // create new user
  const newUser = {
    id,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    type: req.body.type,
    isAdmin: req.body.isAdmin,
  };

  // console.log(newUser);

  Object.keys(newUser).forEach((key) => {
    if (newUser[key] === '' || newUser[key] === undefined) {
      errMsg = 'Fill all the required fields';
    }
  });

  if (errMsg) {
    res.status(400).json({
      status: 400,
      error: errMsg,
    });
  } else {
    // add the user to the database
    users.push(newUser);

    // console.log(users);

    // create token
    const token = jwt.sign(newUser, 'examplesecretword');

    res.status(201).json({
      status: 201,
      data: {
        token,
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  }
});

app.listen(3000, () => console.log('Server Has Started!!!'));

module.exports = app;
