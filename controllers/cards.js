const Card = require('../models/card');
const ErrorBadRequest = require('../utils/errors/err-bad-request');
const ErrorNotFound = require('../utils/errors/err-not-found');
const ErrorForbidden = require('../utils/errors/err-forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new ErrorBadRequest('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const owner = req.res._id;
  const { cardId } = req.params;
  Card.findById({ owner, _id: cardId })
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка не найдена');
      }
      if (String(card.owner) !== String(owner)) {
        throw new ErrorForbidden('Недостаточно прав');
      }
      return Card.findByIdAndDelete(cardId);
    })
    .then(() => res.send({ message: 'Карточка успешно удалена' }))
    .catch((err) => next(err));
};

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка не найдена');
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new ErrorBadRequest('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка не найдена');
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'validationError') {
        return next(new ErrorBadRequest('Переданы некорректные данные'));
      }
      return next(err);
    });
};
