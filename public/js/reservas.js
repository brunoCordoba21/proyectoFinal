let mesCalendario = new Date().getMonth();
let anioCalendario = new Date().getFullYear();
let fechasOcupadas = [];
let guiaSeleccionado = null;

// Inicializa la página y configura los eventos principales
document.addEventListener('DOMContentLoaded', () => {
  const userString = localStorage.getItem('usuario');
  if (!userString) {
    window.location.href = 'index.html';
    return;
  }

  const usuario = JSON.parse(userString);

  // Muestra el usuario y configura el cierre de sesión
  const statusBar = document.getElementById('user-status-bar');
  if (statusBar) {
    statusBar.innerHTML = `
      <span style="background:#eff6ff;color:#2563eb;padding:6px 12px;border-radius:20px;font-size:.85rem;font-weight:600;">
        <i class="fa-solid fa-user"></i>
        ${usuario.nombre} (Cliente)
      </span>
      <button id="btn-logout" class="btn btn-danger" style="padding:6px 12px;font-size:.85rem;">
        Salir
      </button>
    `;

    document.getElementById('btn-logout').addEventListener('click', () => {
      localStorage.removeItem('usuario');
      window.location.href = 'index.html';
    });
  }

  cargarGuiasCliente();
  cargarMisReservas(usuario.clienteId);

  // Cambia al mes anterior
  const btnAnterior = document.getElementById('btn-mes-anterior');
  if (btnAnterior) {
    btnAnterior.addEventListener('click', () => {
      mesCalendario--;
      if (mesCalendario < 0) {
        mesCalendario = 11;
        anioCalendario--;
      }
      renderizarCalendario();
    });
  }

  // Cambia al mes siguiente
  const btnSiguiente = document.getElementById('btn-mes-siguiente');
  if (btnSiguiente) {
    btnSiguiente.addEventListener('click', () => {
      mesCalendario++;
      if (mesCalendario > 11) {
        mesCalendario = 0;
        anioCalendario++;
      }
      renderizarCalendario();
    });
  }

  // Envía una nueva reserva al backend
  const formReserva = document.getElementById('form-reserva');
  if (formReserva) {
    formReserva.addEventListener('submit', async (e) => {
      e.preventDefault();

      const guiaId = document.getElementById('reserva-guia-id').value;
      const fechaExcursion = document.getElementById('reserva-fecha').value;
      const cantPersonas = Number(document.getElementById('reserva-personas').value);
      const tipoServicio = document.getElementById('reserva-servicio').value;
      const precioBase = Number(document.getElementById('reserva-precio-base').value) || 0;

      // Verifica que se haya seleccionado una fecha
      if (!fechaExcursion) {
        alert('Seleccioná una fecha para la excursión.');
        return;
      }

      const precioTotal = precioBase * cantPersonas;

      const payload = {
        clienteId: usuario.clienteId,
        guiaId: Number(guiaId),
        fechaExcursion,
        cantPersonas,
        tipoServicio,
        precioTotal
      };

      try {
        const res = await fetch('/api/reservas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          alert('¡Reserva creada con éxito!');
          cerrarModalReserva();
          cargarMisReservas(usuario.clienteId);
        } else {
          const err = await res.json();
          alert('Error al reservar: ' + (err.error || 'Intente nuevamente'));
        }
      } catch (err) {
        console.error(err);
        alert('Error de conexión con el servidor');
      }
    });
  }
});

