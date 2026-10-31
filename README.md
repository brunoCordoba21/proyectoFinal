# 🎣 Sistema de Reservas para Guías de Pesca

Sistema web destinado a facilitar la **gestión y realización de reservas de excursiones de pesca**.

El proyecto busca centralizar la información relacionada con clientes, guías, servicios, fechas, horarios y reservas, permitiendo una organización más sencilla y evitando problemas como la superposición de reservas.

---

## 👥 Integrantes

| Integrante | Rol |
|---|---|
| **Bruno Córdoba** | Desarrollo |
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

- Permitir que los usuarios se registren e inicien sesión.
- Permitir a los clientes consultar los servicios disponibles.
- Permitir consultar fechas y horarios disponibles.
- Permitir realizar una reserva.
- Permitir consultar y cancelar reservas.
- Permitir a los guías consultar sus reservas.
- Permitir a los guías consultar sus horarios y servicios asignados.
- Permitir administrar clientes.
- Permitir administrar guías.
- Permitir administrar servicios, fechas y horarios disponibles.
- Evitar que dos clientes puedan reservar el mismo horario.
- Permitir consultar y gestionar las reservas realizadas.
- Almacenar la información del sistema en una base de datos.

---

## 📋 Alcance y limitaciones

### Alcance

El sistema estará orientado exclusivamente a la **gestión de reservas de excursiones de pesca**.

El sistema contará con diferentes tipos de usuarios y permisos.

### 👤 Cliente

El cliente podrá:

- Registrarse e iniciar sesión.
- Consultar los servicios disponibles.
- Visualizar fechas y horarios disponibles.
- Realizar reservas.
- Consultar sus reservas.
- Cancelar reservas.

### 🎣 Guía

Cada guía contará con un panel propio desde el cual podrá:

- Iniciar sesión.
- Consultar sus reservas.
- Visualizar las fechas y horarios de sus excursiones.
- Consultar la información necesaria de los clientes asociados a sus reservas.
- Gestionar el estado de sus reservas.

### 🛠️ Administrador

El administrador podrá:

- Gestionar clientes.
- Gestionar guías.
- Gestionar servicios.
- Gestionar fechas y horarios.
- Consultar y gestionar todas las reservas.
- Administrar la información general del sistema.

### 🚫 Limitaciones

Para mantener un alcance adecuado al tiempo disponible para el desarrollo, el proyecto no incluirá funcionalidades relacionadas con:

- Registro de especies capturadas.
- Registro de cantidad o peso de capturas.
- Estadísticas de pesca.
- Mapas o seguimiento GPS.
- Información meteorológica.
- Pagos en línea.
- Sistema de calificaciones o reseñas.
- Aplicación móvil.
- Gestión avanzada de embarcaciones o equipamiento.

---

## 🏗️ Arquitectura del sistema

El sistema estará organizado en tres componentes principales:

```text
                    🎣 SISTEMA DE RESERVAS
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
          CLIENTE            GUÍA             ADMIN
             │                │                │
             ▼                ▼                ▼
        PANEL CLIENTE    PANEL GUÍA      PANEL ADMIN
             │                │                │
             └────────────────┼────────────────┘
                              ▼
                       BACKEND / API
                              │
                              ▼
                         BASE DE DATOS
                            MySQL
```

### Frontend

Se encargará de las interfaces con las que interactuarán los diferentes usuarios:

- Panel del cliente.
- Panel del guía.
- Panel del administrador.
- Formularios.
- Consulta de servicios.
- Gestión de reservas.

### Backend / API

Contendrá la lógica del sistema y será responsable de:

- Autenticación de usuarios.
- Gestión de clientes.
- Gestión de guías.
- Gestión de servicios.
- Gestión de horarios.
- Gestión de reservas.
- Control de disponibilidad.
- Validaciones del sistema.

### Base de datos

Almacenará la información correspondiente a:

- Usuarios.
- Guías.
- Clientes.
- Servicios.
- Horarios.
- Reservas.

---

## 🧱 Arquitectura en capas y organización del código

Actualmente, el proyecto utiliza Node.js y Express para desarrollar la API, organizando el código principalmente mediante rutas y controladores.

La estructura actual permite separar las solicitudes HTTP de las operaciones que realiza el sistema.

### Estructura actual

```text
02-ProyectoFinal/
│
├── controllers/
│   ├── cliente.controller.js
│   ├── guia.controller.js
│   ├── reserva.controller.js
│   └── usuario.controller.js
│
├── routes/
│   ├── cliente.routes.js
│   ├── guia.routes.js
│   ├── reserva.routes.js
│   └── usuario.routes.js
│
├── prisma/
│
├── public/
│   ├── css/
│   ├── js/
│   └── index.html
│
└── index.js
```

### Responsabilidad de cada componente

| Componente | Responsabilidad |
|---|---|
| Routes | Definir los endpoints y asociarlos con sus controladores. |
| Controllers | Recibir las solicitudes, ejecutar las operaciones correspondientes y devolver respuestas HTTP. |
| Prisma ORM | Facilitar las consultas y operaciones sobre la base de datos. |
| MySQL | Almacenar la información del sistema. |
| Public | Contener los archivos del frontend. |

### Propuesta de arquitectura en capas

Como parte de la evolución del proyecto, se propone incorporar una arquitectura en capas utilizando los patrones **Service y Repository**.

El objetivo es separar las responsabilidades y evitar que los controladores concentren toda la lógica del sistema.

La estructura propuesta sería:

