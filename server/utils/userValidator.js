/* eslint-disable no-restricted-globals */
import ExpressValidator from 'express-validator/check';

const { check, validationResult } = ExpressValidator;

export const returnValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
    .array()
    .map(error => error.msg);
  if (!errors.length) return next();
  return res.status(422).json({ errors, status: false });
};

export const validateLogin = [
  check('username')
    .exists()
    .withMessage('Username is required')
    .isAlphanumeric()
    .withMessage('Username is should be alphamumeric, no special characters and spaces.')
    .isLength({ min: 5, max: 15 })
    .withMessage('Username must be at least 5 characters long and not more than 15.')
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the username.'),

  check('password')
    .exists()
    .withMessage('Password is required')
    .isLength({ min: 6, max: 4000 })
    .withMessage('Ensure password is more that 6 characters')
    .custom(value => !/\s/.test(value))
    .withMessage('Please provide a valid password'),
];

export const validateSignup = [
  check('firstname')
    .exists()
    .withMessage('Firstname is required')
    .isString()
    .withMessage('Firstname should contain only strings'),

  check('lastname')
    .exists()
    .withMessage('Lastname is required')
    .isString()
    .withMessage('Lastname should contain only strings'),

  check('email')
    .exists()
    .withMessage('Please provide an email address')
    .isEmail()
    .withMessage('Your Email address is invalid')
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the email.'),

  check('phonenumber')
    .exists()
    .withMessage('PhoneNumber is required')
    .isMobilePhone()
    .withMessage('Please enter a valid phone number')
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the phonenumber.'),

  check('password')
    .exists()
    .withMessage('Password is required')
    .isLength({ min: 6, max: 4000 })
    .withMessage('The password length should be a least 8 digit in length')
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the password.'),

  check('username')
    .exists()
    .withMessage('Username is required')
    .isAlphanumeric()
    .withMessage('Username is should be alphamumeric, no special characters and spaces.')
    .isLength({ min: 5, max: 15 })
    .withMessage('Username must be at least 5 characters long and not more than 15.')
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the username.'),
];
