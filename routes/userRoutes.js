const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserMe, getUserById, updateProfile, updateAvatar,
} = require('../controllers/userControllers');

router.get('/', getUsers);

router.get('/me', getUserMe);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/((\w+[.\-/])+\w{2,})[a-z\-._~:/?#[\]@!$&'()*+,;=0-9]*/),
  }),
}), updateAvatar);

module.exports = router;
