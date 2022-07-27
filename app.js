const express = require('express');
const { PORT = 3000, BASE_PATH } = process.env;
//const routes  = require('./routes/films');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');





app.listen(PORT, () => {
    console.log('Server started');
    console.log(BASE_PATH);
});
