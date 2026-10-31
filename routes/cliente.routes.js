const express = require('express');

const router = express.Router();

const {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  modificarCliente,
  eliminarCliente
} = require('../controllers/cliente.controller');


// GET → obtener todos los clientes
router.get('/', obtenerClientes);

// GET → obtener un cliente por ID
router.get('/:id', obtenerClientePorId);

// POST → crear un nuevo cliente
router.post('/:id', crearCliente);

// PUT → modificar un cliente
router.put('/:id', modificarCliente);

// DELETE → eliminar un cliente
router.delete('/:id', eliminarCliente);


module.exports = router;