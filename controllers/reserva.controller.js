const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. GET - Obtener todas las reservas (incluye los datos del Guía asociado)
const obtenerReservas = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        guia: true // Trae el nombre, teléfono y embarcación del guía
      },
      orderBy: {
        fechaExcursion: 'asc'
      }
    });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reservas' });
  }
};

// 2. POST - Crear una nueva reserva con validaciones de negocio
const crearReserva = async (req, res) => {
  try {
    const { 
      clienteNombre, clienteTelefono, fechaExcursion, 
      cantPersonas, tipoServicio, guiaId 
    } = req.body;

    // A. Buscar el guía seleccionado para verificar existencia y capacidad
    const guia = await prisma.guia.findUnique({
      where: { id: Number(guiaId) }
    });

    if (!guia) {
      return res.status(404).json({ error: 'El guía seleccionado no existe' });
    }

    // B. Validar capacidad máxima del guía
    const personas = Number(cantPersonas);
    if (personas > guia.capacidadMax) {
      return res.status(400).json({ 
        error: `La cantidad de personas (${personas}) supera la capacidad máxima del guía (${guia.capacidadMax}).` 
      });
    }

    // C. Calcular precio total automáticamente según el tipo de servicio
    const servicio = tipoServicio.toUpperCase(); // "BASE" o "FULL"
    let precioUnitario = guia.precioBase;

    if (servicio === 'FULL' && guia.precioFull) {
      precioUnitario = guia.precioFull;
    }

    const precioTotal = precioUnitario;

    // D. Guardar la reserva en la base de datos
    const nuevaReserva = await prisma.reserva.create({
      data: {
        clienteNombre,
        clienteTelefono,
        fechaExcursion: new Date(fechaExcursion),
        cantPersonas: personas,
        tipoServicio: servicio,
        precioTotal,
        guiaId: Number(guiaId)
      },
      include: {
        guia: true
      }
    });

    res.status(201).json(nuevaReserva);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar la reserva' });
  }
};

// 3. PUT - Cambiar el estado de la reserva ("CONFIRMADA", "CANCELADA")
const actualizarEstadoReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const reservaActualizada = await prisma.reserva.update({
      where: { id: Number(id) },
      data: { estado: estado.toUpperCase() }
    });

    res.json(reservaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la reserva' });
  }
};

// 4. DELETE - Cancelar/Eliminar reserva
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
  crearReserva,
  actualizarEstadoReserva,
  eliminarReserva
};