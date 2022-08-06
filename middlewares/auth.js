const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {

    if (!req.cookies.jwt) {
      throw new Error('токен отсутствует');
    }
    const token = req.cookies.jwt;

    // добавить ошибку если токен не тот!!!!!
    req.user = jwt.verify(token, 'encryption-key');

    next()
  }
  catch (err) {
    res.status(401).send({message: 'Токен отсутствует, необходима авторизация'})    // ДОРАБОТАТЬ!!!!!
  }

}