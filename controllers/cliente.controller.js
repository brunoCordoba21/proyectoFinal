const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// =====================================================
// GET → Obtener todos los clientes
// =====================================================
const obtenerClientes = async (req, res) => {
  try {

    const clientes = await prisma.cliente.findMany({
      include: { usuario: true }
    });

    res.json(clientes);

  } catch (error) {

    res.status(500).json({
      error: 'Error al obtener clientes'
    });

  }
};


// =====================================================
// GET → Obtener un cliente por ID
// =====================================================
const obtenerClientePorId = async (req, res) => {
  try {

    // Obtenemos el ID que viene en la URL
    const { id } = req.params;

    const cliente = await prisma.cliente.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        usuario: true
      }
    });

    // Si no existe el cliente
    if (!cliente) {
      return res.status(404).json({
        error: 'Cliente no encontrado'
      });
    }

    res.json(cliente);

  } catch (error) {

    res.status(500).json({
      error: 'Error al obtener el cliente'
    });

  }
};


// =====================================================
// POST → Crear un nuevo cliente
// =====================================================
const crearCliente = async (req, res) => {
  try {

    const { nombre, email, telefono } = req.body;

    const nuevoCliente = await prisma.usuario.create({
      data: {

        nombre,

        email: email || `cliente_${Date.now()}@pesca.com`,

        password: "123",

        rol: "CLIENTE",

        cliente: {
          create: {
            telefono
          }
        }
      },

      include: {
        cliente: true
      }
    });

    res.status(201).json(nuevoCliente);

  } catch (error) {

    res.status(500).json({
      error: 'Error al registrar cliente'
    });

  }
};


// =====================================================
// PUT → Modificar un cliente
// =====================================================
const modificarCliente = async (req, res) => {
  try {

    // ID que viene en la URL
    const { id } = req.params;

    // Datos que vienen desde Thunder Client
    const { nombre, email, telefono, password } = req.body;

    // Primero buscamos el cliente
    const cliente = await prisma.cliente.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!cliente) {
      return res.status(404).json({
        error: 'Cliente no encontrado'
      });
    }

    // Modificamos los datos del Usuario relacionado
    const usuarioActualizado = await prisma.usuario.update({
      where: {
        id: cliente.usuarioId
      },
      data: {
        nombre,
        email,
        password
      },
      include: {
        cliente: true
      }
    });

    // Modificamos el teléfono del Cliente
    if (telefono !== undefined) {
      await prisma.cliente.update({
        where: {
          id: parseInt(id)
        },
        data: {
          telefono
        }
      });
    }

    res.json(usuarioActualizado);

  } catch (error) {

    res.status(500).json({
      error: 'Error al modificar cliente'
    });

  }
};


// =====================================================
// DELETE → Eliminar un cliente
// =====================================================
const eliminarCliente = async (req, res) => {
  try {

    // ID que viene en la URL
    const { id } = req.params;

    // Buscamos el cliente
    const cliente = await prisma.cliente.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!cliente) {
      return res.status(404).json({
        error: 'Cliente no encontrado'
      });
    }

    // Eliminamos primero el cliente
    await prisma.cliente.delete({
      where: {
        id: parseInt(id)
      }
    });

    // Después eliminamos el usuario relacionado
    await prisma.usuario.delete({
      where: {
        id: cliente.usuarioId
      }
    });

    res.json({
      mensaje: 'Cliente eliminado correctamente'
    });

  } catch (error) {

    res.status(500).json({
      error: 'Error al eliminar cliente'
    });

  }
};


// =====================================================
// Exportamos todos los métodos
// =====================================================
module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  modificarCliente,
  eliminarCliente
};