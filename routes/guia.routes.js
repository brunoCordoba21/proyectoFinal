const { Router } = require('express');
const router = Router();

const { 
  obtenerGuias, 
  crearGuia, 
  actualizarGuia, 
  eliminarGuia 
} = require('../controllers/guia.controller');

router.get('/', obtenerGuias);
router.post('/', crearGuia);
router.put('/:id', actualizarGuia);
router.delete('/:id', eliminarGuia);

module.exports = router;