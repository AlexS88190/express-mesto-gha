const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports = (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      throw new UnauthorizedError('токен отсутствует, необходима авторизация');
    }
    const token = req.cookies.jwt;

    req.user = jwt.verify(token, 'encryption-key');

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      const error = new UnauthorizedError('некорректный токен, необходима авторизация');
      next(error);
    }
    next(err);
  }
};
