const express = require('express');
const { PORT = 3000, BASE_PATH } = process.env;
const userRoutes  = require('./routes/userRoutes');
const cardRoutes  = require('./routes/cardRoutes');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
    req.user = {
        _id: '62e158d9c1b724fd85bd0788'
    };
    next();
});

app.use('/cards', cardRoutes);
app.use('/users', userRoutes);

app.use('/', (req, res) => {
  try {
    throw new Error('user is missing');
  }
  catch (err) {
    res.status(404).send({"message": "Запрос осуществляется по некорректному url"});
  }
});

app.listen(PORT, () => {
    console.log('Server started');
    console.log(BASE_PATH);
});
