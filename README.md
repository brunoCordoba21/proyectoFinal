# 🎣 Sistema de Reservas para Guías de Pesca

Sistema web destinado a facilitar la **gestión y realización de reservas de excursiones de pesca**.

El proyecto busca centralizar la información relacionada con clientes, guías, servicios, fechas, horarios y reservas, permitiendo una organización más sencilla y evitando problemas como la superposición de reservas.

---

## 👥 Integrantes

| Integrante         | Rol        |
| ------------------ | ---------- |
| **Bruno Córdoba**  | Desarrollo |
| **Brenda Córdoba** | Desarrollo |

### 📸 Equipo

<p align="center">
  <img src="docs/img/bruno-cordoba.jpg" width="200">
  <img src="docs/img/brenda-cordoba.jpg" width="200">
</p>

<p align="center">
  <b>Bruno Córdoba</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Brenda Córdoba</b>
</p>

---

## 📌 Justificación del proyecto

El proyecto surge a partir de la necesidad de contar con una herramienta que permita gestionar de manera organizada las reservas de excursiones de pesca.

La utilización de medios informales para coordinar reservas puede dificultar el control de fechas, horarios, clientes y disponibilidad de los guías.

Por este motivo, se propone desarrollar un sistema web que centralice la información relacionada con las reservas, permitiendo a los clientes consultar los servicios disponibles y realizar una reserva, mientras que los guías y administradores podrán gestionar la información necesaria para organizar las excursiones.

El proyecto se encuentra enfocado en resolver específicamente la problemática de **gestión y organización de reservas**, manteniendo un alcance adecuado para el tiempo disponible de desarrollo.

---

## 🎯 Objetivos del proyecto

### Objetivo general

Desarrollar un sistema web que permita gestionar las reservas de excursiones de pesca, facilitando a los clientes la realización de reservas y a los guías y administradores la gestión de los servicios, horarios y reservas.

### Objetivos específicos

* Permitir que los usuarios se registren e inicien sesión.
* Permitir a los clientes consultar los servicios disponibles.
* Permitir consultar fechas y horarios disponibles.
* Permitir realizar una reserva.
* Permitir consultar y cancelar reservas.
* Permitir a los guías consultar sus reservas.
* Permitir a los guías consultar sus horarios y servicios asignados.
* Permitir administrar clientes.
* Permitir administrar guías.
* Permitir administrar servicios, fechas y horarios disponibles.
* Evitar que dos clientes puedan reservar el mismo horario.
* Permitir consultar y gestionar las reservas realizadas.
* Almacenar la información del sistema en una base de datos.

---

## 📋 Alcance y limitaciones

### Alcance

El sistema estará orientado exclusivamente a la **gestión de reservas de excursiones de pesca**.

El sistema contará con diferentes tipos de usuarios y permisos.

### 👤 Cliente

El cliente podrá:

* Registrarse e iniciar sesión.
* Consultar los servicios disponibles.
* Visualizar fechas y horarios disponibles.
* Realizar reservas.
* Consultar sus reservas.
* Cancelar reservas.

### 🎣 Guía

Cada guía contará con un panel propio desde el cual podrá:

* Iniciar sesión.
* Consultar sus reservas.
* Visualizar las fechas y horarios de sus excursiones.
* Consultar la información necesaria de los clientes asociados a sus reservas.
* Gestionar el estado de sus reservas.

### 🛠️ Administrador

El administrador podrá:

* Gestionar clientes.
* Gestionar guías.
* Gestionar servicios.
* Gestionar fechas y horarios.
* Consultar y gestionar todas las reservas.
* Administrar la información general del sistema.

### 🚫 Limitaciones

Para mantener un alcance adecuado al tiempo disponible para el desarrollo, el proyecto no incluirá funcionalidades relacionadas con:

