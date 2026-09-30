document.addEventListener('DOMContentLoaded', () => {
  const formReserva = document.getElementById('form-reserva');

  if (formReserva) {
    formReserva.addEventListener('submit', async (e) => {
      e.preventDefault();

      const userString = localStorage.getItem('usuario');
      const usuario = userString ? JSON.parse(userString) : { id: 1 };

      const payload = {
        guiaId: Number(document.getElementById('reserva-guia').value),
        clienteId: usuario.id || 1, 
        fechaExcursion: document.getElementById('reserva-fecha').value,
        cantPersonas: Number(document.getElementById('reserva-personas').value),
        tipoServicio: document.getElementById('reserva-servicio').value,
        precioTotal: Number(document.getElementById('reserva-precio').value)
      };

      try {
        const res = await fetch('/api/reservas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          alert('¡Reserva creada con éxito!');
          formReserva.reset();
          cargarReservas();
        } else {
          const data = await res.json();
          alert('Error: ' + (data.error || 'No se pudo registrar la reserva'));
        }
      } catch (err) {
        alert('Error de red al intentar crear la reserva');
      }
    });
  }
});

async function cargarSelectGuias() {
  const select = document.getElementById('reserva-guia');
  if (!select) return;

  try {
    const res = await fetch('/api/guias');
    const guias = await res.json();

    if (!Array.isArray(guias) || guias.length === 0) {
      select.innerHTML = '<option value="">No hay guías disponibles</option>';
      return;
    }

    select.innerHTML = '<option value="">-- Seleccioná un guía --</option>' + 
      guias.map(g => `<option value="${g.id}">${g.nombre} (Base: $${g.precioBase})</option>`).join('');
  } catch (err) {
    select.innerHTML = '<option value="">Error al cargar guías</option>';
  }
}

async function cargarReservas() {
  const tbody = document.getElementById('tabla-reservas');
  if (!tbody) return;

  const userString = localStorage.getItem('usuario');
  const usuario = userString ? JSON.parse(userString) : null;

  try {
    const res = await fetch('/api/reservas');
    let reservas = await res.json();

    if (!Array.isArray(reservas) || reservas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No hay reservas registradas.</td></tr>';
      return;
    }

    // Si es GUÍA, filtramos para que solo vea las reservas asignadas a su ID de guía o usuario
    if (usuario && usuario.rol === 'GUIA') {
      reservas = reservas.filter(r => r.guia && (r.guia.usuarioId === usuario.id || r.guiaId === usuario.id));
    }

    if (reservas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No tenés salidas asignadas por el momento.</td></tr>';
      return;
    }

    tbody.innerHTML = reservas.map(r => `
      <tr>
        <td><strong>#${r.id}</strong></td>
        <td>${new Date(r.fechaExcursion).toLocaleString()}</td>
        <td>${r.guia ? r.guia.nombre : 'Guía #' + r.guiaId}</td>
        <td>${r.cantPersonas} personas</td>
        <td><span style="background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-size: 0.85rem;">${r.tipoServicio}</span></td>
        <td><strong>$${r.precioTotal.toLocaleString()}</strong></td>
        <td><span style="color: var(--success); font-weight: 600; font-size: 0.85rem;"><i class="fa-solid fa-circle-check"></i> ${r.estado || 'CONFIRMADA'}</span></td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--danger);">Error al cargar las reservas.</td></tr>';
  }
}