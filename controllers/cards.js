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

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ErrorBadRequest('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Передан несуществующий id');
      } else if (!card.owner.equals(req.user._id)) {
        throw new ErrorForbidden('Недостаточно прав');
      }
      return Card.deleteOne(card)
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
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
