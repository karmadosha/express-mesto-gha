const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const ErrorNotFound = require('../utils/errors/err-not-found');
const { regexEmail, regexUrl } = require('../utils/regex');

const router = express.Router();

router.use('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexUrl),
    email: Joi.string().required().pattern(regexEmail),
    password: Joi.string().required().min(8),
  }),
}), createUser);

router.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(regexEmail),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/', (req, res, next) => {
  next(new ErrorNotFound('Страница не найдена'));
});

module.exports = router;
