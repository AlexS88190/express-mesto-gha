const mongoose = require('mongoose');
const User = require('./models/user');

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    owner: {
        type: User,
        required: true
    },
    likes: {
        type: [User],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', cardSchema);