* Registro de especies capturadas.
* Registro de cantidad o peso de capturas.
* Estadísticas de pesca.
* Mapas o seguimiento GPS.
* Información meteorológica.
* Pagos en línea.
* Sistema de calificaciones o reseñas.
* Aplicación móvil.
* Gestión avanzada de embarcaciones o equipamiento.

---

## 🏗️ Arquitectura del sistema

El sistema estará organizado en tres componentes principales:

```text
                         🎣 SISTEMA DE RESERVAS
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
        👤 CLIENTE            🎣 GUÍA            🛠️ ADMIN
              │                   │                   │
              ▼                   ▼                   ▼
       ┌────────────┐      ┌────────────┐      ┌────────────┐
       │  PANEL     │      │  PANEL     │      │  PANEL     │
       │  CLIENTE   │      │  GUÍA      │      │  ADMIN     │
       └─────┬──────┘      └─────┬──────┘      └─────┬──────┘
             │                   │                   │
             └───────────────────┼───────────────────┘
                                 ▼
                       ┌─────────────────┐
                       │   BACKEND / API │
                       │                 │
                       │ Autenticación   │
                       │ Clientes        │
                       │ Guías           │
                       │ Servicios       │
                       │ Reservas        │
                       │ Disponibilidad  │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │    DATABASE     │
                       │                 │
                       │ Usuarios        │
                       │ Guías           │
                       │ Servicios       │
                       │ Horarios        │
                       │ Reservas        │
                       └─────────────────┘
```

### Frontend

Se encargará de las interfaces con las que interactuarán los diferentes usuarios:

* Panel del cliente.
* Panel del guía.
* Panel del administrador.
* Formularios.
* Consulta de servicios.
* Gestión de reservas.

### Backend / API

Contendrá la lógica del sistema y será responsable de:

* Autenticación de usuarios.
* Gestión de clientes.
* Gestión de guías.
* Gestión de servicios.
* Gestión de horarios.
* Gestión de reservas.
* Control de disponibilidad.
* Validaciones del sistema.

### Base de datos

Almacenará la información correspondiente a:

* Usuarios.
* Clientes.
* Guías.
* Servicios.
* Horarios.
* Reservas.

---

## 📦 Entregables

Al finalizar el proyecto se entregará:

* Sistema web funcional de reservas.
* Panel para clientes.
* Panel para guías.
* Panel de administración.
* Sistema de autenticación.
* Módulo de gestión de clientes.
* Módulo de gestión de guías.
* Módulo de gestión de servicios y horarios.
* Módulo de gestión de reservas.
* Base de datos del sistema.
* Backend/API.
* Documentación del proyecto.
* Manual básico de usuario.
* Código fuente del sistema.

---
# 🎣 Sistema de Gestión de Guías y Reservas de Pesca ("Pesca Las Termas")

Aplicación web Full-Stack desarrollada como proyecto de tesis para la gestión centralizada de guías de pesca deportiva y agendamiento de reservas en Las Termas de Río Hondo (Santiago del Estero).

## 🚀 Tecnologías Utilizadas
* **Backend:** Node.js, Express.js (REST API).
* **Base de Datos:** MySQL.
* **ORM:** Prisma ORM.
* **Frontend:** HTML5, CSS3 (Responsive Grid/Flexbox), JavaScript Vanilla (DOM / Fetch API).

## ⚙️ Reglas de Negocio Implementadas
1. **Control de Capacidad:** Validación en servidor para asegurar que la cantidad de pasajeros no supere el límite máximo de la embarcación del guía.
2. **Disponibilidad de Agenda:** Bloqueo automático para evitar que un guía sea reservado por duplicado en una misma fecha.
3. **Cálculo Tarifario:** Asignación automática de tarifas según el tipo de servicio contratado (Base o Full).

## 📅 Estado del proyecto

🚧 **En desarrollo**

---

### 🎣 Sistema de Reservas para Guías de Pesca

**Proyecto académico**

**Integrantes:** Bruno Córdoba & Brenda Córdoba
