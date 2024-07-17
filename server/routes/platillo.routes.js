const { Router } = require('express');
const express = require('express');
const router = Router();

const {
    getPlatillos,
    getPlatilloById,
    crearPlatillo,
    actualizarPlatillo,
    eliminarPlatillo
} = require('../controllers/platillo.controller');


router.get('/', getPlatillos);        
router.get('/:id', getPlatilloById);      
router.delete('/:id', eliminarPlatillo); 
router.post('/', crearPlatillo);      
router.put('/:id', actualizarPlatillo);   

module.exports = router;
