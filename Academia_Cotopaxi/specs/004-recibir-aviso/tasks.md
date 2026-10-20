# Tareas de implementación — Spec 004: Recibir aviso al terminar el tiempo

> Ordenadas por dependencia. Las tareas de Capa 1 comienzan por pruebas y no
> avanzan con Jest o TypeScript en rojo. La configuración del canal de alarma
> nativo y el límite de corte de 60 segundos están aprobados en las Decisiones 2 y 5.

- [x] **T1. Contratos y utilidades puras de contenidos de aviso y cálculo de corte con pruebas primero.** RF-004, RF-005, RF-006, RF-007, RF-012
  - Hecho cuando: las pruebas unitarias escritas antes del código en `alarmMessages.test.ts` verifican los textos de fin de estudio (con descanso corto de 5 min o largo de 15 min), fin de descanso (motivando el estudio) y la función de cálculo de expiración de 60 segundos; `npx jest` y `npx tsc --noEmit` pasan sin errores.

- [x] **T2. Servicio nativo de avisos con canal de alarma, categoría «Detener» y vibración rítmica con pruebas primero.** RF-001, RF-003, RF-004, RF-005, RF-008, RF-010, RF-012, RNF-002, RNF-003
  - Hecho cuando: `notificationService.ts` configura el canal de Android con `usage: ALARM`, registra la categoría con acción interactiva «Detener», controla la vibración rítmica de alarma y su cancelación segura ante falta de hardware, y sus pruebas en `notificationService.test.ts` pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T3. Orquestar el estado de alarma, temporizador de 60s y acciones de detención en el contexto con pruebas primero.** RF-004 a RF-011, RNF-003, RNF-004
  - Hecho cuando: `StudySessionContext.tsx` activa el estado de alarma y vibración al terminar una fase, silencia la alarma con `stopAlarm()`, procesa el corte automático tras 60 segundos, responde a la acción «Detener» y toque de la notificación, y deja la siguiente fase preparada; las pruebas en `StudySessionContext.test.tsx` pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T4. Flujo de permisos previo y manejo de rechazo/ajustes en el contexto con pruebas primero.** RF-001, RF-002, RF-003
  - Hecho cuando: `StudySessionContext.tsx` controla la presentación del modal explicativo de permisos en el primer inicio, permite continuar sin avisos si se deniega mostrando una advertencia visible no bloqueante, y expone la acción para abrir los ajustes del teléfono (`Linking.openSettings()`); las pruebas unitarias pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T5. Crear el componente modal prominente «¡Fase finalizada!» y botón «Detener aviso».** RF-008, RF-009
  - Hecho cuando: `AlarmActiveModal.tsx` se muestra superpuesto cuando la alarma está activa, presenta la fase completada, ofrece un botón prominente «Detener aviso» con diseño accesible y paleta Cotopaxi, e invoca el callback para silenciar; `AlarmActiveModal.test.tsx` pasa con `npx jest` y `npx tsc --noEmit`.

- [x] **T6. Crear el modal explicativo de permisos y banner de advertencia no bloqueante.** RF-001, RF-002, RF-003
  - Hecho cuando: `NotificationPermissionModal.tsx` presenta la explicación institucional previa con botones para permitir o continuar sin avisos, y `SessionMessage.tsx` incluye el enlace «Abrir ajustes» en caso de denegación; sus pruebas unitarias pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T7. Integrar en pantalla principal, validar en dispositivo/APK y cierre de la historia.** RF-001 a RF-012, RNF-001 a RNF-005
  - Hecho cuando: `index.tsx` conecta los modales de alarma y permisos con el contexto; pasan `npx jest`, `npx tsc --noEmit` y `npx expo lint`; se comprueba en dispositivo/APK el sonido en silencio, vibración rítmica, botón «Detener» en la notificación, modal en primer plano, corte a 60 segundos y flujo de permisos; `MEMORY.md` contiene solo Estado actual y Próximos pasos actualizados.
