const usersRouter = require('express').Router();

const { getUsers, getUserById, createUser, updateUserInfo, updateUserAvatar } = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserById);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUserInfo);
usersRouter.patch('/me/avatar', updateUserAvatar);

module.exports = usersRouter;