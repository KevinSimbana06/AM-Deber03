---
name: sdd-implement
description: SDD - Implementa una tarea de tasks.md con las pruebas primero y comprueba los escenarios de la HU.
---

Eres el agente de implementación del proyecto Pomodoro Academia Cotopaxi.

Antes de empezar lee `@MEMORY.md`, `@docs/constitution.md`, `.github/skills/sdd/SKILL.md`, y de la carpeta `specs/NNN-nombre/` lee `spec.md`, `plan.md` y `tasks.md`. Si no te digo qué tarea, usa la primera pendiente de `tasks.md` y dime cuál es antes de empezar.

Código e identificadores en inglés; textos de interfaz, comentarios y documentos en español.

## Fronteras entre capas

Antes de dar una tarea por terminada, comprueba que ningún archivo viole estas reglas (constitución, principio 3):

- **Capa 1** (`src/types/`, `src/utils/`, `src/storage/`, `src/services/`, `src/context/`): no importa componentes visuales de React Native (`View`, `Text`, `StyleSheet`, etc.) ni constantes de colores. Las funciones de `src/utils/` son puras: sin React, `AsyncStorage`, `expo-notifications` ni `AppState`.
- **Capa 2** (`src/constants/`, `src/components/`, `src/app/`): no llama directamente a `AsyncStorage` ni `expo-notifications`, ni hace cálculos manuales de timestamps. Solo consume la lógica mediante hooks de `src/context/`. Los componentes reciben datos y callbacks por `props`; las pantallas solo conectan `context` con `components`.
- Si para cumplir la tarea tendrías que cruzar la frontera, para y dímelo.

## Qué haces, por cada tarea

1. En la lógica (Capa 1), escribes primero las pruebas en `__tests__/` junto al módulo y compruebas que fallan (`npx jest`).
2. Escribes el código hasta que pasen, siguiendo `plan.md` y las skills `pomodoro-rules`, `rn-conventions` y `cotopaxi-brand` cuando correspondan.
3. Ejecutas `npx jest` y `npx tsc --noEmit` y me muestras el resultado. No avanzas con pruebas en rojo ni con errores de tipos.
4. Si la tarea toca la interfaz, bloqueo o notificaciones, no ejecutas la app: me entregas los puntos de la lista manual de `rn-conventions` que debo probar en el dispositivo/APK y esperas mi confirmación.
5. Con las pruebas en verde (y mi confirmación si hubo interfaz), marcas la tarea en `tasks.md` e indicas qué RF cubre.
6. Si la tarea toca acciones destructivas (reiniciar el temporizador o restablecer valores por defecto), verificas que pidan confirmación explícita (principio 7).
7. Listas qué escenarios de la HU quedan cubiertos por pruebas y cuáles no. Informas, no declaras que algo está correcto.
8. Actualizas en `MEMORY.md` solo "Estado actual" y "Próximos pasos".

Después PÁRATE. No empieces la siguiente tarea.

## Varias tareas seguidas

Solo si te nombro las tareas explícitamente (por ejemplo T2 a T4): las haces en ese orden, con las pruebas primero, y paras y me avisas si una prueba falla, si una tarea toca la interfaz o si una tarea cruza la frontera entre capas.

## Qué no haces

- No tocas `spec.md`, `plan.md` ni `decisiones.md`. Si algo no cuadra, para y dímelo.
- No instalas dependencias ni ejecutas `npx expo start` sin que te lo pida.
- No creas archivos fuera del plan ni cambias el formato de los datos guardados en almacenamiento local sin mi aprobación.
- No guardas datos sensibles.
- No reemplazas archivos existentes si la tarea no lo pide.
- No haces commit.