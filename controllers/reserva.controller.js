const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 1. GET - Obtener todas las reservas
const obtenerReservas = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        guia: {
          include: {
            usuario: true
          }
        },
        cliente: {
          include: {
            usuario: true
          }
        }
      },
      orderBy: {
        fechaExcursion: 'asc'
      }
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
    console.error(error);

    res.status(500).json({
      error: 'Error al obtener las reservas'
    });
  }
};


// 2. GET - Obtener reserva por ID
const obtenerReservaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await prisma.reserva.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        guia: {
          include: {
            usuario: true
          }
        },
        cliente: {
          include: {
            usuario: true
          }
        }
      }
    });

    if (!reserva) {
      return res.status(404).json({
        error: 'Reserva no encontrada'
      });
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
    console.error(error);

    res.status(500).json({
      error: 'Error al obtener la reserva'
    });
  }
};


// 3. GET - Obtener reservas de un cliente específico
const obtenerReservasPorCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;

    const reservas = await prisma.reserva.findMany({
      where: {
        clienteId: Number(clienteId)
      },
      include: {
        guia: {
          include: {
            usuario: true
          }
        },
        cliente: {
          include: {
            usuario: true
          }
        }
      },
      orderBy: {
        fechaExcursion: 'asc'
      }
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
    console.error(error);

    res.status(500).json({
      error: 'Error al obtener las reservas del cliente'
    });
  }
};


// 4. GET - Obtener fechas ocupadas de un guía
const obtenerFechasOcupadasPorGuia = async (req, res) => {
  try {
    const { guiaId } = req.params;

    const reservas = await prisma.reserva.findMany({
      where: {
        guiaId: Number(guiaId),
        estado: {
          not: 'CANCELADA'
        }
      },
      select: {
        id: true,
        fechaExcursion: true
      },
      orderBy: {
        fechaExcursion: 'asc'
      }
    });

    res.json(reservas);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error al obtener las fechas ocupadas'
    });
  }
};


// 5. POST - Crear reserva
const crearReserva = async (req, res) => {
  try {
    const {
      clienteNombre,
      clienteTelefono,
      clienteEmail,
      fechaExcursion,
      cantPersonas,
      tipoServicio,
      guiaId,
      clienteId
    } = req.body;

    let idClienteFinal = clienteId;

    // Si no viene clienteId, se crea un cliente nuevo
    if (!idClienteFinal) {
      const emailCli =
        clienteEmail || `cliente_${Date.now()}@pesca.com`;

      const nuevoCliente = await prisma.usuario.create({
        data: {
          nombre: clienteNombre || 'Cliente Anónimo',
          email: emailCli,
          password: '123',
          rol: 'CLIENTE',
          cliente: {
            create: {
              telefono: clienteTelefono
            }
          }
        },
        include: {
          cliente: true
        }
      });

      idClienteFinal = nuevoCliente.cliente.id;
    }

    // Buscar guía
    const guia = await prisma.guia.findUnique({
      where: {
        id: Number(guiaId)
      }
    });

    if (!guia) {
      return res.status(404).json({
        error: 'Guía no encontrado'
      });
    }

    // Verificar capacidad
    const personas = Number(cantPersonas);

    if (personas > guia.capacidadMax) {
      return res.status(400).json({
        error: `La capacidad máxima del guía es de ${guia.capacidadMax} personas.`
      });
    }

    // Verificar si el guía ya está ocupado ese día
    const fecha = new Date(fechaExcursion);

    const inicioDia = new Date(fecha);
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date(fecha);
    finDia.setHours(23, 59, 59, 999);

    const reservaExistente = await prisma.reserva.findFirst({
      where: {
        guiaId: Number(guiaId),
        fechaExcursion: {
          gte: inicioDia,
          lte: finDia
        },
        estado: {
          not: 'CANCELADA'
        }
      }
    });

    if (reservaExistente) {
      return res.status(400).json({
        error: 'El guía ya tiene una reserva para esa fecha.'
      });
    }

    // Determinar precio
    const servicio = tipoServicio.toUpperCase();

    let precioUnitario = guia.precioBase;

    if (servicio === 'FULL' && guia.precioFull) {
      precioUnitario = guia.precioFull;
    }

    // Crear reserva
    const nuevaReserva = await prisma.reserva.create({
      data: {
        fechaExcursion: fecha,
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

    res.status(500).json({
      error: 'Error al registrar la reserva'
    });
  }
};


// 6. PUT - Actualizar estado
const actualizarEstadoReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const reserva = await prisma.reserva.update({
      where: {
        id: Number(id)
      },
      data: {
        estado: estado.toUpperCase()
      }
    });

    res.json(reserva);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error al actualizar la reserva'
    });
  }
};


// 7. DELETE - Eliminar reserva
const eliminarReserva = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.reserva.delete({
      where: {
        id: Number(id)
      }
    });

    res.json({
      mensaje: 'Reserva eliminada correctamente'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error al eliminar la reserva'
    });
  }
};


module.exports = {
  obtenerReservas,
  obtenerReservaPorId,
  obtenerReservasPorCliente,
  obtenerFechasOcupadasPorGuia,
  crearReserva,
  actualizarEstadoReserva,
  eliminarReserva
};