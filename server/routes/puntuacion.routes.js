const express = require('express');
const router = express.Router();

const {
    agregarPuntuacion,
    obtenerPuntuaciones,
    obtenerPuntuacionPromedio
} = require('../controllers/puntuacion.controller');

router.get('/', obtenerPuntuaciones);
router.post('/agregar', agregarPuntuacion);
router.get('/promedio',obtenerPuntuacionPromedio)

module.exports = router;
