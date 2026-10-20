---
name: sdd
description: Úsala siempre que trabajes con Spec-Driven Development para redactar, revisar o cambiar specs, planes y tareas, o implementar y validar tareas de una spec.
---

# Spec-Driven Development (SDD)

Código e identificadores en inglés; textos de interfaz, comentarios y documentos en español.

## Flujo y quién escribe qué

Constitución → grill-me → Spec → Plan y tareas → Implementación → Cambio.

| Fase           | Quién                                           | Escribe solo                             |
| :------------- | :---------------------------------------------- | :--------------------------------------- |
| Decisiones     | skill `grill-me` (`/grill-me`)                  | `specs/NNN-nombre/decisiones.md`         |
| Spec           | agente/skill `sdd-spec` (`/sdd-spec`)           | `specs/NNN-nombre/spec.md`               |
| Plan y tareas  | agente/skill `sdd-plan` (`/sdd-plan`)           | `specs/NNN-nombre/plan.md` y `tasks.md`  |
| Implementación | agente/skill `sdd-implement` (`/sdd-implement`) | código, pruebas y la casilla de la tarea |

- Nunca pases a la siguiente fase sin la aprobación explícita del usuario. Solo el usuario cambia una spec de `borrador` a `aprobada`.
- La spec manda: si algo no está en la spec, no se implementa (constitución, principio 2).
- Si falta una decisión: al redactar la spec, márcala `[NECESITA ACLARACIÓN]`; al planificar o implementar, para y pregunta.
- Un cambio de requisitos se hace primero en la spec, luego en el plan y las tareas, y por último en el código.
- Cada spec vive en `specs/NNN-nombre/`. `decisiones.md` lo genera `grill-me`; solo se le añade al final, numerada, una decisión que dicte el usuario para resolver una duda abierta.
- Al terminar una fase o tarea, actualiza en `MEMORY.md` solo "Estado actual" y "Próximos pasos" (indicando el siguiente agente/comando). No copies decisiones ni contenido de la spec. Unas 50 líneas en total.
- No se hace commit.

## Marcas de aprobación

Además de las decisiones de producto o de diseño que falten, márcalas `[NECESITA ACLARACIÓN]` y avisa al usuario cuando haga falta:

- Una dependencia nueva.
- Un archivo fuera de las carpetas definidas en la estructura del proyecto.
- Un cambio en el formato de los datos guardados en almacenamiento local.

## Plantilla de spec (spec.md)

# Spec NNN — <Nombre>

Estado: borrador | aprobada | implementada
HU de origen: docs/historias/HU-00N.md

## Contexto y objetivo

## Usuarios

## Historias de usuario

## Definiciones (solo si hay términos que puedan interpretarse de varias formas)

## Requisitos funcionales

## Requisitos no funcionales

## Casos límite

## Fuera de alcance

## Criterios de finalización

## Dudas abiertas

- [NECESITA ACLARACIÓN] <duda>

La spec describe el QUÉ y el POR QUÉ. Nada de stack, arquitectura, capas, formatos de almacenamiento ni nombres de archivos o carpetas. Un RF por comportamiento visible.

Los RF respetan los principios de la constitución que se traducen en comportamiento visible para el estudiante: funciona sin conexión, sin cuentas y sin publicidad; el tiempo es exacto con el celular bloqueado o la app cerrada; la sesión activa y los tiempos personalizados se conservan; las acciones destructivas piden confirmación explícita.

## Requisitos en EARS (en español)

- RF-x: CUANDO <evento>, EL SISTEMA <respuesta>.
- RF-x: SI <condición no deseada>, ENTONCES EL SISTEMA <respuesta>.
- RF-x: MIENTRAS <estado>, EL SISTEMA <respuesta>.
- RF-x: EL SISTEMA <comportamiento permanente>.

Cada RF debe ser verificable y terminar con "Origen:", indicando el escenario de la HU o la decisión de `decisiones.md` de la que sale. Cada escenario de la HU debe quedar cubierto por al menos un RF.

## Revisión final de la spec

Al terminar `spec.md`, lista sin proponer soluciones: contradicciones entre RF, escenarios de la HU sin RF y conflictos con los principios de `docs/constitution.md`. Máximo 10 puntos.

## Plan (plan.md)

Se organiza por capa (constitución, principio 3):

- **Archivos y responsabilidades:** los que se crean o modifican, agrupados por Capa 1 y Capa 2.
- **Capa 1** (`src/types/`, `src/utils/`, `src/storage/`, `src/services/`, `src/context/`): tipos y contratos; funciones puras (ciclo Pomodoro, validación de rangos, formateo `MM:SS`, tiempo restante con `endTimestamp - Date.now()`); persistencia; notificaciones, sonido y vibración; orquestación en contexto. Sin componentes visuales ni colores.
- **Capa 2** (`src/constants/`, `src/components/`, `src/app/`): cómo se pinta en la interfaz. Sin llamadas directas a `AsyncStorage` ni `expo-notifications`, ni cálculos de timestamps.
- **Algoritmo en pseudocódigo:** el conteo nunca depende solo de `setInterval` (principio 5).
- **Datos del estudiante:** qué se persiste, cuándo se restaura y qué acciones piden confirmación (principio 7).
- **Decisiones justificadas** con su alternativa descartada. Las de `decisiones.md` se citan por número.
- **Estrategia de pruebas:** qué se prueba con Jest en `__tests__/` junto a cada módulo de Capa 1 y qué se verifica a mano.
- Indica qué RF cubre cada parte.

## Tareas (tasks.md)

- [ ] **Tn. <Descripción>.** RF-x, RF-y
  - Hecho cuando: <comprobación verificable>.

Máximo 20-30 min por tarea, en orden de dependencia. Si salen más de 10, propón dividir la spec.

- Las tareas de Capa 1 empiezan por escribir la prueba y se verifican con `npx jest` y `npx tsc --noEmit`.
- Las tareas de interfaz, alarmas y segundo plano se verifican con la lista manual de `rn-conventions` en dispositivo/APK. Si tocan colores o estilos, también con `cotopaxi-brand`.

## Implementación

Una sola tarea cada vez:

1. Pruebas primero (en rojo) en `__tests__/`, solo en Capa 1.
2. Código hasta que pasen, siguiendo `plan.md` y las skills `pomodoro-rules`, `rn-conventions` y `cotopaxi-brand` cuando correspondan.
3. `npx jest` y `npx tsc --noEmit` en verde. Prohibido avanzar con pruebas en rojo o errores de tipos.
4. Revisión de fronteras: ningún archivo de Capa 1 importa componentes visuales ni colores; ningún archivo de Capa 2 llama a `AsyncStorage` ni `expo-notifications`, ni calcula timestamps. Si hay que cruzar la frontera, para y pregunta.
5. Marcar la tarea y parar.

Si la tarea toca la interfaz, bloqueo de pantalla o notificaciones, no ejecutes la app: entrega la lista manual de verificación y espera a que el usuario confirme que la probó en el dispositivo antes de marcarla como hecha. Si toca acciones destructivas (reiniciar o restablecer), verifica que pidan confirmación explícita.

No instales dependencias ni ejecutes `npx expo start` sin que el usuario lo pida.

Al cerrar la tarea, lista qué escenarios de la HU quedan cubiertos por pruebas y cuáles no. Informa; no declares que algo "está correcto".
