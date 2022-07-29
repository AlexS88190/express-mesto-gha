const Card = require('../models/card');

const getCards = async (req, res) => {
    const cards = await Card.find({});
    res.send(cards);
}

const createCard = async (req, res) => {
    req.body.owner = req.user._id;
    const card = new Card(req.body);
    await card.save();
    res.send(card);
}

const likeCard = async (req, res) => {
    const card = await Card.findByIdAndUpdate(req.params.cardId, { $addToSet: {likes: req.user._id} }, {new: true});
    res.send(card);
}

const dislikeCard  = async (req, res) => {
    const card = await Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, {new: true});
    res.send(card);
}

module.exports = {
    getCards,
    createCard,
    likeCard,
    dislikeCard
}