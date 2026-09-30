const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. GET - Obtener todos los guías
const obtenerGuias = async (req, res) => {
  try {
    const guias = await prisma.guia.findMany();
    res.json(guias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener guías' });
  }
};

// 2. GET BY ID - Obtener un solo guía por ID
const obtenerGuiaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const guia = await prisma.guia.findUnique({
      where: { id: Number(id) }
    });

    if (!guia) {
      return res.status(404).json({ error: 'Guía no encontrado' });
    }

    res.json(guia);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el guía' });
  }
};

// 3. POST - Registrar un nuevo guía
const registrarGuia = async (req, res) => {
  try {
    const { 
      nombre, telefono, modalidades, embarcacion, 
      servicios, precioBase, precioFull, capacidadMax 
    } = req.body;

    const nuevoGuia = await prisma.guia.create({
      data: {
        nombre,
        telefono,
        modalidades,
        embarcacion,
        servicios,
        precioBase: Number(precioBase),
        precioFull: precioFull ? Number(precioFull) : null,
        capacidadMax: capacidadMax ? Number(capacidadMax) : 3,
      },
    });

    res.status(201).json(nuevoGuia);
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

    const guiaActualizado = await prisma.guia.update({
      where: { id: Number(id) },
      data: {
        nombre,
        telefono,
        modalidades,
        embarcacion,
        servicios,
        precioBase: precioBase ? Number(precioBase) : undefined,
        precioFull: precioFull ? Number(precioFull) : null,
        capacidadMax: capacidadMax ? Number(capacidadMax) : undefined,
      },
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
    await prisma.guia.delete({
      where: { id: Number(id) }
    });

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