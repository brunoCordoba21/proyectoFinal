const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
const rutasGuias = require('./routes/guia.routes');
const rutasReservas = require('./routes/reserva.routes');

app.use('/api/guias', rutasGuias);
app.use('/api/reservas', rutasReservas); // <--- NUEVA RUTA REGISTRADA

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});