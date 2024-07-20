const express = require('express');
const router = express.Router();
const {
  getBebidas,
  getBebidaById,
  crearBebida,
  actualizarBebida,
  eliminarBebida,
  upload
} = require('../controllers/bebida.controller');

router.get('/', getBebidas);
router.get('/:id', getBebidaById);
router.post('/', upload.single('imagen'), crearBebida);
router.put('/:id', upload.single('imagen'), actualizarBebida);
router.delete('/:id', eliminarBebida);

module.exports = router;
