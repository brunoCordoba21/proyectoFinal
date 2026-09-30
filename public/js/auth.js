document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('form-login');
  const loginMsg = document.getElementById('login-msg');
  const secLogin = document.getElementById('sec-login');
  const secDashboard = document.getElementById('sec-dashboard');
  const navbar = document.getElementById('main-navbar');
  const statusBar = document.getElementById('user-status-bar');

  const usuarioString = localStorage.getItem('usuario');

  if (usuarioString) {
    const usuario = JSON.parse(usuarioString);
    
    // Si es CLIENTE y está en el index o login, lo mandamos a su panel exclusivo
    if (usuario.rol === 'CLIENTE' && !window.location.href.includes('panelCliente.html')) {
      window.location.href = 'panelCliente.html';
      return;
    }

    if (secLogin) secLogin.style.display = 'none';
    if (secDashboard) secDashboard.style.display = 'block';
    if (navbar) navbar.style.display = 'flex';

    if (statusBar) {
      statusBar.innerHTML = `
        <span style="background: #eff6ff; color: var(--primary); padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
          <i class="fa-solid fa-shield-halved"></i> ${usuario.nombre} (${usuario.rol})
        </span>
        <button id="btn-logout" class="btn btn-danger" style="padding: 6px 12px; font-size: 0.85rem;">Salir</button>
      `;
      document.getElementById('btn-logout').addEventListener('click', () => {
        localStorage.removeItem('usuario');
        window.location.href = 'index.html';
      });
    }

    if (typeof cargarUsuarios === 'function') cargarUsuarios();
    if (typeof cargarGuias === 'function') cargarGuias();
  } else {
    if (secLogin) secLogin.style.display = 'block';
    if (secDashboard) secDashboard.style.display = 'none';
    if (navbar) navbar.style.display = 'none';
  }

  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        const res = await fetch('/api/usuarios/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
          const u = data.usuario || data;
          const usuarioData = {
            id: u.id,
            nombre: u.nombre,
            email: u.email,
            rol: u.rol || "CLIENTE",
            guiaId: u.guiaId || null,
            clienteId: u.clienteId || null
          };

          localStorage.setItem('usuario', JSON.stringify(usuarioData));

          // REDIRECCIÓN SEGÚN EL ROL AL INICIAR SESIÓN
          if (usuarioData.rol === 'CLIENTE') {
            window.location.href = 'panelCliente.html';
          } else {
            window.location.reload();
          }
        } else {
          loginMsg.style.color = 'var(--danger)';
          loginMsg.textContent = data.error || 'Credenciales inválidas';
        }
      } catch (err) {
        loginMsg.style.color = 'var(--danger)';
        loginMsg.textContent = 'Error de conexión con el servidor';
      }
    });
  }
});

async function cargarUsuarios() {
  const tbody = document.getElementById('tabla-usuarios');
  if (!tbody) return;

  try {
    const res = await fetch('/api/usuarios');
    const data = await res.json();
    
    if (!Array.isArray(data)) return;

    tbody.innerHTML = data.map(u => `
      <tr>
        <td><strong>#${u.id}</strong></td>
        <td>${u.nombre}</td>
        <td>${u.email}</td>
        <td><span style="background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 0.85rem; color: var(--primary);">${u.rol}</span></td>
        <td>${new Date(u.createdAt).toLocaleDateString()}</td>
      </tr>
    `).join('');
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--danger);">Error al cargar usuarios</td></tr>';
  }
}