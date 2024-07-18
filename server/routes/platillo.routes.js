const express = require('express');
const router = express.Router();
const {
  getPlatillos,
  getPlatilloById,
  crearPlatillo,
  actualizarPlatillo,
  eliminarPlatillo,
  upload
} = require('../controllers/platillo.controller');

router.get('/', getPlatillos);
router.get('/:id', getPlatilloById);
router.post('/', upload.single('imagen'), crearPlatillo);
router.put('/:id', upload.single('imagen'), actualizarPlatillo);
router.delete('/:id', eliminarPlatillo);

module.exports = router;
