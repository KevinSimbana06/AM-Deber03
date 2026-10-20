# Tareas de implementación — Spec 002: Alternar entre estudio y descanso

> Ordenadas por dependencia. Las tareas de Capa 1 comienzan por pruebas y no
> avanzan con Jest o TypeScript en rojo. La migración a la versión 2 del
> contrato persistido está aprobada en la Decisión 8.

- [x] **T1. Definir el contrato de fases y ciclos con pruebas primero.** RF-001, RF-002, RF-003, RF-006, RF-008, RF-009
  - Hecho cuando: las pruebas de tipos/utilidades describen estudio, descanso corto, descanso largo, contador y objetivo por ciclo; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T2. Implementar el cálculo temporal y las transiciones puras.** RF-001, RF-002, RF-003, RF-004, RF-005, RF-007, RF-012
  - Hecho cuando: las pruebas escritas antes del código cubren finalización por hora real, preparación detenida, contador antes/después del objetivo, descanso que prepara estudio, y exactamente una transición; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T3. Extender y probar la validación de configuración.** RF-001, RF-002, RF-009
  - Hecho cuando: las duraciones y el objetivo aceptan solo los rangos ya definidos por la configuración, rechazan entradas inválidas y `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T4. Aplicar el contrato de persistencia versión 2 y su migración.** RF-006, RF-009, RF-010, RF-011, RNF-002, RNF-005
  - Hecho cuando: la versión 1 válida migra explícitamente a una sesión de estudio detenida versión 2, las versiones desconocidas y datos inválidos muestran aviso, y las pruebas de lectura/escritura pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T5. Implementar persistencia y restauración de fases con pruebas primero.** RF-005, RF-006, RF-010, RF-011, RF-012
  - Hecho cuando: una fase preparada se restaura sin consumir tiempo, un estado inválido produce aviso y sesión nueva detenida, y un fallo de escritura conserva el último estado confirmado; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T6. Adaptar avisos locales al ciclo de fases con pruebas primero.** RF-004, RF-005, RF-007, RNF-003, RNF-004
  - Hecho cuando: se programa/cancela el aviso de la fase corriendo, no se programan fases preparadas y los fallos quedan explícitos sin bloquear el temporizador; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T7. Orquestar transiciones y ciclo de vida en el contexto con pruebas primero.** RF-001 a RF-007, RF-009 a RF-012
  - Hecho cuando: el contexto procesa una sola transición al volver a primer plano, persiste fase/contador/objetivo juntos, conserva el estado ante error y expone mensajes de recuperación/guardado; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T8. Crear el componente de progreso y actualizar la pantalla.** RF-001 a RF-004, RF-008, RF-010, RF-011
  - Hecho cuando: `PomodoroProgress` recibe `completedPomodoros` y `cycleTarget` por props, la interfaz muestra fase, `MM:SS`, pomodoros completados y mensajes explícitos, deja detenida la siguiente fase y mantiene confirmación para reiniciar; verificación manual de `rn-conventions` y `cotopaxi-brand` completada.

- [x] **T9. Validar la historia completa en dispositivo/APK y cerrar la fase.** RF-001 a RF-012, RNF-001 a RNF-005
  - Hecho cuando: `npx jest`, `npx tsc --noEmit` y `npx expo lint` pasan; en dispositivo se verifican alternancia, contador, objetivo por ciclo, cierre/bloqueo, una sola transición, fase preparada persistida, errores explícitos y confirmación de reinicio; `MEMORY.md` contiene solo Estado actual y Próximos pasos actualizados.
