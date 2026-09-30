document.addEventListener('DOMContentLoaded', () => {
  const userString = localStorage.getItem('usuario');
  if (!userString) {
    window.location.href = 'index.html'; // Si no hay sesión, al login
    return;
  }

  const usuario = JSON.parse(userString);
  
  // Mostrar datos del usuario en la barra superior si existe el elemento
  const statusBar = document.getElementById('user-status-bar');
  if (statusBar) {
    statusBar.innerHTML = `
      <span style="background: #eff6ff; color: #2563eb; padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
        <i class="fa-solid fa-user"></i> ${usuario.nombre} (Cliente)
      </span>
      <button id="btn-logout" class="btn btn-danger" style="padding: 6px 12px; font-size: 0.85rem;">Salir</button>
    `;
    document.getElementById('btn-logout').addEventListener('click', () => {
      localStorage.removeItem('usuario');
      window.location.href = 'index.html';
    });
  }

  // Cargar catálogos iniciales
  cargarGuiasCliente();
  cargarMisReservas(usuario.id);

  // Manejar envío del formulario de reserva desde el modal
  const formReserva = document.getElementById('form-reserva');
  if (formReserva) {
    formReserva.addEventListener('submit', async (e) => {
      e.preventDefault();
      const guiaId = document.getElementById('reserva-guia-id').value;
      const fechaExcursion = document.getElementById('reserva-fecha').value;
      const cantPersonas = Number(document.getElementById('reserva-personas').value);
      const tipoServicio = document.getElementById('reserva-servicio').value;
      const precioBase = Number(document.getElementById('reserva-precio-base').value) || 0;
      
      const precioTotal = precioBase * cantPersonas;

      const payload = {
        clienteId: usuario.clienteId || usuario.id,
        guiaId: Number(guiaId),
        fechaExcursion,
        cantPersonas,
        tipoServicio,
        precioTotal
      };

      try {
        const res = await fetch('/api/reservas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          alert('¡Reserva creada con éxito!');
          cerrarModalReserva();
          cargarMisReservas(usuario.id);
        } else {
          const err = await res.json();
          alert('Error al reservar: ' + (err.error || 'Intente nuevamente'));
        }
      } catch (err) {
        alert('Error de conexión con el servidor');
      }
    });
  }
});

// Cargar guías en el panel de cliente
async function cargarGuiasCliente() {
  const container = document.getElementById('grid-guias-cliente');
  if (!container) return;

  try {
    const res = await fetch('/api/guias');
    const guias = await res.json();

    if (!Array.isArray(guias) || guias.length === 0) {
      container.innerHTML = '<p style="color: #64748b; grid-column: 1/-1;">No hay guías disponibles en este momento.</p>';
      return;
    }

    container.innerHTML = guias.map(g => `
      <div class="card" style="margin: 0; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid #e2e8f0;">
        <div>
          <h3 style="margin: 0 0 10px 0; font-size: 1.1rem; color: #2563eb;"><i class="fa-solid fa-user-ninja"></i> ${g.nombre}</h3>
          <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 5px;"><i class="fa-solid fa-phone"></i> ${g.telefono || 'Sin teléfono'}</p>
          <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 5px;"><i class="fa-solid fa-ship"></i> ${g.embarcacion || 'Estándar'}</p>
          <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 12px;"><i class="fa-solid fa-fish"></i> ${g.modalidades || 'Todas'}</p>
        </div>
        <div>
          <div style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 12px;">
            $${g.precioBase ? g.precioBase.toLocaleString() : 0} <span style="font-size: 0.75rem; font-weight: normal; color: #64748b;">por pers.</span>
          </div>
          <button class="btn" style="width: 100%; padding: 8px; font-size: 0.85rem;" onclick='abrirModalReserva(${g.id}, "${g.nombre}", ${g.precioBase || 0})'>
            <i class="fa-solid fa-calendar-check"></i> Reservar con este Guía
          </button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p style="color: #ef4444; grid-column: 1/-1;">Error al cargar el catálogo de guías.</p>';
  }
}

// Funciones para el modal de reserva
function abrirModalReserva(guiaId, guiaNombre, precioBase) {
  const tituloModal = document.getElementById('modal-reserva-titulo');
  if (tituloModal) {
    tituloModal.innerHTML = `<i class="fa-solid fa-calendar-plus"></i> Reservar con ${guiaNombre}`;
  }
  document.getElementById('reserva-guia-id').value = guiaId;
  document.getElementById('reserva-precio-base').value = precioBase;
  
  const form = document.getElementById('form-reserva');
  if (form) form.reset();

  const modal = document.getElementById('modal-reserva');
  if (modal) modal.style.display = 'flex';
}

function cerrarModalReserva() {
  const modal = document.getElementById('modal-reserva');
  if (modal) modal.style.display = 'none';
}

// Cargar las reservas del usuario en la tabla
async function cargarMisReservas(usuarioId) {
  const tbody = document.getElementById('tabla-mis-reservas');
  if (!tbody) return;

  try {
    const res = await fetch('/api/reservas');
    const reservas = await res.json();

    if (!Array.isArray(reservas) || reservas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #64748b;">No tenés reservas registradas todavía.</td></tr>';
      return;
    }

    tbody.innerHTML = reservas.map(r => `
      <tr>
        <td><strong>#${r.id}</strong></td>
        <td>${r.guiaNombre || (r.guia ? r.guia.nombre : 'Guía #' + r.guiaId)}</td>
        <td>${new Date(r.fechaExcursion).toLocaleDateString()}</td>
        <td>${r.cantPersonas}</td>
        <td>${r.tipoServicio}</td>
        <td><span style="background: #fef3c7; color: #d97706; padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 0.85rem;">${r.estado}</span></td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #ef4444;">Error al cargar tus reservas</td></tr>';
  }
}