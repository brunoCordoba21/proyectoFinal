# 🧪 Trabajo Práctico N.° 4 — Suite de Pruebas y Verificación del Producto

* **Materia:** Metodología de Sistemas II — Eje 4 (Verificación y Validación de Software)
* **Institución:** UTN Facultad Regional Tucumán — Tecnicatura Universitaria en Programación
* **Proyecto:** Sistema de Reservas para Guías de Pesca
* **Integrantes:** Bruno Córdoba, Brenda Córdoba

---

## 1. Propósito y Alcance de la Verificación
El presente documento consolida el diseño, ejecución y resultados de la suite de pruebas del **Sistema de Reservas para Guías de Pesca**, cubriendo los tres niveles trabajados (**Unitario**, **Integración** y **Funcional / E2E**).

Todas las pruebas son trazables a los requerimientos reales y reglas de negocio del módulo principal de **Gestión de Reservas**:
1. **Control de capacidad:** Validación en servidor para asegurar que la cantidad de pasajeros no supere el límite máximo de la embarcación del guía.
2. **Disponibilidad de agenda:** Control para evitar que un guía sea reservado por duplicado en una misma fecha.
3. **Cálculo tarifario:** Asignación automática de tarifas según el tipo de servicio contratado (`Base` o `Full`).

---

## 2. Diseño de Casos de Prueba (Trazabilidad a Requerimientos)

Tomando el requerimiento funcional **"Realizar una reserva de excursión de pesca"**, se diseñaron casos que cubren el camino esperado (*happy path*), un caso límite (*boundary*) y condiciones de error:

| ID | Caso de Prueba | Tipo de Escenario | Entrada / Precondiciones | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **CP-01** | Creación de reserva exitosa (Servicio Full) | Camino esperado (*Happy Path*) | Guía disponible con capacidad máx. 4 pasajeros. Cliente solicita reserva para 3 pasajeros en modalidad `Full`. | Reserva confirmada (HTTP `201`), tarifa calculada correctamente según modalidad `Full` y registro almacenado. |
| **CP-02** | Reserva con capacidad máxima exacta | Caso límite (*Boundary*) | Guía disponible con capacidad máx. 4 pasajeros. Cliente solicita reserva para exactamente **4 pasajeros** en modalidad `Base`. | Reserva confirmada (HTTP `201`), validando que el límite superior (`pasajeros == capacidadMax`) es aceptado. |
| **CP-03** | Rechazo por exceso de capacidad en embarcación | Condición de error | Guía con capacidad máx. 4 pasajeros. Cliente intenta reservar para **5 pasajeros**. | Operación rechazada (HTTP `400`) con mensaje *"La cantidad de pasajeros supera la capacidad máxima de la embarcación"*. |
| **CP-04** | Rechazo por superposición de fecha | Condición de error | Guía ya posee una reserva confirmada para la fecha `2026-12-15`. Otro cliente intenta reservar al mismo guía en la misma fecha. | Operación rechazada (HTTP `400`) con mensaje *"El guía no se encuentra disponible en la fecha seleccionada"*. |

---

## 3. Estrategia y Niveles de Prueba Implementados

### 🔹 Nivel 1: Pruebas Unitarias (`tests/unit/`)
* **Objetivo:** Verificar de forma aislada las reglas de negocio de creación de reservas (cálculo tarifario, validación de capacidad y control de disponibilidad).
* **Aislamiento:** Se utilizaron dobles de prueba (*mocks* y *stubs* con Jest) para simular las respuestas de la base de datos (Prisma ORM) y del módulo de Guías, garantizando independencia total de red y almacenamiento real.

### 🔹 Nivel 2: Pruebas de Integración (`tests/integration/`)
* **Objetivo:** Verificar la comunicación real entre el **Módulo de Reservas** y el **Módulo de Guías** interactuando con la base de datos MySQL a través de Prisma ORM.
* **Escenario probado (`CP-05`):** Se consulta la disponibilidad inicial de un guía, se persiste una nueva reserva desde el módulo de Reservas y se vuelve a consultar al módulo de Guías para confirmar que la fecha quedó efectivamente bloqueada.

