const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. GET - Obtener todos los guías
const obtenerGuias = async (req, res) => {
  try {
    const guias = await prisma.guia.findMany({
      include: { usuario: { select: { nombre: true, email: true } } }
    });

    const respuesta = guias.map(g => ({
      id: g.id,
      nombre: g.usuario.nombre,
      email: g.usuario.email,
      telefono: g.telefono,
      modalidades: g.modalidades,
      embarcacion: g.embarcacion,
      servicios: g.servicios,
      precioBase: g.precioBase,
      precioFull: g.precioFull,
      capacidadMax: g.capacidadMax
    }));

    res.json(respuesta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener guías' });
  }
};

// 2. GET BY ID - Obtener un solo guía por ID
const obtenerGuiaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const guia = await prisma.guia.findUnique({
      where: { id: Number(id) },
      include: { usuario: { select: { nombre: true, email: true } } }
    });

    if (!guia) {
      return res.status(404).json({ error: 'Guía no encontrado' });
    }

    res.json({
      id: guia.id,
      nombre: guia.usuario.nombre,
      email: guia.usuario.email,
      telefono: guia.telefono,
      modalidades: guia.modalidades,
      embarcacion: guia.embarcacion,
      servicios: guia.servicios,
      precioBase: guia.precioBase,
      precioFull: guia.precioFull,
      capacidadMax: guia.capacidadMax
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el guía' });
  }
};

// 3. POST - Registrar un nuevo guía
const registrarGuia = async (req, res) => {
  try {
    const { 
      nombre, email, telefono, modalidades, embarcacion, 
      servicios, precioBase, precioFull, capacidadMax 
    } = req.body;

    const emailGuia = email || `guia_${Date.now()}@pesca.com`;

    const nuevoUsuarioGuia = await prisma.usuario.create({
      data: {
        nombre,
        email: emailGuia,
        password: "123",
        rol: "GUIA",
        guia: {
          create: {
            telefono,
            modalidades,
            embarcacion,
            servicios,
            precioBase: Number(precioBase),
            precioFull: precioFull ? Number(precioFull) : null,
            capacidadMax: capacidadMax ? Number(capacidadMax) : 3,
          }
        }
      },
      include: { guia: true }
    });

    res.status(201).json(nuevoUsuarioGuia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el guía' });
  }
};

// 4. PUT - Actualizar un guía existente
const actualizarGuia = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, telefono, modalidades, embarcacion, 
      servicios, precioBase, precioFull, capacidadMax 
    } = req.body;

    const guiaActual = await prisma.guia.findUnique({ where: { id: Number(id) } });

    if (!guiaActual) {
      return res.status(404).json({ error: 'Guía no encontrado' });
    }

    // Actualiza el nombre en la tabla Usuario asociada
    if (nombre) {
      await prisma.usuario.update({
        where: { id: guiaActual.usuarioId },
        data: { nombre }
      });
    }

    // Actualiza los campos de la tabla Guia
    const guiaActualizado = await prisma.guia.update({
      where: { id: Number(id) },
      data: {
        telefono,
        modalidades,
        embarcacion,
        servicios,
        precioBase: precioBase ? Number(precioBase) : undefined,
        precioFull: precioFull ? Number(precioFull) : null,
        capacidadMax: capacidadMax ? Number(capacidadMax) : undefined,
      },
      include: { usuario: true }
    });

    res.json(guiaActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el guía' });
  }
};

// 5. DELETE - Eliminar un guía
const eliminarGuia = async (req, res) => {
  try {
    const { id } = req.params;
    const guia = await prisma.guia.findUnique({ where: { id: Number(id) } });

    if (guia) {
      // Al borrar el Usuario, la DB elimina automáticamente el Guía por onDelete: Cascade
      await prisma.usuario.delete({ where: { id: guia.usuarioId } });
    }

    res.json({ mensaje: 'Guía eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el guía' });
  }
};

module.exports = {
  obtenerGuias,
  obtenerGuiaPorId,
  registrarGuia,
  actualizarGuia,
  eliminarGuia
};