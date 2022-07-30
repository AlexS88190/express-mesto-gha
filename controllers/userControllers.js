const User = require('../models/user');

const getUsers = async (req, res) => {
    const users = await User.find({});
    res.send(users);
}

const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.send(user);
    } catch (err) {
        if (err._message === 'user validation failed') {
            res.status(400).send({"message": "Переданы некорректные данные при создании пользователя"})
        }
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user === null) {
            throw new Error('user is missing')
        }
        res.send(user);
    } catch (err) {
        if (err.message === 'user is missing') {
            res.status(404).send({"message": "Запрашиваемый пользователь по указанному _id не найден"})
        } else {
            res.status(400).send({"message": "Введен некорректный _id пользователя"})
        }
    }
}

const updateProfile = async (req, res) => {
    try {
        req.params.id = req.user._id;
        const user = await User.findByIdAndUpdate(req.params.id, {name: req.body.name, about: req.body.about}, {new: true, runValidators: true});
        if (user === null) {
            throw new Error('user is missing');
        }
        res.send(user);
    } catch (err) {
        if (err._message === 'Validation failed') {
            res.status(400).send({"message": "Переданы некорректные данные при обновлении профиля"});
        }

        if (err.message === 'user is missing') {
            res.status(404).send({"message": "Пользователь с указанным _id не найден"});
        }
    }
}

const updateAvatar = async (req, res) => {
    try {
        req.params.id = req.user._id;
        const user = await User.findByIdAndUpdate(req.params.id, {avatar: req.body.avatar}, {new: true});
        if (user === null) {
            throw new Error('user is missing');
        }
        res.send(user);
    } catch (err) {
        if (err.message === 'user is missing') {
            res.status(404).send({"message": "Пользователь с указанным _id не найден"});
        }
    }
}

module.exports = {
    getUsers,
    createUser,
    getUserById,
    updateProfile,
    updateAvatar
}