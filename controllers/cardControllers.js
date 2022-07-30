const Card = require('../models/card');

const getCards = async (req, res) => {
    const cards = await Card.find({});
    res.send(cards);
}

const createCard = async (req, res) => {
    try {
        req.body.owner = req.user._id;
        const card = new Card(req.body);
        await card.save();
        res.send(card);
    } catch (err) {
        if (err._message === 'card validation failed') {
            res.status(400).send({"message": "Переданы некорректные данные при создании карточки"})
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
        res.status(404).send({"message": "Карточка с указанным _id не найдена"});
      }
      else {
        res.status(400).send({"message": "Некорректный _id карточки"})
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
            res.status(404).send({"message": "Передан несуществующий _id карточки"})
        }
        else {
            res.status(400).send({"message": "Некорректный _id карточки"})
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
            res.status(404).send({"message": "Передан несуществующий _id карточки"})
        } else {
            res.status(400).send({"message": "Некорректный _id карточки"})
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