import Users from '../models/users';

class UserController {
  static registerUser(req, res) {
    const {
      firstname,
      lastname,
      othernames,
      password,
      email,
      username,
      phoneNumber,
    } = req.body;

    // eslint-disable-next-line consistent-return
    Users.forEach((user) => {
      if (username === user.username) {
        return res.status(400).jsend.fail({ message: 'Username has been taken' });
      } if (email === user.email) {
        return res.status(400).jsend.fail({ message: 'Email has been used' });
      }
    });

    const newUser = {
      id: Users[Users.length - 1].id + 1,
      firstname,
      lastname,
      othernames,
      password,
      email,
      phoneNumber,
      username,
      registered: new Date(),
      isAdmin: false,
    };

    res.status(201).jsend.success({
      message: 'User successfully registered',
      data: newUser,
    });
  }

  static loginUser(req, res) {
    const {
      username, password,
    } = req.body;

    // eslint-disable-next-line consistent-return
    Users.forEach((user) => {
      if (username === user.username && password === user.password) {
        return res.status(200).jsend.success({
          message: 'User successfully logged in',
          user,
        });
      }
    });

    return res.status(404).jsend.fail({
      message: 'User not found',
    });
  }
}

export default UserController;
