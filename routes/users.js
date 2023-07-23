const usersRouter = require('express').Router();

const { getUsers, getUserById, createUser, updateUserInfo, updateUserAvatar } = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', getUserById);
usersRouter.post('/users', createUser);
usersRouter.patch('/users/me', updateUserInfo);
usersRouter.patch('/users/me', updateUserAvatar);

module.exports = usersRouter;