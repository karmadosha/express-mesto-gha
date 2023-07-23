const express = require('express');

const routes = express.Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

routes.use('/users', usersRouter);
routes.use('/cards', cardsRouter);

module.exports = routes;