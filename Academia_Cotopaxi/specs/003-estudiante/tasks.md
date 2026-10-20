# Tareas de implementación — Spec 003: Mantener el conteo con el celular bloqueado o la app cerrada

> Ordenadas por dependencia. Las tareas de Capa 1 comienzan por pruebas y no
> avanzan con Jest o TypeScript en rojo. La migración a la versión 3 del contrato
> persistido está aprobada en la Decisión 8.

- [x] **T1. Contrato versión 3 de la sesión y tipos de recuperación con pruebas primero.** RF-001, RF-002, RF-005, RF-006, RF-013
  - Hecho cuando: `StudySession` en `src/types/pomodoro.ts` define `version: 3`, `notificationId: string | null` y `lastActiveTimestamp: number`; los tipos de anomalías de recuperación están tipados y `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T2. Funciones puras de cálculo temporal con detección de reloj atrasado e inactividad con pruebas primero.** RF-001, RF-002, RF-004, RF-005, RF-007, RF-008, RF-009
  - Hecho cuando: las pruebas unitarias escritas antes del código en `timer.test.ts` y `sessionRecovery.test.ts` cubren cálculo exacto por marca de tiempo real, limitación a duración nominal ante reloj retrasado, expiración a 0 de 4 con mensaje tras > 24 h de inactividad (en fase vencida o pausada) y detección de fase terminada en ausencia; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T3. Persistencia versión 3, migración (v1 y v2) y descarte seguro de datos corruptos con pruebas primero.** RF-005, RF-006, RF-012, RF-013, RNF-002, RNF-005
  - Hecho cuando: `sessionStorage.ts` almacena y lee el contrato versión 3, migra limpiamente sesiones válidas de versión 1 y versión 2 asignando `notificationId: null` y `lastActiveTimestamp`, y lanza error tipado sin modificar datos ante esquemas corruptos o desconocidos; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T4. Servicios nativos de notificaciones: cancelación exacta y limpieza de bandeja con pruebas primero.** RF-003, RF-006, RF-010, RF-011, RNF-003
  - Hecho cuando: `notificationService.ts` incluye `dismissAllNotifications()` para limpiar la barra de estado, garantiza la cancelación puntual por `notificationId`, gestiona advertencia ante permisos denegados y sus pruebas unitarias en `notificationService.test.ts` pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T5. Orquestar recuperación de sesión, reprogramación y AppState en el contexto con pruebas primero.** RF-001 a RF-013
  - Hecho cuando: `StudySessionContext.tsx` limpia la bandeja de notificaciones al montar y ante `AppState: "active"`, procesa inactividad > 24 h, advierte reloj retrasado, reprograma avisos de sesiones en curso con tiempo pendiente, cancela la alarma al pausar o reiniciar mediante el ID persistido, y muestra mensajes explícitos de fase vencida en ausencia o datos corruptos; las pruebas en `StudySessionContext.test.tsx` pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T6. Extender la visualización de avisos informativos y advertencias en la interfaz.** RF-004, RF-007, RF-008, RF-009, RF-011, RF-012, RNF-004
  - Hecho cuando: `SessionMessage.tsx` y la pantalla `index.tsx` presentan mensajes informativos (fase concluida en ausencia, inactividad > 24 h) y advertencias (reloj alterado, permisos) respetando la paleta y contraste de `cotopaxi-brand`, manteniendo la separación estricta de capas; `npx jest` y `npx tsc --noEmit` pasan.

- [ ] **T7. Verificación integral en dispositivo móvil/APK y cierre de la historia.** RF-001 a RF-013, RNF-001 a RNF-005
  - Hecho cuando: `npx jest`, `npx tsc --noEmit` y `npx expo lint` pasan; en dispositivo/APK se verifican los escenarios de bloqueo, cierre desde recientes, fin de fase con app cerrada (aviso sonoro/vibración y mensaje al abrir), pausa previa sin avisos, cancelación precisa, reloj retrasado, inactividad > 24 h y limpieza de bandeja; `MEMORY.md` contiene solo Estado actual y Próximos pasos actualizados.
