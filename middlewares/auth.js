const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {

    if (!req.cookies.jwt) {
      throw new Error('токен отсутствует');
    }
    const token = req.cookies.jwt;
    const payload = jwt.verify(token, 'encryption-key');

    // добавить ошибку если токен не тот!!!!!
    req.user = payload

    next()
  }
  catch (err) {
    res.status(401).send({message: 'Токен отсутствует, необходима авторизация'})
  }

}