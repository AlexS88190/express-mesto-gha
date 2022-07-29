const User = require('../models/user');

const getUsers = async (req, res) => {
    const users = await User.find({});
    res.send(users);
}

const createUser = async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.send(user);
}

const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.send(user);
}

const updateProfile = async (req, res) => {
    req.params.id = req.user._id;
    const user = await User.findByIdAndUpdate(req.params.id, {name: req.body.name, about: req.body.about}, {new: true});
    res.send(user);
}

const updateAvatar = async (req, res) => {
    req.params.id = req.user._id;
    const user = await User.findByIdAndUpdate(req.params.id, {avatar: req.body.avatar}, {new: true});
    res.send(user);
}


module.exports = {
    getUsers,
    createUser,
    getUserById,
    updateProfile,
    updateAvatar
}