const cardsRouter = require('express').Router();

const {
  getCards, createCard, deleteCard, addLike, deleteLike,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.post('/', createCard);
cardsRouter.put('/:cardId/likes', addLike);
cardsRouter.delete('/:cardId/likes', deleteLike);

module.exports = cardsRouter;
