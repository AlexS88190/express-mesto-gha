const router = require('express').Router();
const {getUsers, createUser, getUserById, updateProfile, updateAvatar} = require('../controllers/userControllers');

router.get('/', getUsers);

router.post('/', createUser);

router.get('/:id', getUserById);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

module.exports = router;