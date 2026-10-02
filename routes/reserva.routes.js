const express = require('express');

const router = express.Router();

const {
  obtenerReservas,
  obtenerReservaPorId,
  obtenerReservasPorCliente,
  obtenerFechasOcupadasPorGuia,
  crearReserva,
  actualizarEstadoReserva,
  eliminarReserva
} = require('../controllers/reserva.controller');


router.get('/', obtenerReservas);

// Reservas de un cliente
router.get('/cliente/:clienteId', obtenerReservasPorCliente);

// Fechas ocupadas de un guía
router.get('/guia/:guiaId/fechas', obtenerFechasOcupadasPorGuia);

// Buscar reserva por ID
router.get('/:id', obtenerReservaPorId);

router.post('/', crearReserva);

router.put('/:id/estado', actualizarEstadoReserva);

router.delete('/:id', eliminarReserva);


module.exports = router;