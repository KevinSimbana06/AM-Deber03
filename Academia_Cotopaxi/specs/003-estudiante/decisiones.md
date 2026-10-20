# Decisiones de HU-003

## 1. Estado al reabrir con fase vencida

**Pregunta:** La historia HU-003 indica que si el tiempo termina con la app cerrada, "al abrir la aplicación, la fase aparece como terminada", mientras que en HU-002 se acordó que al vencer una fase se deja la siguiente preparada y detenida. ¿Qué debe ver exactamente el estudiante en pantalla al abrir la app tras cumplirse el tiempo?

**Respuesta:** Pasar a la siguiente fase preparada y detenida (según HU-002), pero mostrando un aviso o mensaje en pantalla que informe claramente que la fase anterior terminó mientras la app no estaba activa.

**Motivo:** Mantiene la coherencia con el ciclo automático de fases definido en HU-002 sin iniciar bloques de tiempo sin acción del estudiante, a la vez que cumple el criterio de HU-003 dando visibilidad explícita de que la fase anterior terminó durante su ausencia.

## 2. Persistencia del identificador de aviso para cancelación exacta

**Pregunta:** Si el estudiante inicia el temporizador, cierra la app y luego la vuelve a abrir mientras sigue corriendo para pausar o reiniciar: ¿debe guardarse el identificador de la notificación programada en los datos persistidos de la sesión activa para garantizar su cancelación exacta?

**Respuesta:** Guardar el identificador del aviso (`notificationId`) en la sesión activa persistida (`pomodoro.activeSession`) para cancelarlo de forma exacta al pausar o reiniciar tras reabrir la app.

**Motivo:** Evita que al cerrar y reabrir la app se pierda la referencia al aviso nativo programado en el sistema operativo, impidiendo alarmas erróneas tras pausar o reiniciar.

## 3. Inconsistencia por reloj del sistema modificado hacia atrás

**Pregunta:** ¿Qué debe hacer la aplicación si la hora del sistema cambia hacia atrás (por cambio de zona horaria o ajuste manual del reloj) y el tiempo restante calculado resulta mayor a la duración original de la fase?

**Respuesta:** Limitar el tiempo restante a la duración inicial de la fase (no puede superar el total original) y mostrar una advertencia en pantalla indicando que la hora del reloj fue modificada.

**Motivo:** Evita que el temporizador muestre tiempos absurdos o superiores a los configurados debido a alteraciones en el reloj del dispositivo, informando de forma transparente la anomalía al estudiante.

## 4. Inactividad prolongada con sesión en curso vencida (> 24 horas)

**Pregunta:** Si el estudiante reabre la aplicación mucho tiempo después de que la fase venció (por ejemplo, al día siguiente o tras varias horas de inactividad), ¿cómo debe reaccionar la aplicación?

**Respuesta:** Si han transcurrido más de 24 horas desde que venció la sesión, considerar la sesión expirada por inactividad, reiniciar el contador de pomodoros a cero y dejar la fase de Estudio inicial lista y detenida, mostrando un aviso informativo.

**Motivo:** Permite que un estudiante que abandonó la app por un día o más no retome un ciclo desactualizado de jornadas anteriores, comenzando un nuevo ciclo limpio con la debida explicación visual.

## 5. Limpieza automática de notificaciones del sistema al abrir la app

**Pregunta:** Cuando el aviso de fin de fase ya se disparó mientras la app estaba cerrada o bloqueada y el estudiante abre la aplicación (sea tocando la notificación o abriendo el icono directamente): ¿debe limpiarse automáticamente la notificación de la bandeja del sistema?

**Respuesta:** Limpiar automáticamente el aviso de fin de la barra de notificaciones del sistema en cuanto el estudiante abre la aplicación, mostrando el aviso directamente en la interfaz.

**Motivo:** Mejora la experiencia evitando que notificaciones obsoletas queden fijas en la barra de estado del sistema una vez que el estudiante ya ingresó y visualizó el estado en la app.

## 6. Reprogramación del aviso tras reinicio del dispositivo

**Pregunta:** Si el dispositivo se apaga o reinicia mientras el temporizador estaba corriendo (lo cual borra las alarmas programadas en el sistema operativo), al volver a abrir la aplicación con tiempo aún pendiente: ¿debe la aplicación reprogramar automáticamente el aviso de fin en el sistema operativo?

**Respuesta:** Sí, recalcular el tiempo restante exacto y reprogramar automáticamente el aviso en el sistema con el nuevo tiempo restante, mostrando una advertencia solo si los permisos de notificación ya no estuvieran concedidos.

**Motivo:** Garantiza que el conteo en curso siga protegido ante reinicios accidentales del teléfono, asegurando que si el estudiante vuelve a bloquear la pantalla el aviso sonará al llegar a cero.

## 7. Expiración por inactividad prolongada en sesión pausada (> 24 horas)

**Pregunta:** En el caso de una sesión que fue pausada antes de cerrar la app (Escenario 4), si el estudiante vuelve después de más de 24 horas de inactividad: ¿debe aplicarse también la regla de expiración por inactividad (reiniciando el ciclo a 0 de 4 con aviso) o debe conservarse pausada indefinidamente?

**Respuesta:** Si la sesión estaba pausada por más de 24 horas sin actividad, considerarla también expirada, reiniciar el ciclo a 0 de 4 y preparar la sesión de Estudio inicial con un mensaje informativo.

**Motivo:** Mantiene la coherencia con la regla de 24 horas para sesiones vencidas, evitando mantener ciclos obsoletos pausados tras días de inactividad y ofreciendo un punto de partida fresco y claro para una nueva jornada de estudio.

## 8. Evolución del contrato persistido a versión 3

**Pregunta:** Para almacenar el identificador de aviso (Decisión 2) y la marca de tiempo de última actividad para la regla de las 24 horas (Decisiones 4 y 7): ¿cómo debe evolucionar el formato de datos persistidos en `pomodoro.activeSession`?

**Respuesta:** Actualizar el contrato a versión 3 en `pomodoro.activeSession` (agregando `notificationId` y `lastActiveTimestamp`), migrando de forma explícita y segura las sesiones válidas de la versión 2 y rechazando datos corruptos con un aviso claro.

**Motivo:** Cumple con el principio 7 de la constitución garantizando que la evolución del esquema sea controlada, explícita y versionada, facilitando pruebas y protegiendo los datos previos del estudiante.
