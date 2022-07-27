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

module.exports = {
    getUsers,
    createUser,
    getUserById
}