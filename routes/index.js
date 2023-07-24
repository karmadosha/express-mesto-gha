const express = require('express');

const routes = express.Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

routes.use('/users', usersRouter);
routes.use('/cards', cardsRouter);
routes.use('/', (req, res, next) => {
  next(res.status(404).send({ message: 'Страница не найдена' }));
});

module.exports = routes;
