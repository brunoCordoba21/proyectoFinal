const express = require('express');
const router = express.Router();
const {
  obtenerGuias,
  obtenerGuiaPorId,
  registrarGuia,
  actualizarGuia,
  eliminarGuia
} = require('../controllers/guia.controller');

router.get('/', obtenerGuias);
router.get('/:id', obtenerGuiaPorId);
router.post('/', registrarGuia);
router.put('/:id', actualizarGuia);
router.delete('/:id', eliminarGuia);

module.exports = router;