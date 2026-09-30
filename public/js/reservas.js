const API_RESERVAS_URL = '/api/reservas';
const API_GUIAS_URL = '/api/guias';

// 1. Cargar la lista desplegable de Guías en el formulario de reservas
async function cargarSelectGuias() {
  try {
    const res = await fetch(API_GUIAS_URL);
    const guias = await res.json();
    const select = document.getElementById('guiaSelect');
    
    select.innerHTML = '<option value="">-- Seleccionar Guía --</option>';
    guias.forEach(g => {
      select.innerHTML += `<option value="${g.id}">${g.nombre} (Cap. máx: ${g.capacidadMax} pers.)</option>`;
    });
  } catch (error) {
    console.error('Error al cargar la lista de guías:', error);
  }
}

// 2. GET - Cargar todas las reservas guardadas
async function cargarReservas() {
  try {
    const res = await fetch(API_RESERVAS_URL);
    const reservas = await res.json();
    const contenedor = document.getElementById('listaReservas');
    contenedor.innerHTML = '';

    if (reservas.length === 0) {
      contenedor.innerHTML = '<p>No hay reservas registradas aún.</p>';
      return;
    }

    reservas.forEach(r => {
      // Formatear la fecha a formato local
      const fecha = new Date(r.fechaExcursion).toLocaleDateString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC'
      });

      // Definir clase del badge según el estado
      let claseEstado = 'badge-pendiente';
      if (r.estado === 'CONFIRMADA') claseEstado = 'badge-confirmada';
      if (r.estado === 'CANCELADA') claseEstado = 'badge-cancelada';

      contenedor.innerHTML += `
        <div class="card card-reserva">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h3>Reserva #${r.id}</h3>
              <span class="badge ${claseEstado}">${r.estado}</span>
            </div>
            <p><strong>Cliente:</strong> ${r.clienteNombre}</p>
            <p><strong>Teléfono:</strong> ${r.clienteTelefono}</p>
            <p><strong>Guía Asignado:</strong> ${r.guia ? r.guia.nombre : 'Guía N/A'}</p>
            <p><strong>Fecha Salida:</strong> ${fecha}</p>
            <p><strong>Personas:</strong> ${r.cantPersonas}</p>
            <p><strong>Servicio:</strong> ${r.tipoServicio}</p>
            <p><strong>Precio Total:</strong> $${r.precioTotal}</p>
          </div>
          
          <div class="card-actions" style="flex-wrap: wrap;">
            ${r.estado !== 'CONFIRMADA' ? `<button class="btn-state btn-confirm" onclick="cambiarEstadoReserva(${r.id}, 'CONFIRMADA')">Confirmar</button>` : ''}
            ${r.estado !== 'CANCELADA' ? `<button class="btn-state btn-cancel-state" onclick="cambiarEstadoReserva(${r.id}, 'CANCELADA')">Cancelar</button>` : ''}
            <button class="btn-delete" onclick="eliminarReserva(${r.id})">Eliminar</button>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error('Error al cargar reservas:', error);
  }
}

// 3. POST - Guardar una nueva reserva
document.getElementById('formReserva').addEventListener('submit', async (e) => {
  e.preventDefault();

  const datosReserva = {
    clienteNombre: document.getElementById('clienteNombre').value,
    clienteTelefono: document.getElementById('clienteTelefono').value,
    guiaId: document.getElementById('guiaSelect').value,
    fechaExcursion: document.getElementById('fechaExcursion').value,
    cantPersonas: document.getElementById('cantPersonas').value,
    tipoServicio: document.getElementById('tipoServicio').value,
  };

  const res = await fetch(API_RESERVAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosReserva)
  });

  const respuesta = await res.json();

  if (!res.ok) {
    alert(`⚠️ Error: ${respuesta.error}`);
    return;
  }

  document.getElementById('formReserva').reset();
  cargarReservas();
});

// 4. PUT - Cambiar estado (CONFIRMADA / CANCELADA)
async function cambiarEstadoReserva(id, nuevoEstado) {
  await fetch(`${API_RESERVAS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: nuevoEstado })
  });
  cargarReservas();
}

// 5. DELETE - Eliminar reserva
async function eliminarReserva(id) {
  if (confirm('¿Estás seguro de que querés eliminar esta reserva?')) {
    await fetch(`${API_RESERVAS_URL}/${id}`, { method: 'DELETE' });
    cargarReservas();
  }
}

// Inicializar datos al cargar la solapa
cargarSelectGuias();
cargarReservas();