const express = require('express');

const { PORT = 3000, BASE_PATH } = process.env;
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const { processingError } = require('./middlewares/processingError');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(cookieParser());

app.use(routes);

app.use(errors());

app.use(processingError);

app.listen(PORT, () => {
  console.log('Server started');
  console.log(BASE_PATH);
});
