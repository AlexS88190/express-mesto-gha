const Card = require('../models/card');

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const UnauthorizedError = require('../errors/unauthorizedError');
const ForbiddenError = require('../errors/forbiddenError');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err)
  }
};

const createCard = async (req, res, next) => {
  try {
    req.body.owner = req.user._id;
    const { name, link, owner } = req.body;
    const card = new Card({ name, link, owner });
    await card.save();
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const err = new BadRequestError('переданы некорректные данные при создании карточки');
      next(err)
    }
    next(err)
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (card === null) {
      throw new NotFoundError('карточка с указанным _id не найдена');
    }
    if (req.user._id !== card.owner.toString()) {
      throw new ForbiddenError('у вас нет прав для удаления данной карточки');
    }
    card.remove()

    res.send({'message': `карточка с id ${card._id} удалена`});
  } catch (err) {
    if (err.name === 'CastError') {
      const err = new BadRequestError('некорректный _id карточки')
      next(err)
    }
    next(err)
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (card === null) {
      throw new NotFoundError('карточка с указанным _id не найдена');
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      const err = new BadRequestError('некорректный _id карточки');
      next(err)
    }
    next(err)
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card === null) {
      throw new NotFoundError('карточка с указанным _id не найдена');
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      const err = new BadRequestError('некорректный _id карточки');
      next(err)
    }
    next(err)
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
