const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const obtenerClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: { usuario: true }
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

const crearCliente = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    const nuevoCliente = await prisma.usuario.create({
      data: {
        nombre,
        email: email || `cliente_${Date.now()}@pesca.com`,
        password: "123",
        rol: "CLIENTE",
        cliente: { create: { telefono } }
      },
      include: { cliente: true }
    });
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar cliente' });
  }
};

module.exports = { obtenerClientes, crearCliente };