# Tareas de implementación — Spec 006: Usar la aplicación sin registro, sin internet y sin publicidad

> Ordenadas por dependencia. Las tareas de Capa 1 comienzan por pruebas y no
> avanzan con Jest o TypeScript en rojo. La ausencia total de publicidad, el funcionamiento
> 100% offline, el respaldo por vibración y la degradación en memoria están definidos
> en la spec y en las Decisiones 1 a 8 de `decisiones.md`.

- [x] **T1. Mecanismo de respaldo de vibración ante fallos o ausencia de audio con pruebas primero.** RF-003, RF-004
  - Hecho cuando: `notificationService.ts` asegura la emisión de vibración como respaldo sin interrupciones ni excepciones no controladas si el audio o canal de notificación no está disponible; las pruebas unitarias en `notificationService.test.ts` verifican el disparo seguro de vibración y el manejo tolerante ante ausencia de hardware; `npx jest` y `npx tsc --noEmit` pasan sin errores.

- [x] **T2. Persistencia estricta y propagación de errores de almacenamiento con pruebas primero.** RF-006, RF-007, RNF-003
  - Hecho cuando: `sessionStorage.ts` y `settingsStorage.ts` restringen los datos persistidos estrictamente a las claves `@pomodoro_settings` y `pomodoro.activeSession` sin registrar IDs de usuario, nombres ni telemetría; ambos módulos aíslan los errores de escritura arrojando fallos tipados comprensibles para que la capa superior active la degradación a memoria; sus pruebas unitarias en `sessionStorage.test.ts` y `settingsStorage.test.ts` pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T3. Degradación a memoria activa en `SettingsContext` ante fallos de guardado con pruebas primero.** RF-006, RF-007
  - Hecho cuando: `SettingsContext.tsx` captura fallos de escritura de `settingsStorage`, preserva los ajustes en memoria durante la sesión activa, los aplica a la sesión de estudio y notifica la advertencia sin bloquear la interfaz; sus pruebas unitarias en `SettingsContext.test.tsx` verifican la actualización en memoria y la tolerancia a errores de almacenamiento; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T4. Continuidad de sesión en memoria, permisos no intrusivos y restauración offline en `StudySessionContext` con pruebas primero.** RF-004, RF-007, RF-008, RF-009, RNF-005
  - Hecho cuando: en `StudySessionContext.tsx`, `commit` actualiza el estado en memoria ante fallos de `saveStudySession` emitiendo una advertencia no bloqueante de degradación a memoria en lugar de abortar la sesión; el rechazo de permisos de notificación permite iniciar el temporizador con avisos en primer plano y no vuelve a insistir con el modal; la restauración de sesión al abrir o volver a primer plano calcula el tiempo transcurrido por timestamps locales `Date.now()` sin peticiones de red; sus pruebas unitarias en `StudySessionContext.test.tsx` pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T5. Validación de pantallas y componentes sin registro, sin anuncios y sin avisos de conectividad.** RF-001, RF-002, RF-005, RF-007, RNF-001, RNF-004
  - Hecho cuando: `index.tsx` abre inmediatamente en la pantalla principal con el temporizador en reposo a 25:00 minutos sin pantallas de bienvenida, modales de inicio ni tutoriales; las pantallas `index.tsx` y `settings.tsx` están completamente libres de banners publicitarios, anuncios, enlaces externos e indicadores de conectividad a internet; `SessionMessage.tsx` renderiza las advertencias de almacenamiento no bloqueantes; `npx jest` y `npx tsc --noEmit` pasan sin errores.

- [ ] **T6. Verificación integral en dispositivo móvil/APK y cierre de la historia.** RF-001 a RF-009, RNF-001 a RNF-005
  - Hecho cuando: pasan `npx jest`, `npx tsc --noEmit` y `npx expo lint`; se comprueba en dispositivo físico o emulador en Modo Avión continuo: primer inicio limpio directo al temporizador a 25:00 sin login ni bienvenida, operación completa sin avisos de red ni publicidad, rechazo de permisos de notificación sin bloqueos, respaldo de vibración al llegar a cero con audio silenciado, conservación o cálculo exacto de tiempo al cerrar y reabrir sin internet, y confirmación explícita antes de reiniciar temporizador o restablecer ajustes; `MEMORY.md` queda actualizado en solo "Estado actual" y "Próximos pasos".
