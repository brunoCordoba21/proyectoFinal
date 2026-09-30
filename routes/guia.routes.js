const express = require('express');
const router = express.Router();
const guiaController = require('../controllers/guia.controller');

// Mapeo completo de métodos HTTP
router.get('/', guiaController.obtenerGuias);           // GET http://localhost:3000/api/guias
router.get('/:id', guiaController.obtenerGuiaPorId);    // GET http://localhost:3000/api/guias/1
router.post('/', guiaController.registrarGuia);         // POST http://localhost:3000/api/guias
router.put('/:id', guiaController.actualizarGuia);      // PUT http://localhost:3000/api/guias/1
router.delete('/:id', guiaController.eliminarGuia);   // DELETE http://localhost:3000/api/guias/1

module.exports = router;