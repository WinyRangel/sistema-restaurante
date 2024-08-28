const express = require('express');
const router = express.Router();
const {
    agregarArticuloCarrito,
    mostrarCarrito,
    eliminarArticuloCarrito,
    vaciarCarrito,
    actualizarCantidadArticulo
} = require('../controllers/carrito.controller');

router.post('/', agregarArticuloCarrito);
router.get('/mostrar/:carritoId', mostrarCarrito);
router.delete('/eliminar/:itemCarritoId', eliminarArticuloCarrito);
router.delete('/vaciar/:carritoId', vaciarCarrito)
router.put('/actualizar-cantidad',actualizarCantidadArticulo)

module.exports = router;
