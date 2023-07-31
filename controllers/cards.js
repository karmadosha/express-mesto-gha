const Card = require('../models/card');
const {
  ERROR_NOT_FOUND,
  ERROR_INCORRECT_DATA,
  ERROR_FORBIDDEN,
} = require('../utils/errors/errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ERROR_INCORRECT_DATA('Переданы некорректные данные');
      } else {
        return next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new ERROR_INCORRECT_DATA('Переданы некорректные данные'));
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
        throw new ERROR_NOT_FOUND('Карточка не найдена');
      }
      if (String(card.owner) !== String(owner)) {
        throw new ERROR_FORBIDDEN('Недостаточно прав');
      }
      return Card.findByIdAndRemove(cardId);
    })
    .then((card) => res.send(card))
    .catch((err) => next(err));
};

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ card });
      } else {
        throw new ERROR_NOT_FOUND('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ERROR_INCORRECT_DATA('Переданы некорректные данные');
      } else {
        next(err);
      }
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ card });
      } else {
        throw new ERROR_NOT_FOUND('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ERROR_INCORRECT_DATA('Переданы некорректные данные');
      } else {
        next(err);
      }
    });
};
