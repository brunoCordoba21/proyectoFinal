document.addEventListener('DOMContentLoaded', () => {
  const formGuia = document.getElementById('form-guia');
  if (formGuia) {
    formGuia.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const id = document.getElementById('guia-id').value;
      const payload = {
        nombre: document.getElementById('guia-nombre').value,
        email: document.getElementById('guia-email').value,
        password: document.getElementById('guia-password').value || '123456',
        telefono: document.getElementById('guia-telefono').value,
        embarcacion: document.getElementById('guia-embarcacion').value,
        modalidades: document.getElementById('guia-modalidades').value,
        precioBase: Number(document.getElementById('guia-precio').value)
      };

      const url = id ? `/api/guias/${id}` : '/api/guias';
      const method = id ? 'PUT' : 'POST';

      try {
        const res = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          alert(id ? '¡Guía actualizado con éxito!' : '¡Guía creado con éxito!');
          cerrarModalGuia();
          cargarGuias();
          if (typeof cargarUsuarios === 'function') cargarUsuarios();
        } else {
          const err = await res.json();
          alert('Error: ' + (err.error || 'No se pudo guardar'));
        }
      } catch (e) {
        alert('Error de conexión con el servidor');
      }
    });
  }
});

async function cargarGuias() {
  const container = document.getElementById('grid-guias');
  if (!container) return;

  const userString = localStorage.getItem('usuario');
  const usuario = userString ? JSON.parse(userString) : null;
  const esAdmin = usuario && usuario.rol === 'ADMIN';

  try {
    const res = await fetch('/api/guias');
    const guias = await res.json();

    if (!Array.isArray(guias) || guias.length === 0) {
      container.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1;">No hay guías registrados actualmente.</p>';
      return;
    }

    container.innerHTML = guias.map(g => `
      <div class="card" style="margin: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <h3 style="margin: 0; font-size: 1.1rem; color: var(--primary);"><i class="fa-solid fa-user-ninja"></i> ${g.nombre}</h3>
            <span style="font-size: 0.8rem; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-weight: 600; color: var(--text-muted);">#${g.id}</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px;"><i class="fa-solid fa-envelope" style="width: 16px;"></i> ${g.email || 'Sin email'}</p>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px;"><i class="fa-solid fa-phone" style="width: 16px;"></i> ${g.telefono || 'Sin teléfono'}</p>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px;"><i class="fa-solid fa-ship" style="width: 16px;"></i> ${g.embarcacion || 'Estándar'}</p>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;"><i class="fa-solid fa-fish" style="width: 16px;"></i> ${g.modalidades || 'Todas'}</p>
        </div>
        
        <div>
          <div style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 14px;">
            $${g.precioBase ? g.precioBase.toLocaleString() : 0} <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">base</span>
          </div>
          
          ${esAdmin ? `
            <div style="display: flex; gap: 8px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
              <button class="btn" style="padding: 6px 10px; font-size: 0.8rem; flex: 1;" onclick='prepararEditarGuia(${JSON.stringify(g)})'>Editar</button>
              <button class="btn btn-danger" style="padding: 6px 10px; font-size: 0.8rem; flex: 1;" onclick="eliminarGuia(${g.id})">Eliminar</button>
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error("Error al cargar guías:", err);
    container.innerHTML = '<p style="color: var(--danger); grid-column: 1/-1;">Error al cargar los guías.</p>';
  }
}

function abrirModalGuia() {
  document.getElementById('modal-guia-titulo').innerHTML = '<i class="fa-solid fa-user-plus"></i> Registrar Guía';
  document.getElementById('form-guia').reset();
  document.getElementById('guia-id').value = '';
  document.getElementById('modal-guia').style.display = 'flex';
}

function prepararEditarGuia(g) {
  document.getElementById('modal-guia-titulo').innerHTML = `<i class="fa-solid fa-user-pen"></i> Editar Guía`;
  document.getElementById('guia-id').value = g.id;
  document.getElementById('guia-nombre').value = g.nombre || '';
  document.getElementById('guia-email').value = g.email || '';
  document.getElementById('guia-password').value = '';
  document.getElementById('guia-telefono').value = g.telefono || '';
  document.getElementById('guia-embarcacion').value = g.embarcacion || '';
  document.getElementById('guia-modalidades').value = g.modalidades || '';
  document.getElementById('guia-precio').value = g.precioBase || '';
  
  document.getElementById('modal-guia').style.display = 'flex';
}

function cerrarModalGuia() {
  document.getElementById('modal-guia').style.display = 'none';
}

async function eliminarGuia(id) {
  if (!confirm('¿Estás seguro de eliminar este guía?')) return;
  try {
    const res = await fetch(`/api/guias/${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('Guía eliminado correctamente');
      cargarGuias();
      if (typeof cargarUsuarios === 'function') cargarUsuarios();
    } else {
      alert('No se pudo eliminar el guía');
    }
  } catch (err) {
    alert('Error de conexión');
  }
}