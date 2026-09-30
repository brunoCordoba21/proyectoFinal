const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. GET - Obtener todas las reservas
const obtenerReservas = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        guia: { include: { usuario: true } },
        cliente: { include: { usuario: true } }
      },
      orderBy: { fechaExcursion: 'asc' }
    });

    const respuesta = reservas.map(r => ({
      id: r.id,
      clienteNombre: r.cliente.usuario.nombre,
      clienteTelefono: r.cliente.telefono,
      fechaExcursion: r.fechaExcursion,
      cantPersonas: r.cantPersonas,
      tipoServicio: r.tipoServicio,
      precioTotal: r.precioTotal,
      estado: r.estado,
      guiaId: r.guia.id,
      guiaNombre: r.guia.usuario.nombre
    }));

    res.json(respuesta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reservas' });
  }
};

// 2. GET BY ID - Obtener una sola reserva por ID
const obtenerReservaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await prisma.reserva.findUnique({
      where: { id: Number(id) },
      include: {
        guia: { include: { usuario: true } },
        cliente: { include: { usuario: true } }
      }
    });

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json({
      id: reserva.id,
      clienteNombre: reserva.cliente.usuario.nombre,
      clienteTelefono: reserva.cliente.telefono,
      fechaExcursion: reserva.fechaExcursion,
      cantPersonas: reserva.cantPersonas,
      tipoServicio: reserva.tipoServicio,
      precioTotal: reserva.precioTotal,
      estado: reserva.estado,
      guiaId: reserva.guia.id,
      guiaNombre: reserva.guia.usuario.nombre
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la reserva' });
  }
};

// 3. POST - Crear una nueva reserva
const crearReserva = async (req, res) => {
  try {
    const { 
      clienteNombre, clienteTelefono, clienteEmail,
      fechaExcursion, cantPersonas, tipoServicio, guiaId, clienteId 
    } = req.body;

    let idClienteFinal = clienteId;

    // Si no viene clienteId, crea el cliente al vuelo en la BD
    if (!idClienteFinal) {
      const emailCli = clienteEmail || `cliente_${Date.now()}@pesca.com`;
      const nuevoCliente = await prisma.usuario.create({
        data: {
          nombre: clienteNombre || 'Cliente Anónimo',
          email: emailCli,
          password: '123',
          rol: 'CLIENTE',
          cliente: { create: { telefono: clienteTelefono } }
        },
        include: { cliente: true }
      });
      idClienteFinal = nuevoCliente.cliente.id;
    }

    const guia = await prisma.guia.findUnique({ where: { id: Number(guiaId) } });
    if (!guia) return res.status(404).json({ error: 'Guía no encontrado' });

    const personas = Number(cantPersonas);
    if (personas > guia.capacidadMax) {
      return res.status(400).json({ error: `La capacidad máxima del guía es de ${guia.capacidadMax} personas.` });
    }

    const servicio = tipoServicio.toUpperCase();
    let precioUnitario = guia.precioBase;
    if (servicio === 'FULL' && guia.precioFull) precioUnitario = guia.precioFull;

    const nuevaReserva = await prisma.reserva.create({
      data: {
        fechaExcursion: new Date(fechaExcursion),
        cantPersonas: personas,
        tipoServicio: servicio,
        precioTotal: precioUnitario,
        guiaId: Number(guiaId),
        clienteId: Number(idClienteFinal)
      }
    });

    res.status(201).json(nuevaReserva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar la reserva' });
  }
};

// 4. PUT - Actualizar el estado de la reserva ("CONFIRMADA", "CANCELADA")
const actualizarEstadoReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const reserva = await prisma.reserva.update({
      where: { id: Number(id) },
      data: { estado: estado.toUpperCase() }
    });

    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la reserva' });
  }
};

// 5. DELETE - Cancelar/Eliminar reserva
const eliminarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.reserva.delete({
      where: { id: Number(id) }
    });

    res.json({ mensaje: 'Reserva eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la reserva' });
  }
};

module.exports = {
  obtenerReservas,
  obtenerReservaPorId,
  crearReserva,
  actualizarEstadoReserva,
  eliminarReserva
};