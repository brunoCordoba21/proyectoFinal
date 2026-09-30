const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');

router.get('/', reservaController.obtenerReservas);
router.post('/', reservaController.crearReserva);
router.put('/:id', reservaController.actualizarEstadoReserva);
router.delete('/:id', reservaController.eliminarReserva);

module.exports = router;