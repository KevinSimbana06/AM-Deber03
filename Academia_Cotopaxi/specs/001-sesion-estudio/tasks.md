# Tareas de implementación — Spec 001: Sesión de estudio

> Las tareas están ordenadas por dependencia y cada una debe completarse con
> las pruebas exigidas antes de avanzar. Las dependencias y el contrato de
> persistencia están aprobados en la Decisión 6.

- [x] **T1. Instalar dependencias aprobadas y preparar el contrato de persistencia.** RF-001, RF-003, RF-011, RF-013, RF-014
  - **Hecho cuando:** `npx expo install @react-native-async-storage/async-storage expo-notifications` termina correctamente, `package.json` refleja versiones compatibles con Expo SDK 57 y el contrato `pomodoro.activeSession` queda documentado en los tipos sin cambiarlo durante la implementación.

- [x] **T2. Definir tipos y utilidades temporales con pruebas primero.** RF-001, RF-002, RF-003, RF-009, RF-011, RF-012, RNF-002
  - **Hecho cuando:** `src/types/` y las pruebas de `timer`/contratos cubren tiempo restante desde `endTimestamp - Date.now()`, cero al vencer y `MM:SS`; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T3. Implementar las transiciones de sesión con pruebas primero.** RF-002, RF-004, RF-005, RF-006, RF-007, RF-008, RF-009, RF-010
  - **Hecho cuando:** las pruebas cubren iniciar, pausar, reanudar, reiniciar confirmado/cancelado, finalización y ausencia de transición automática; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T4. Implementar la validación de duración con pruebas primero.** RF-001, RF-002
  - **Hecho cuando:** los límites y entradas inválidas definidos por el flujo de configuración son aceptados/rechazados en Jest y `npx tsc --noEmit` pasa, sin crear una pantalla de configuración.

- [x] **T5. Implementar persistencia local con pruebas primero.** RF-001, RF-004, RF-005, RF-007, RF-011, RF-012, RF-013, RNF-001, RNF-003, RNF-004
  - **Hecho cuando:** lectura, escritura, ausencia de sesión y errores conservan el último estado confirmado según el contrato aprobado; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T6. Implementar el servicio de avisos con pruebas primero.** RF-003, RF-009, RF-014
  - **Hecho cuando:** el servicio programa/cancela el aviso, comunica permisos o fallos y no bloquea el control del temporizador cuando el aviso no está disponible; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T7. Orquestar restauración, ciclo de vida y acciones en el contexto con pruebas primero.** RF-001 a RF-005, RF-007, RF-009, RF-011 a RF-014
  - **Hecho cuando:** el contexto restaura sesiones pausadas/corriendo/vencidas, persiste cada transición, recalcula con hora real al volver al primer plano y expone errores/advertencias; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T8. Crear componentes visuales y confirmación de reinicio.** RF-002, RF-004, RF-005, RF-006, RF-008, RF-009, RF-010, RF-013, RF-014
  - **Hecho cuando:** los componentes reciben datos y callbacks por props, muestran `MM:SS`, deshabilitan iniciar/pausar en `00:00`, exigen confirmación para reiniciar y presentan errores/advertencias; verificación manual de `rn-conventions` y `cotopaxi-brand` completada.

- [x] **T9. Conectar la pantalla principal y el proveedor de contexto.** RF-001 a RF-014, RNF-001 a RNF-004
  - **Hecho cuando:** `src/app/` solo conecta contexto y componentes, no accede directamente a almacenamiento/avisos ni calcula timestamps; la pantalla funciona offline y pasa la lista manual de UI.

- [x] **T10. Ejecutar validación integral en dispositivo/APK y cerrar la tarea.** RF-001 a RF-014, RNF-001 a RNF-004
  - **Hecho cuando:** `npx jest`, `npx tsc --noEmit` y `npx expo lint` pasan; se verifica en dispositivo bloqueo, cierre, restauración, vencimiento, aviso disponible/no disponible y confirmación/cancelación; se registran en `MEMORY.md` solo Estado actual y Próximos pasos.
