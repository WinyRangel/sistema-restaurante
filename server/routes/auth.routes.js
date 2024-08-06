const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/registro', authController.registroUsuario);
router.post('/login', authController.iniciarSesion);
router.get('/usuarios', authController.obtenerUsuarios);


module.exports = router;