### 🔹 Nivel 3: Pruebas Funcionales / E2E (`tests/e2e/`)
* **Objetivo:** Validar un flujo de uso real completo de punta a punta a través de las rutas HTTP de la API Express.
* **Escenario probado (`CP-06`):** Envío de solicitud `POST /api/reservas` para registrar una excursión, verificación posterior mediante `GET /api/reservas` de que la reserva figura en el listado del sistema, e intento de una segunda reserva sobre la misma fecha y guía comprobando el bloqueo ante duplicados.

---

## 4. Reporte de Verificación Técnica (Resultados)

| ID Caso | Nivel | Qué se probó | Estado | Observaciones y Correcciones Realizadas |
| :--- | :--- | :--- | :---: | :--- |
| **CP-01** | Unitario | Alta de reserva válida y cálculo tarifa `Full` | ✅ **PASÓ** | El cálculo tarifario y el retorno del objeto creado funcionaron según lo esperado. |
| **CP-02** | Unitario | Cupo límite exacto (`pasajeros == capacidadMax`) | ❌ **FALLÓ** $\rightarrow$ ✅ **CORREGIDO** | **Defecto detectado:** La condición original utilizaba `pasajeros >= capacidadMax`, rechazando erróneamente reservas que completaban el cupo exacto de la lancha. Se corrigió el operador a `pasajeros > capacidadMax`. |
| **CP-03** | Unitario | Exceso de pasajeros (`pasajeros > capacidadMax`) | ✅ **PASÓ** | Se detuvo la ejecución antes de intentar guardar en base de datos. |
| **CP-04** | Unitario | Bloqueo por fecha ocupada del guía | ✅ **PASÓ** | Ante una disponibilidad simulada en `false`, rechazó la reserva correctamente. |
| **CP-05** | Integración | Sincronización real entre Reservas y Guías en MySQL | ✅ **PASÓ** | El módulo de Guías reflejó inmediatamente la ocupación de la fecha tras persistir la reserva. |
| **CP-06** | Funcional / E2E | Flujo HTTP completo (Creación $\rightarrow$ Consulta $\rightarrow$ Rechazo duplicado) | ✅ **PASÓ** | Respuestas HTTP `201`, `200` y `400` validadas sobre los endpoints reales del servidor. |

---

## 5. Cobertura Pendiente
Para futuras iteraciones de desarrollo y pruebas quedan pendientes de cubrir:
* **Flujo de cancelación de reservas:** Verificar que al cancelar una reserva existente se libere automáticamente la fecha en la agenda del guía.
* **Restricción de fechas pasadas:** Agregar casos de prueba que validen el rechazo de reservas con fechas anteriores a la fecha actual del servidor.
* **Control de autorización por roles:** Validar mediante pruebas E2E que un usuario con rol `CLIENTE` no pueda acceder a rutas exclusivas de `GUIA` o `ADMIN`.

---

## 6. Reflexión sobre el Uso de Inteligencia Artificial
* **Qué se pidió:** Se solicitó asistencia para estructurar casos de prueba trazables (camino feliz, caso límite y condición de error) a partir de las reglas de negocio del proyecto, así como la organización de los niveles de prueba (unitario, integración y E2E) en formato Markdown.
* **Qué devolvió:** Generó una matriz de trazabilidad inicial, la división conceptual de los tres niveles de prueba y una estructura de reporte técnico adaptada a la arquitectura en capas (`Controller` / `Service` / `Prisma`).
* **Qué se corrigió y por qué:**
  1. Se desacopló la lógica de validación de reservas hacia la capa de servicios (`reserva.service.js`), ya que originalmente residía directamente en los controladores y dificultaba aislar las pruebas unitarias sin simular solicitudes HTTP.
  2. Se ajustaron los nombres de rutas (`/api/reservas`) y atributos del modelo (`capacidadMax`, `pasajeros`, `tipoServicio`) para reflejar fielmente el esquema real de Prisma del proyecto.
  3. Se corrigió la validación de capacidad máxima detectada gracias al diseño del caso límite (`CP-02`), reemplazando el operador `>=` por `>`.