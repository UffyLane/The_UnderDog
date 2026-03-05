const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

const { JWT_SECRET } = require('../utils/config');

// ================================
// POST /signup — register user
// ================================
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Email already exists'));
        return;
      }

      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid user data'));
        return;
      }

      next(err);
    });
};

// ================================
// POST /signin — login + JWT
// ================================
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(next);
};

// ================================
// GET /users/me — current user
// ================================
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.send({
        name: user.name,
        email: user.email,
        createdAt: user.createdAt, // requires timestamps: true in schema
      });
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
};
