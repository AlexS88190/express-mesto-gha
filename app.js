const express = require('express');

const routes = require('./routes/index');

const { PORT = 3000, BASE_PATH } = process.env;
const mongoose = require('mongoose');
const { processingError } = require('./middlewares/processingError');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const cardRoutes = require('./routes/cardRoutes');
const NotFoundError = require('./errors/notFoundError');

const auth = require('./middlewares/auth');

const { login, createUser } = require('./controllers/userControllers');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(cookieParser());

app.use(routes)

app.use(errors());

app.use(processingError);

app.listen(PORT, () => {
  console.log('Server started');
  console.log(BASE_PATH);
});
