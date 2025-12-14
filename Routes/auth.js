const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth');

// Nota: Aqui definimos apenas o final da rota
router.post('/login', authController.login);
router.post('/registo', authController.registo);
router.get('/check', verifyJwt, authController.isLoggedIn);
module.exports = router;