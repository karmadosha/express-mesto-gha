const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');
const urls = require('../utils/urls');

usersRouter.get('/', getUsers);

usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex(),
  }),
}), getUserById);

usersRouter.get('/me', getCurrentUser);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(urls),
  }),
}), updateUserAvatar);

module.exports = usersRouter;
