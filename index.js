const express = require('express');
const cors = require('cors');

// Importar rutas
const usuarioRoutes = require('./routes/usuario.routes');
const guiaRoutes = require('./routes/guia.routes');
const reservaRoutes = require('./routes/reserva.routes');
const clienteRoutes = require('./routes/cliente.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Endpoints API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/guias', guiaRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/clientes', clienteRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});