// Carga los guías disponibles desde el backend
async function cargarGuiasCliente() {
  const grid = document.getElementById('grid-guias-cliente');
  if (!grid) return;

  try {
    const res = await fetch('/api/guias');
    const guias = await res.json();

    grid.innerHTML = guias.map(g => `
      <div class="guia-card">
        <div class="guia-icono">
          <i class="fa-solid fa-fish"></i>
        </div>
        <h4 class="guia-nombre">${g.nombre}</h4>
        <div class="guia-dato">
          <i class="fa-solid fa-phone"></i>
          <span>${g.telefono || 'Teléfono no informado'}</span>
        </div>
        <div class="guia-dato">
          <i class="fa-solid fa-fish-fins"></i>
          <span>${g.modalidades || 'Modalidad no informada'}</span>
        </div>
        <div class="guia-dato">
          <i class="fa-solid fa-ship"></i>
          <span>${g.embarcacion || 'Embarcación no informada'}</span>
        </div>
        <div class="guia-precio">
          <i class="fa-solid fa-dollar-sign"></i>
          <span>Desde $${g.precioBase}</span>
        </div>
        <button class="btn" onclick="abrirModalReserva(${g.id}, '${g.nombre}', ${g.precioBase})">
          <i class="fa-solid fa-calendar-plus"></i>
          Reservar excursión
        </button>
      </div>
    `).join('');
  } catch (error) {
    console.error(error);
    grid.innerHTML = `
      <p style="color:red;">
        Error al cargar los guías.
      </p>
    `;
  }
}

// Abre el modal y prepara el calendario del guía seleccionado
async function abrirModalReserva(guiaId, guiaNombre, precioBase) {
  guiaSeleccionado = guiaId;

  document.getElementById('modal-reserva-titulo').innerHTML = `
    <i class="fa-solid fa-calendar-plus"></i>
    Reservar con ${guiaNombre}
  `;

  document.getElementById('form-reserva').reset();
  document.getElementById('reserva-guia-id').value = guiaId;
  document.getElementById('reserva-precio-base').value = precioBase;
  document.getElementById('reserva-fecha').value = '';
  document.getElementById('fecha-seleccionada').textContent = 'Seleccioná una fecha.';

  const ahora = new Date();
  mesCalendario = ahora.getMonth();
  anioCalendario = ahora.getFullYear();

  await cargarFechasOcupadas(guiaId);
  renderizarCalendario();

  document.getElementById('modal-reserva').style.display = 'flex';
}

// Cierra el modal de reserva
function cerrarModalReserva() {
  document.getElementById('modal-reserva').style.display = 'none';
}

// Obtiene las fechas ocupadas por un guía
async function cargarFechasOcupadas(guiaId) {
  try {
    const res = await fetch(`/api/reservas/guia/${guiaId}/fechas`);

    if (!res.ok) {
      throw new Error('No se pudieron obtener las fechas');
    }

    const reservas = await res.json();

    fechasOcupadas = reservas.map(r => {
      const fecha = new Date(r.fechaExcursion);
      return formatearFecha(fecha);
    });

    console.log('Fechas ocupadas:', fechasOcupadas);
  } catch (error) {
    console.error(error);
    fechasOcupadas = [];
  }
}

