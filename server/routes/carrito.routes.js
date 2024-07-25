const express = require('express');
const router = express.Router();
const {
    agregarArticuloCarrito,
    mostrarCarrito,
    eliminarArticuloCarrito,
    vaciarCarrito
} = require('../controllers/carrito.controller');

router.post('/', agregarArticuloCarrito);
router.get('/mostrar/:carritoId', mostrarCarrito);
router.delete('/eliminar/:itemCarritoId', eliminarArticuloCarrito);
router.delete('/vaciar/:carritoId', vaciarCarrito)

module.exports = router;
