const express = require('express');

const { PORT = 3000, BASE_PATH } = process.env;
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const cardRoutes = require('./routes/cardRoutes');

const auth = require('./middlewares/auth');
const cookieParser = require('cookie-parser');

const { login, createUser } = require('./controllers/userControllers');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(cookieParser());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '62e158d9c1b724fd85bd0788',
//   };
//   next();
// });

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/cards', cardRoutes);
app.use('/users', userRoutes);

app.use('/', (req, res) => {
  res.status(404).send({ message: 'Запрос осуществляется по некорректному url' });
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message })
});

app.listen(PORT, () => {
  console.log('Server started');
  console.log(BASE_PATH);
});
