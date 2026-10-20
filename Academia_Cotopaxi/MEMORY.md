MEMORY.md - Pomodoro Academia Cotopaxi

Estado del trabajo entre sesiones. Máximo ~50 líneas.
## Estado actual
- HU-001, HU-002, HU-003 y HU-004 implementadas y verificadas con pruebas automatizadas en verde.
- Spec 004 (Recibir aviso al terminar el tiempo) completada al 100% (tareas T1 a T7 en `tasks.md`):
  - Capa 1: contratos y utilidades de mensajes de aviso (`alarmMessages.ts`), canal nativo de alarma Android (`usage: ALARM`, vibración rítmica, categoría interactiva con «Detener»), orquestación de alarma, corte automático a los 60s y flujo de permisos en `StudySessionContext.tsx`.
  - Capa 2: modal prominente de alarma activa (`AlarmActiveModal.tsx`), modal explicativo previo de permisos (`NotificationPermissionModal.tsx`), enlace a ajustes en `SessionMessage.tsx` e integración en pantalla principal `index.tsx`.
- 16 suites de pruebas Jest pasando (100 pruebas en verde), 0 errores en `npx tsc --noEmit` y 0 errores en `npx expo lint`.

## Próximos pasos
- Realizar comprobación manual en dispositivo/emulador Android (sonido en modo silencio, vibración, acción «Detener» desde notificación, modal prominente y corte de 60s) o iniciar la siguiente historia de usuario (HU-005).
