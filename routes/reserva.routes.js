const express = require('express');
const router = express.Router();
const {
  obtenerReservas,
  obtenerReservaPorId,
  crearReserva,
  actualizarEstadoReserva,
  eliminarReserva
} = require('../controllers/reserva.controller');

router.get('/', obtenerReservas);
router.get('/:id', obtenerReservaPorId);
router.post('/', crearReserva);
router.put('/:id/estado', actualizarEstadoReserva);
router.delete('/:id', eliminarReserva);

module.exports = router;