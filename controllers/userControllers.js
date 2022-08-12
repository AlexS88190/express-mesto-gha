const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');

const createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const {
      name, about, avatar, email,
    } = req.body;
    const password = hash;
    const user = new User({
      name, about, avatar, email, password,
    });
    await user.save();
    user.password = undefined;
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const err = new BadRequestError('переданы некорректные данные при создании пользователя');
      next(err);
    } else if (err.code === 11000) {
      const err = new ConflictError('пользователь с таким e-mail уже существует');
      next(err);
    } else {
      next(err);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, 'encryption-key', { expiresIn: '7d' });
    res.cookie('jwt', token, { httpOnly: true }).send({ message: 'вы успешно зарегистрировались!' });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const getUserMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user === null) {
      throw new NotFoundError('пользователь с указанным _id не найден');
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const err = new BadRequestError('переданы некорректные данные при обновлении пользователя');
      next(err);
    } else {
      next(err);
    }
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const err = new BadRequestError('переданы некорректные данные при обновлении аватара');
      next(err);
    } else {
      next(err);
    }
  }
};

module.exports = {
  getUsers,
  getUserMe,
  createUser,
  getUserById,
  updateProfile,
  updateAvatar,
  login,
};
