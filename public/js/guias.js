const API_URL = '/api/guias';

// 1. GET - Obtener todos los guías
async function cargarGuias() {
  try {
    const res = await fetch(API_URL);
    const guias = await res.json();
    const contenedor = document.getElementById('listaGuias');
    contenedor.innerHTML = '';

    if (guias.length === 0) {
      contenedor.innerHTML = '<p>No hay guías registrados aún.</p>';
      return;
    }

    guias.forEach(g => {
      contenedor.innerHTML += `
        <div class="card">
          <div>
            <h3>${g.nombre}</h3>
            <p><strong>Teléfono:</strong> ${g.telefono}</p>
            <p><strong>Embarcación:</strong> ${g.embarcacion}</p>
            <p><strong>Capacidad:</strong> ${g.capacidadMax} personas</p>
            <p><strong>Modalidades:</strong> ${g.modalidades}</p>
            <p><strong>Servicios:</strong> ${g.servicios || 'Ninguno'}</p>
            <p><strong>Precio Base:</strong> $${g.precioBase}</p>
            <p><strong>Precio Full:</strong> ${g.precioFull ? '$' + g.precioFull : 'N/A'}</p>
          </div>
          
          <div class="card-actions">
            <button class="btn-edit" onclick='prepararEdicion(${JSON.stringify(g)})'>Editar</button>
            <button class="btn-delete" onclick="eliminarGuia(${g.id})">Eliminar</button>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error('Error al cargar guías:', error);
  }
}

// 2. POST / PUT - Guardar cambios
document.getElementById('formGuia').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('guiaId').value;
  const datosGuia = {
    nombre: document.getElementById('nombre').value,
    telefono: document.getElementById('telefono').value,
    modalidades: document.getElementById('modalidades').value,
    embarcacion: document.getElementById('embarcacion').value,
    servicios: document.getElementById('servicios').value,
    precioBase: document.getElementById('precioBase').value,
    precioFull: document.getElementById('precioFull').value,
    capacidadMax: document.getElementById('capacidadMax').value,
  };

  const metodo = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;

  await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosGuia)
  });

  cancelarEdicion();
  cargarGuias();
});

// 3. Pasar datos al formulario para editar
function prepararEdicion(guia) {
  document.getElementById('guiaId').value = guia.id;
  document.getElementById('nombre').value = guia.nombre;
  document.getElementById('telefono').value = guia.telefono;
  document.getElementById('modalidades').value = guia.modalidades;
  document.getElementById('embarcacion').value = guia.embarcacion;
  document.getElementById('servicios').value = guia.servicios || '';
  document.getElementById('precioBase').value = guia.precioBase;
  document.getElementById('precioFull').value = guia.precioFull || '';
  document.getElementById('capacidadMax').value = guia.capacidadMax;

  document.getElementById('formTitulo').innerText = 'Editar Guía';
  document.getElementById('btnGuardar').innerText = 'Guardar Cambios';
  document.getElementById('btnCancelar').style.display = 'block';
}

// Resetear el formulario
function cancelarEdicion() {
  document.getElementById('formGuia').reset();
  document.getElementById('guiaId').value = '';
  document.getElementById('formTitulo').innerText = 'Registrar Nuevo Guía';
  document.getElementById('btnGuardar').innerText = 'Guardar Guía';
  document.getElementById('btnCancelar').style.display = 'none';
}

// 4. DELETE - Eliminar un guía
async function eliminarGuia(id) {
  if (confirm('¿Estás seguro de que querés eliminar este guía?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    cargarGuias();
  }
}

// Cargar lista al inicio
cargarGuias();