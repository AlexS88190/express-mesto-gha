const express = require('express');
const { PORT = 3000, BASE_PATH } = process.env;
const routes  = require('./routes/userRoutes');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

// app.use((req, res, next) => {
//     req.user = {
//         _id: '62e1190e32eba36021defeb9'
//     };
//
//
//     next();
// });

app.use('/users', express.json(), routes);


app.listen(PORT, () => {
    console.log('Server started');
    console.log(BASE_PATH);
});
