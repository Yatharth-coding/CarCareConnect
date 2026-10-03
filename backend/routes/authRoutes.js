const express = require('express');
const { register, login, logout, getMe, updateProfile, deleteAccount, registerValidation, loginValidation } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.delete('/me', protect, deleteAccount);

module.exports = router;
