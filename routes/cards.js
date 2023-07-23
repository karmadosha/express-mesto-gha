const cardsRouter = require('express').Router();

const { getCards, createCard, deleteCard, addLike, deleteLike } = require('../controllers/cards');

cardsRouter.get('/cards', getCards);
cardsRouter.delete('/cards/:cardId', deleteCard);
cardsRouter.post('/cards', createCard);
cardsRouter.put('/cards/:cardId/likes', addLike);
cardsRouter.delete('/cards/:cardId/likes', deleteLike);

module.exports = cardsRouter;