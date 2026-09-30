document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.content-section');
  const statusBar = document.getElementById('user-status-bar');
  const navbar = document.getElementById('main-navbar');
  const dynamicMenu = document.getElementById('dynamic-menu');

  const userString = localStorage.getItem('usuario');
  
  if (!userString) {
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById('sec-login').classList.add('active');
    if (navbar) navbar.style.display = 'none';
    return;
  }

  const usuario = JSON.parse(userString);
  document.getElementById('sec-login').classList.remove('active');
  if (navbar) navbar.style.display = 'flex';

  // --- CONFIGURACIÓN DE MENÚ SEGÚN ROL ---
  let menuHTML = '';
  if (usuario.rol === 'ADMIN') {
    menuHTML = `
      <a class="nav-btn active" data-target="sec-catalogo"><i class="fa-solid fa-anchor"></i> Guías</a>
      <a class="nav-btn" data-target="sec-reservas"><i class="fa-solid fa-calendar-plus"></i> Reservar</a>
      <a class="nav-btn" data-target="sec-dashboard"><i class="fa-solid fa-chart-line"></i> Panel Total</a>
    `;
  } else if (usuario.rol === 'GUIA') {
    menuHTML = `
      <a class="nav-btn active" data-target="sec-dashboard"><i class="fa-solid fa-clipboard-list"></i> Mis Salidas Asignadas</a>
    `;
  } else { // CLIENTE por defecto
    menuHTML = `
      <a class="nav-btn active" data-target="sec-catalogo"><i class="fa-solid fa-anchor"></i> Ver Guías</a>
      <a class="nav-btn" data-target="sec-reservas"><i class="fa-solid fa-calendar-plus"></i> Reservar Excursión</a>
    `;
  }
  dynamicMenu.innerHTML = menuHTML;

  // Barra de estado de usuario y logout
  if (statusBar) {
    statusBar.innerHTML = `
      <span style="background: #eff6ff; color: var(--primary); padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
        <i class="fa-solid fa-user-shield"></i> ${usuario.nombre} (${usuario.rol})
      </span>
      <button id="btn-logout" class="btn btn-danger" style="padding: 6px 12px; font-size: 0.85rem;">Salir</button>
    `;
    document.getElementById('btn-logout').addEventListener('click', () => {
      localStorage.removeItem('usuario');
      window.location.reload();
    });
  }

  // Configuración de visibilidad del panel según rol
  const adminUsersPanel = document.getElementById('admin-users-panel');
  const dashTitle = document.getElementById('dashboard-title');
  const dashSubtitle = document.getElementById('dashboard-subtitle');

  if (usuario.rol === 'ADMIN') {
    if (adminUsersPanel) adminUsersPanel.style.display = 'block';
    if (dashTitle) dashTitle.textContent = 'Panel de Administración General 📊';
    if (dashSubtitle) dashSubtitle.textContent = 'Control absoluto de usuarios, guías y reservas del sistema.';
  } else if (usuario.rol === 'GUIA') {
    if (adminUsersPanel) adminUsersPanel.style.display = 'none';
    if (dashTitle) dashTitle.textContent = 'Panel del Guía 🧭';
    if (dashSubtitle) dashSubtitle.textContent = 'Aquí podés ver las fechas y excursiones en las que tenés que salir.';
  }

  // --- LÓGICA DE NAVEGACIÓN TABS ---
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');

      navBtns.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      const targetSec = document.getElementById(targetId);
      if (targetSec) targetSec.classList.add('active');

      // Cargar datos según la solapa
      if (targetId === 'sec-catalogo' && typeof cargarGuias === 'function') {
        cargarGuias();
      } else if (targetId === 'sec-reservas') {
        if (typeof cargarSelectGuias === 'function') cargarSelectGuias();
      } else if (targetId === 'sec-dashboard') {
        if (typeof cargarReservas === 'function') cargarReservas();
        if (usuario.rol === 'ADMIN' && typeof cargarUsuarios === 'function') cargarUsuarios();
      }
    });
  });

  // Vista por defecto al entrar
  if (usuario.rol === 'GUIA') {
    document.querySelector('[data-target="sec-dashboard"]').classList.add('active');
    document.getElementById('sec-dashboard').classList.add('active');
    if (typeof cargarReservas === 'function') cargarReservas();
  } else {
    document.querySelector('[data-target="sec-catalogo"]').classList.add('active');
    document.getElementById('sec-catalogo').classList.add('active');
    if (typeof cargarGuias === 'function') cargarGuias();
  }
});