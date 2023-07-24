const User = require('../models/user');
const {
  ERROR_NOT_FOUND,
  ERROR_INCORRECT_DATA,
  ERROR_DEFAULT,
} = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Ошибка сервера' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(() => {
      if (avatar) {
        res.send({ avatar });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Ошибка сервера' });
      }
    });
};
