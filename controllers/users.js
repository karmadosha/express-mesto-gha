const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  ERROR_NOT_FOUND,
  ERROR_INCORRECT_DATA,
  ERROR_NOTUNIQUE,
} = require('../utils/errors/errors');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return new ERROR_INCORRECT_DATA('Переданы некорректные данные при создании пользователя');
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      }))
      .catch((err) => {
        if (err.code === '11000') {
          return next(new ERROR_NOTUNIQUE('Такой пользователь уже существует'));
        }
        if (err.name === 'CastError' || err.name === 'ValidationError') {
          return next(ERROR_INCORRECT_DATA('Переданы некорректные данные при создании пользователя'));
        }
        return next(err);
      }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user.id }, 'some-secret-key', { expiresIn: '7d' });

      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ token });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new ERROR_NOT_FOUND('Пользователь не найден');
      }
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ERROR_INCORRECT_DATA('Переданы некорректные данные'));
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new ERROR_NOT_FOUND('Пользователь не найден'));
      }
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(() => res.send({ user: avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ERROR_INCORRECT_DATA('Переданы некорректные данные'));
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new ERROR_NOT_FOUND('Пользователь не найден'));
      }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new ERROR_NOT_FOUND('Пользователь не найден'));
      }
      return res.send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new ERROR_INCORRECT_DATA('Переданы некорректные данные'));
      }
      return next(err);
    });
};
