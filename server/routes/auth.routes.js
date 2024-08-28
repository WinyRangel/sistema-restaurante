const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/registro', authController.registroUsuario);
router.post('/login', authController.iniciarSesion);
router.get('/', authController.obtenerUsuarios);
router.delete('/:id', authController.eliminarUsuario);

module.exports = router;
