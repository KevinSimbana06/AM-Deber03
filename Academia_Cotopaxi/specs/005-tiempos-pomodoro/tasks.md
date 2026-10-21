# Tareas de implementación — Spec 005: Ajustar los tiempos del pomodoro

> Ordenadas por dependencia. Las tareas de Capa 1 comienzan por pruebas y no
> avanzan con Jest o TypeScript en rojo. La configuración de rangos y el esquema
> persistente en `@pomodoro_settings` están aprobados en las Decisiones 1, 2 y 8.

- [x] **T1. Contratos y funciones puras de validación de ajustes con pruebas primero.** RF-002, RF-003
  - Hecho cuando: `PomodoroSettings` está definido en `src/types/pomodoro.ts` y las pruebas unitarias en `cycleSettings.test.ts` verifican los rangos pedagógicos de HU-005 (estudio 25–90 min, descanso corto 5–20 min, descanso largo 15–30 min, ciclo 2–8 pomodoros) con rechazo de vacíos, decimales, negativos y valores fuera de rango; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T2. Persistencia local de ajustes y tolerancia a fallos con pruebas primero.** RF-005, RF-011, RNF-001, RNF-002
  - Hecho cuando: `settingsStorage.ts` persiste y lee en `@pomodoro_settings`, recupera de forma segura los valores por defecto (25/5/15/4) si la clave no existe o está corrupta, y sus pruebas en `settingsStorage.test.ts` pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T3. Proveedor de contexto de ajustes y orquestación con la sesión activa con pruebas primero.** RF-004, RF-005, RF-006, RF-007, RF-009, RF-011
  - Hecho cuando: `SettingsContext.tsx` orquesta la persistencia de ajustes y su sincronización con `StudySessionContext`, actualizando de inmediato la duración nominal visible en reposo y preservando intacta la sesión en curso o pausada; las pruebas unitarias pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T4. Componente de formulario de ajustes con validación reactiva en línea.** RF-002, RF-003, RF-004, RNF-003
  - Hecho cuando: `SettingsForm.tsx` presenta los 4 campos numéricos con teclado `number-pad`, valida instantáneamente al escribir mostrando mensajes de error en línea bajo los campos inválidos, resalta los inputs con error y habilita el botón «Guardar» únicamente si todos los campos son válidos; sus pruebas unitarias pasan con `npx jest` y `npx tsc --noEmit`.


- [x] **T5. Componente modal de confirmación para restablecer valores por defecto.** RF-008, RF-009, RF-010, RNF-004
  - Hecho cuando: `ResetSettingsModal.tsx` solicita confirmación explícita con diseño institucional Cotopaxi antes de restablecer a 25/5/15/4, ejecuta la confirmación mediante botón destructivo y cierra sin alterar valores al cancelar; sus pruebas unitarias pasan con `npx jest` y `npx tsc --noEmit`.


- [x] **T6. Pantalla de ajustes `/settings` y botón de navegación en la cabecera principal.** RF-001, RF-004
  - Hecho cuando: `src/app/settings.tsx` integra el formulario y el modal con `KeyboardAvoidingView` y retorno automático tras guardar, y `src/app/index.tsx` incluye el botón de ajustes (engranaje) en la cabecera accesible en reposo, en curso y en pausa; `npx jest` y `npx tsc --noEmit` pasan sin errores.


- [x] **T7. Verificación integral en dispositivo móvil/APK y cierre de la historia.** RF-001 a RF-011, RNF-001 a RNF-005
  - Hecho cuando: pasan `npx jest`, `npx tsc --noEmit` y `npx expo lint`; se comprueba en dispositivo/APK la navegación desde la cabecera, la validación en línea de rangos inválidos, el guardado y actualización inmediata en reposo, la conservación de fase activa al guardar en curso/pausa, el modal de restablecimiento y la persistencia tras reiniciar la app; `MEMORY.md` queda actualizado en solo "Estado actual" y "Próximos pasos".

