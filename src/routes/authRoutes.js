const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware'); // IMPORT MIDDLEWARE
const router = express.Router();

// Route untuk register (tanpa middleware)
router.post('/register', authController.register);

// Route untuk login (tanpa middleware)
router.post('/login', authController.login);

// Route untuk logout (pake middleware, butuh token)
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
