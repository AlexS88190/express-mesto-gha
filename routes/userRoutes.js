const router = require('express').Router();
const { getUsers, getUserMe, getUserById, updateProfile, updateAvatar } = require('../controllers/userControllers');
const { celebrate, Joi } = require('celebrate');

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
    about: Joi.string().min(2).max(30)
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp(/https?:\/\/[\w+.\-/?]+[a-z\-._~:/?#\[\]@!$&'()*+,;=0-9]/))
  }),
}), updateAvatar);


module.exports = router;
