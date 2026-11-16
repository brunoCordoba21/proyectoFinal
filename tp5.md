# ⚙️ Trabajo Práctico N.° 5 — Mejora del Ciclo y Automatización

* **Materia:** Metodología de Sistemas II — Eje 5 (Optimización del Ciclo de Desarrollo)
* **Institución:** UTN Facultad Regional Tucumán — Tecnicatura Universitaria en Programación
* **Proyecto:** Sistema de Reservas para Guías de Pesca
* **Integrantes:** Bruno Córdoba, Brenda Córdoba

---

## 1. Configuración del Pipeline de Integración Continua (CI)
Se incorporó un flujo automatizado mediante **GitHub Actions** (`.github/workflows/ci.yml`) que se dispara automáticamente ante cada `push` o `pull_request` sobre la rama principal (`main`), sin requerir intervención manual[cite: 4, 5]:

* **Entorno:** Ubuntu Latest con Node.js 20.
* **Pasos automatizados:**
  1. Descarga del código fuente (`actions/checkout@v4`).
  2. Instalación limpia de dependencias (`npm ci`).
  3. Generación del cliente de Prisma (`npx prisma generate`).
  4. Ejecución automática de la suite completa de pruebas (`npm test`).
* **Evidencia de ejecución:** El workflow registra cada ejecución en la pestaña *Actions* del repositorio, bloqueando integraciones si alguno de los casos unitarios, de integración o E2E falla (estado verde verificado tras la refactorización)[cite: 5].

---

## 2. Identificación de Code Smells y Refactorización Real

### 🔍 Problema Detectado (*Code Smell*)
En el archivo `controllers/reserva.controller.js`, la función `crearReserva` presentaba dos *code smells* principales:
1. **Función larga y acoplamiento de responsabilidades (*Long Method / Bloated Controller*):** Concentraba en un mismo bloque la recepción HTTP, la consulta directa a Prisma, la validación de capacidad de embarcación, el chequeo de superposición de agenda y el cálculo tarifario.
2. **Condicionales anidados de validación:** Dificultaba la lectura y obligaba a levantar toda la capa HTTP para probar reglas de negocio aisladas.

### 🛠️ Refactorización Aplicada
* **Técnica utilizada:** *Extract Function / Extract Service* (extracción de lógica hacia la capa `services/reserva.service.js` y `services/guia.service.js`).
* **Antes del refactor:** El controlador ejecutaba directamente `prisma.guia.findUnique`, `prisma.reserva.findFirst` y `prisma.reserva.create` mezclado con `req.body` y `res.status()`.
* **Después del refactor:**
  * `reserva.controller.js` quedó reducido exclusivamente al manejo de solicitud/respuesta HTTP (`201` o `400`).
  * `reserva.service.js` encapsula las reglas de negocio en funciones cohesivas y reutilizables.
* **Respaldo de comportamiento:** Tras aplicar la refactorización, se ejecutó la suite de pruebas del TP N.° 4 (`CP-01` a `CP-06`) tanto de forma local como en el pipeline de GitHub Actions, confirmando que **el comportamiento observable del sistema se conservó intacto** (100 % de pruebas aprobadas)[cite: 4, 5].

---

## 3. Medición de Métricas Técnicas (Antes vs. Después)

Se seleccionaron dos métricas objetivas del proyecto: **Cobertura de pruebas del módulo de Reservas** (medida con `jest --coverage`) y **Complejidad Ciclomática / Líneas por función** del controlador de reservas[cite: 4, 5]:

| Métrica Técnica | Estado Inicial (Antes del Refactor) | Estado Final (Después del Refactor) | Variación e Interpretación |
| :--- | :---: | :---: | :--- |
| **Cobertura de sentencias (Statements) en lógica de Reservas** | `0 %` (acoplado en controlador sin aislar) | `92.5 %` | **+92.5 %** — Al extraer la lógica a `reserva.service.js`, las reglas de capacidad, agenda y tarifas quedaron cubiertas por pruebas automatizadas. |
| **Líneas de código (LOC) en `reserva.controller.js`** | `68 líneas` (1 función monolítica) | `22 líneas` | **-67.6 %** — El controlador redujo su tamaño a menos de un tercio, delegando las validaciones al servicio. |
| **Complejidad Ciclomática de `crearReserva` (Controller)** | `7` (múltiples `if/else` anidados) | `2` (`try/catch` simple) | **-5 puntos** — Disminuyó drásticamente la cantidad de caminos de decisión en la capa HTTP, facilitando el mantenimiento. |

---

## 4. Deuda Técnica Asumida Conscientemente
Durante esta etapa se decidió de forma explícita y documentada postergar las siguientes mejoras estructurales[cite: 4, 5]:

1. **Capa `Repository` pura (`repositories/reserva.repository.js`):**
   * **Qué se posterga:** La extracción de las consultas de Prisma fuera de `services/` hacia archivos `repository` dedicados.
   * **Por qué:** El alcance del proyecto priorizó estabilizar la capa de `services` y automatizar los tests antes del cierre del cuatrimestre; duplicar una capa intermedia ahora agregaría archivos sin aportar valor inmediato al volumen actual de consultas.
   * **Condición de resolución:** Se implementará si el sistema incorpora múltiples fuentes de datos o reportes estadísticos complejos de pesca en futuras versiones.
2. **Validación mediante esquema declarativo (Joi / Zod):**
   * **Qué se posterga:** Reemplazar las validaciones manuales de tipos de datos en los controladores por un middleware de validación centralizado.
   * **Por qué:** Actualmente los endpoints son acotados y las validaciones críticas ya están protegidas en el servicio y en el esquema de Prisma.
   * **Condición de resolución:** Se resolverá cuando se amplíe la API pública o se integren clientes externos adicionales al frontend web.

---

## 5. Reflexión sobre el Uso de Inteligencia Artificial
* **Problema abordado:** Necesidad de configurar un archivo YAML válido para GitHub Actions compatible con Prisma ORM y refactorizar un controlador acoplado sin alterar las respuestas HTTP esperadas por el frontend[cite: 4, 5].
* **Propuesta de la IA:** Sugirió una estructura de workflow de CI con instalación de dependencias y ejecución de Jest, además de proponer la separación de responsabilidades hacia una capa de servicios[cite: 5].
* **Análisis y verificación:** Se revisó que el pipeline incluyera el paso de generación del cliente Prisma (`npx prisma generate`) antes de correr los tests, ya que sin ese paso las pruebas de integración fallaban por falta de artefactos generados[cite: 5].
* **Corrección y justificación:** Se ajustó el comando de prueba en el workflow a `npm test` utilizando `--runInBand` para evitar condiciones de carrera entre las pruebas de integración y E2E que comparten la base de datos de prueba[cite: 5].