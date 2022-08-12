const express = require('express');

const { PORT = 3000, BASE_PATH } = process.env;
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const cardRoutes = require('./routes/cardRoutes');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');

const auth = require('./middlewares/auth');
const cookieParser = require('cookie-parser');

const { login, createUser } = require('./controllers/userControllers');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(cookieParser());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(/https?:\/\/[\w+.\-/?]+[a-z\-._~:/?#\[\]@!$&'()*+,;=0-9]/)),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
}), login);

app.use(auth);

app.use('/cards', cardRoutes);
app.use('/users', userRoutes);

app.use('/', (req, res) => {
  res.status(404).send({ message: 'Запрос осуществляется по некорректному url' });
});

app.use(errors());

app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message })
});

app.listen(PORT, () => {
  console.log('Server started');
  console.log(BASE_PATH);
});
