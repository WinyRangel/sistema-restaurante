const express = require('express');
const router = express.Router();

const {
    agregarPuntuacion,
    obtenerPuntuaciones
} = require('../controllers/puntuacion.controller');

router.get('/', obtenerPuntuaciones);
router.post('/agregar', agregarPuntuacion);

module.exports = router;
