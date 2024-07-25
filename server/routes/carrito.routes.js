const express = require('express');
const router = express.Router();
const {
    agregarArticuloCarrito,
    mostrarCarrito
} = require('../controllers/carrito.controller');

router.post('/', agregarArticuloCarrito);
router.get('/mostrar/:carritoId', mostrarCarrito);

module.exports = router;
