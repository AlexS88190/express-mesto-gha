const Card = require('../models/card');
const { ERROR_400, ERROR_401, ERROR_404, ERROR_DEFAULT } = require('../utils/constants');

const getCards = async (req, res) => {
    try {
      const cards = await Card.find({});
      res.send(cards);
    } catch (err) {
      res.status(ERROR_DEFAULT).send({"message": "Ошибка по-умолчанию"});
    }
}

const createCard = async (req, res) => {
    try {
        req.body.owner = req.user._id;
        const {name, link, owner} = req.body;
        const card = new Card({name, link, owner});
        await card.save();
        res.send(card);
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(ERROR_400).send({"message": "Переданы некорректные данные при создании карточки"})
        } else {
          res.status(ERROR_DEFAULT).send({"message": "Ошибка по-умолчанию"});
        }
    }
}

const deleteCard = async (req, res) => {
    try {
        const card = await Card.findByIdAndRemove(req.params.cardId);
        if (card === null) {
            throw new Error('card is missing')
        }
        res.send(card);
    } catch (err) {
        if (err.message === 'card is missing') {
          res.status(ERROR_404).send({"message": "Карточка с указанным _id не найдена"});
        } else if (err.name === 'CastError') {
          res.status(ERROR_400).send({"message": "Некорректный _id карточки"});
        } else {
          res.status(ERROR_DEFAULT).send({"message": "Ошибка по-умолчанию"});
        }
    }
}

const likeCard = async (req, res) => {
    try {
        const card = await Card.findByIdAndUpdate(req.params.cardId, { $addToSet: {likes: req.user._id} }, {new: true});

        if (card === null) {
            throw new Error('card is missing')
        }
        res.send(card);
    } catch (err) {
      if (err.message === 'card is missing') {
        res.status(ERROR_404).send({"message": "Карточка с указанным _id не найдена"});
      } else if (err.name === 'CastError') {
        res.status(ERROR_400).send({"message": "Некорректный _id карточки"});
      } else {
        res.status(ERROR_DEFAULT).send({"message": "Ошибка по-умолчанию"});
      }
    }
}

const dislikeCard  = async (req, res) => {
    try {
        const card = await Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, {new: true});
        if (card === null) {
            throw new Error('card is missing')
        }
        res.send(card);
    } catch (err) {
      if (err.message === 'card is missing') {
        res.status(ERROR_404).send({"message": "Карточка с указанным _id не найдена"});
      } else if (err.name === 'CastError') {
        res.status(ERROR_400).send({"message": "Некорректный _id карточки"});
      } else {
        res.status(ERROR_DEFAULT).send({"message": "Ошибка по-умолчанию"});
      }
    }
}

module.exports = {
    getCards,
    createCard,
    deleteCard,
    likeCard,
    dislikeCard
}