const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const obtenerGuias = async (req, res) => {
  try {
    const guias = await prisma.guia.findMany({
      include: { usuario: true }
    });

    const guiasFormateados = guias.map(g => ({
      id: g.id,
      nombre: g.usuario ? g.usuario.nombre : 'Sin nombre',
      email: g.usuario ? g.usuario.email : 'Sin email',
      telefono: g.telefono || '',
      modalidades: g.modalidades || '',
      embarcacion: g.embarcacion || '',
      servicios: g.servicios || '',
      precioBase: g.precioBase || 0,
      precioFull: g.precioFull || 0,
      capacidadMax: g.capacidadMax || 3
    }));

    res.json(guiasFormateados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener guías' });
  }
};

const crearGuia = async (req, res) => {
  try {
    const { nombre, email, password, telefono, embarcacion, modalidades, precioBase } = req.body;

    const nuevoGuia = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          nombre,
          email,
          password: password || '123456',
          rol: 'GUIA'
        }
      });

      const guia = await tx.guia.create({
        data: {
          telefono: telefono || '',
          modalidades: modalidades || '',
          embarcacion: embarcacion || '',
          precioBase: Number(precioBase) || 0,
          usuarioId: usuario.id
        }
      });

      return { ...guia, usuario };
    });

    res.status(201).json(nuevoGuia);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'No se pudo crear el guía (el email ya podría estar registrado).' });
  }
};

const actualizarGuia = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, embarcacion, modalidades, precioBase } = req.body;
    const guiaId = Number(id);

    const guiaActual = await prisma.guia.findUnique({ where: { id: guiaId } });
    if (!guiaActual) return res.status(404).json({ error: 'Guía no encontrado' });

    await prisma.$transaction(async (tx) => {
      if (nombre || email) {
        await tx.usuario.update({
          where: { id: guiaActual.usuarioId },
          data: {
            ...(nombre && { nombre }),
            ...(email && { email })
          }
        });
      }

      await tx.guia.update({
        where: { id: guiaId },
        data: {
          ...(telefono !== undefined && { telefono }),
          ...(modalidades !== undefined && { modalidades }),
          ...(embarcacion !== undefined && { embarcacion }),
          ...(precioBase !== undefined && { precioBase: Number(precioBase) })
        }
      });
    });

    res.json({ mensaje: 'Actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al actualizar el guía' });
  }
};

const eliminarGuia = async (req, res) => {
  try {
    const { id } = req.params;
    const guiaId = Number(id);

    const guia = await prisma.guia.findUnique({ where: { id: guiaId } });
    if (!guia) return res.status(404).json({ error: 'Guía no encontrado' });

    await prisma.usuario.delete({
      where: { id: guia.usuarioId }
    });

    res.json({ mensaje: 'Eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'No se pudo eliminar' });
  }
};

module.exports = { 
  obtenerGuias, 
  crearGuia, 
  actualizarGuia, 
  eliminarGuia 
};