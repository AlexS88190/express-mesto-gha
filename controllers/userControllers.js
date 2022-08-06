const User = require('../models/user');
const {
  ERROR_400, ERROR_404, ERROR_DEFAULT,
} = require('../utils/constants');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const createUser = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const { name, about, avatar, email } = req.body;
    const password = hash;
    const user = new User({ name, about, avatar, email, password });
    await user.save();
    res.send(user);

  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    } else {
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка по-умолчанию' });   // ДОРАБОТАТЬ!!!!!
    }
  }
};

const login = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, 'encryption-key', { expiresIn: '7d' });
    res.cookie('jwt', token, { httpOnly: true }).end();

  } catch (err) {
    res.status(401).send({message: err.message});   // ДОРАБОТАТЬ!!!!!
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(ERROR_DEFAULT).send({ message: 'Ошибка по-умолчанию' });
  }
};

const getUserMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
   ['password', "__v"].forEach(elem => delete user._doc[elem])
    res.send(user);
  } catch (err) {
    console.log('ошибка') // ДОРАБОТАТЬ!!!!!
  }
}

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user === null) {
      throw new Error('user is missing');
    }
    res.send(user);
  } catch (err) {
    if (err.message === 'user is missing') {
      res.status(ERROR_404).send({ message: 'Пользователь с указанным _id не найден' });
    } else if (err.name === 'CastError') {
      res.status(ERROR_400).send({ message: 'Некорректный _id пользователя' });
    } else {
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка по-умолчанию' });
    }
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (user === null) {
      throw new Error('user is missing');
    }
    res.send(user);
  } catch (err) {
    if (err.message === 'user is missing') {
      res.status(ERROR_404).send({ message: 'Пользователь с указанным _id не найден' });
    } else if (err.name === 'ValidationError') {
      res.status(ERROR_400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    } else {
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка по-умолчанию' });
    }
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
    if (user === null) {
      throw new Error('user is missing');
    }
    res.send(user);
  } catch (err) {
    if (err.message === 'user is missing') {
      res.status(ERROR_404).send({ message: 'Пользователь с указанным _id не найден' });
    } else if (err.name === 'ValidationError') {
      res.status(ERROR_400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    } else {
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка по-умолчанию' });
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
  login
};