// Genera el calendario y marca las fechas ocupadas
function renderizarCalendario() {
  const contenedor = document.getElementById('dias-calendario');
  const titulo = document.getElementById('mes-actual');
  if (!contenedor || !titulo) return;

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  titulo.textContent = `${nombresMeses[mesCalendario]} ${anioCalendario}`;
  contenedor.innerHTML = '';

  const primerDia = new Date(anioCalendario, mesCalendario, 1);
  let diaSemana = primerDia.getDay();

  // Ajusta el calendario para comenzar el lunes
  diaSemana = diaSemana === 0 ? 6 : diaSemana - 1;

  for (let i = 0; i < diaSemana; i++) {
    contenedor.appendChild(document.createElement('div'));
  }

  const cantidadDias = new Date(anioCalendario, mesCalendario + 1, 0).getDate();

  for (let dia = 1; dia <= cantidadDias; dia++) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = dia;
    boton.style.padding = '8px';
    boton.style.border = '1px solid #ddd';
    boton.style.borderRadius = '6px';
    boton.style.cursor = 'pointer';
    boton.style.background = 'white';

    const fecha = `${anioCalendario}-${String(mesCalendario + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    // Deshabilita los días que ya tienen una reserva
    if (fechasOcupadas.includes(fecha)) {
      boton.disabled = true;
      boton.textContent = `${dia} ✕`;
      boton.style.background = '#fee2e2';
      boton.style.color = '#dc2626';
      boton.style.cursor = 'not-allowed';
    } else {
      boton.addEventListener('click', () => {
        document.getElementById('reserva-fecha').value = fecha;
        document.getElementById('fecha-seleccionada').textContent =
          `Fecha seleccionada: ${dia}/${mesCalendario + 1}/${anioCalendario}`;

        document.querySelectorAll('#dias-calendario button').forEach(b => {
          if (!b.disabled) {
            b.style.background = 'white';
            b.style.color = 'black';
          }
        });

        boton.style.background = '#2563eb';
        boton.style.color = 'white';
      });
    }

    contenedor.appendChild(boton);
  }
}

// Convierte una fecha al formato YYYY-MM-DD
function formatearFecha(fecha) {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

// Carga las reservas pertenecientes al cliente
async function cargarMisReservas(clienteId) {
  const tbody = document.getElementById('tabla-mis-reservas');
  if (!tbody) return;

  try {
    const res = await fetch(`/api/reservas/cliente/${clienteId}`);

    if (!res.ok) {
      throw new Error('Error al obtener reservas');
    }

    const reservas = await res.json();

    if (reservas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;color:var(--text-muted);">
            <i class="fa-solid fa-calendar-xmark" style="margin-right:6px;color:#94a3b8;"></i>
            No tenés reservas todavía.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = reservas.map(r => `
      <tr>
        <td><strong>#${r.id}</strong></td>
        <td>
          <div class="reserva-guia">
            <i class="fa-solid fa-user-tie"></i>
            ${r.guiaNombre}
          </div>
        </td>
        <td>
          <div class="reserva-fecha">
            <i class="fa-regular fa-calendar"></i>
            ${new Date(r.fechaExcursion).toLocaleDateString('es-AR')}
          </div>
        </td>
        <td>
          <div class="reserva-personas">
            <i class="fa-solid fa-users"></i>
            ${r.cantPersonas}
          </div>
        </td>
        <td>
          <div class="reserva-servicio">
            <i class="fa-solid fa-fish"></i>
            ${r.tipoServicio}
          </div>
        </td>
        <td>${crearBadgeEstado(r.estado)}</td>
      </tr>
    `).join('');
  } catch (error) {
    console.error(error);

    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;color:red;">
          <i class="fa-solid fa-triangle-exclamation"></i>
          Error al cargar tus reservas.
        </td>
      </tr>
    `;
  }
}

// Crea el indicador visual según el estado de la reserva
function crearBadgeEstado(estado) {
  const estadoNormalizado = String(estado || '').trim().toUpperCase();

  switch (estadoNormalizado) {
    case 'PENDIENTE':
      return `
        <span class="estado-badge estado-pendiente">
          <i class="fa-solid fa-clock"></i>
          Pendiente
        </span>
      `;
    case 'CONFIRMADA':
      return `
        <span class="estado-badge estado-confirmada">
          <i class="fa-solid fa-circle-check"></i>
          Confirmada
        </span>
      `;
    case 'CANCELADA':
      return `
        <span class="estado-badge estado-cancelada">
          <i class="fa-solid fa-circle-xmark"></i>
          Cancelada
        </span>
      `;
    case 'FINALIZADA':
      return `
        <span class="estado-badge estado-finalizada">
          <i class="fa-solid fa-flag-checkered"></i>
          Finalizada
        </span>
      `;
    default:
      return `
        <span class="estado-badge estado-default">
          <i class="fa-solid fa-circle-info"></i>
          ${estado || 'Sin estado'}
        </span>
      `;
  }
}