```text
routes/
    reserva.routes.js

controllers/
    reserva.controller.js

services/
    reserva.service.js

repositories/
    reserva.repository.js

prisma/
    schema.prisma
```

El funcionamiento sería el siguiente:

1. **Routes:** recibe y dirige las solicitudes.
2. **Controller:** procesa la solicitud HTTP y se comunica con el servicio.
3. **Service:** contiene las reglas de negocio y las validaciones correspondientes.
4. **Repository:** se encarga del acceso y las operaciones sobre los datos.
5. **Prisma:** permite interactuar con MySQL.

### Ejemplo de implementación propuesta

Los siguientes fragmentos son ejemplos ilustrativos de cómo se podría organizar el código al incorporar estos patrones. No representan una implementación actualmente finalizada.

**Controller – reserva.controller.js**

```javascript
const reservaService = require('../services/reserva.service');

const crearReserva = async (req, res) => {
    try {
        const reserva = await reservaService.crear(req.body);

        res.status(201).json(reserva);

    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};

module.exports = {
    crearReserva
};
```

**Service – reserva.service.js**

```javascript
const reservaRepository = require('../repositories/reserva.repository');

const crear = async (datos) => {

    // Aquí se aplican las reglas de negocio.
    // Por ejemplo: verificar disponibilidad,
    // capacidad del guía y condiciones del servicio.

    const reserva = await reservaRepository.crear(datos);

    return reserva;
};

module.exports = {
    crear
};
```

**Repository – reserva.repository.js**

```javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const crear = async (datos) => {

    return await prisma.reserva.create({
        data: datos
    });
};

module.exports = {
    crear
};
```

De esta manera, cada componente tiene una responsabilidad específica, facilitando el mantenimiento, las modificaciones y las futuras ampliaciones del sistema.

---

## 🧩 Patrones de diseño

Los patrones de diseño permiten organizar el código mediante soluciones conocidas a problemas habituales del desarrollo de software.

En este proyecto se contempla la incorporación de los siguientes patrones:

### Patrón MVC (Modelo - Vista - Controlador)

El proyecto utiliza una organización inspirada en MVC, separando las interfaces del frontend, los controladores y el acceso a los datos.

- **Modelo:** representa y gestiona la información almacenada en la base de datos mediante Prisma.
- **Vista:** corresponde a las interfaces HTML, CSS y JavaScript.
- **Controlador:** recibe las solicitudes y coordina las operaciones correspondientes.

### Patrón Service

Se propone incorporar una capa de servicios para centralizar las reglas de negocio.

Por ejemplo, al realizar una reserva, el servicio será responsable de verificar la disponibilidad del guía, controlar la capacidad de pasajeros y determinar la tarifa correspondiente.

### Patrón Repository

Se propone incorporar una capa Repository para centralizar las operaciones de acceso a la base de datos.

Esto permitirá evitar que los controladores o servicios dependan directamente de las consultas de Prisma, facilitando futuras modificaciones y pruebas.

**Estado:** MVC como organización conceptual del proyecto; Service y Repository se encuentran contemplados como mejoras de arquitectura pendientes de implementación.

---

## 🧹 Código limpio (Clean Code)

El desarrollo busca mantener buenas prácticas de programación que permitan obtener un código legible, organizado y fácil de mantener.

Se consideran los siguientes principios:

- **Nombres descriptivos:** utilizar nombres claros para variables, funciones y archivos.
- **Separación de responsabilidades:** evitar que una misma función realice demasiadas tareas.
- **Reutilización:** evitar repetir código cuando una operación puede centralizarse.
- **Funciones simples:** procurar que cada función tenga una responsabilidad concreta.
- **Manejo de errores:** controlar las excepciones y devolver respuestas adecuadas.
- **Organización:** mantener separados los controladores, rutas, servicios y acceso a datos.

La aplicación progresiva de estos criterios busca facilitar el trabajo en equipo y permitir que el sistema pueda ampliarse sin generar complejidad innecesaria.

---

## 🚀 Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Node.js | Entorno de ejecución del backend. |
| Express.js | Desarrollo de la API REST. |
| MySQL | Base de datos relacional. |
| Prisma ORM | Comunicación con la base de datos. |
| HTML5 | Estructura del frontend. |
| CSS3 | Diseño y estilos. |
| JavaScript | Lógica e interacción del frontend. |

---

## ⚙️ Reglas de negocio implementadas

1. **Control de capacidad:** validación en servidor para asegurar que la cantidad de pasajeros no supere el límite máximo de la embarcación del guía.
2. **Disponibilidad de agenda:** control para evitar que un guía sea reservado por duplicado en una misma fecha.
3. **Cálculo tarifario:** asignación de tarifas según el tipo de servicio contratado (Base o Full).

Estas reglas forman parte de la lógica del sistema y actualmente se encuentran desarrolladas en los archivos correspondientes del backend. Se contempla su futura organización dentro de la capa de servicios.

---

## 📦 Entregables

Al finalizar el proyecto se entregará:

- Sistema web funcional de reservas.
- Panel para clientes.
- Panel para guías.
- Panel de administración.
- Sistema de autenticación.
- Módulo de gestión de clientes.
- Módulo de gestión de guías.
- Módulo de gestión de servicios y horarios.
- Módulo de gestión de reservas.
- Base de datos del sistema.
- Backend/API.
- Documentación del proyecto.
- Manual básico de usuario.
- Código fuente del sistema.

---

## 📅 Estado del proyecto

🚧 **En desarrollo**

**Proyecto académico – Trabajo final de carrera**

**Integrantes:** Bruno Córdoba y Brenda Córdoba.
