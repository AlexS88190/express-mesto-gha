const router = require('express').Router();
const userRoutes = require('./userRoutes');
const cardRoutes = require('./cardRoutes');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFoundError');
const { login, createUser } = require('../controllers/userControllers');
const { validateUserBody, validateAuthentication } = require('../middlewares/validations');

router.post('/signup', validateUserBody, createUser);

router.post('/signin', validateAuthentication, login);

router.use(auth);

router.use('/cards', cardRoutes);
router.use('/users', userRoutes);

router.use((req, res, next) => {
  next(new NotFoundError('запрос осуществляется по некорректному url'));
});


module.exports = router