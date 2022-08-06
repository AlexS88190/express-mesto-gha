const router = require('express').Router();
const { getUsers, getUserMe, getUserById, updateProfile, updateAvatar } = require('../controllers/userControllers');

router.get('/', getUsers);

router.get('/me', getUserMe);

router.get('/:id', getUserById);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);


module.exports = router;
