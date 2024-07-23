const express = require('express');
const router = express.Router();
const {
    agregarArticuloCarrito,
} = require('../controllers/carrito.controller');

router.post('/', agregarArticuloCarrito);

module.exports = router;
