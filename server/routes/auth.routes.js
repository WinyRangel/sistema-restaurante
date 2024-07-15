const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/registro', authController.registroUsuario);
router.post('/', authController.iniciarSesion);


module.exports = router;
