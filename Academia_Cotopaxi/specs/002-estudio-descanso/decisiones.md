# Decisiones de HU-002

## 1. Inicio de la siguiente fase

**Pregunta:** La historia dice que la aplicación “pase sola” al siguiente
tiempo, pero los escenarios dicen que lo “deja listo para que yo lo inicie”.
¿Debe la siguiente fase comenzar automáticamente o quedar preparada y
detenida?

**Respuesta:** Al terminar una fase, la aplicación cambia automáticamente a la
siguiente fase y la deja preparada y detenida. El estudiante debe pulsar
Iniciar para comenzar a descontar el tiempo.

**Motivo:** Respeta la indicación de que la fase quede lista para que el
estudiante la inicie y evita comenzar un bloque sin una acción explícita.

## 2. Transición mientras la aplicación no está visible

**Pregunta:** ¿Qué debe ocurrir si el teléfono está bloqueado o la aplicación
está cerrada cuando termina una fase?

**Respuesta:** Al volver a la aplicación, se usa la hora real para procesar una
sola transición pendiente, actualizar el contador y dejar la siguiente fase
detenida. No se encadenan fases automáticamente.

**Motivo:** Mantiene el conteo exacto sin iniciar descansos o estudios que el
estudiante no haya comenzado explícitamente.

## 3. Momento en que aumenta el contador

**Pregunta:** ¿Cuándo debe aumentar el contador de pomodoros completados?

**Respuesta:** El contador aumenta al completar un tiempo de estudio. Después
del primer estudio se muestra 1 de 4 mientras el descanso corto está
preparado. Al completar el cuarto estudio, se prepara el descanso largo y el
contador vuelve a 0.

**Motivo:** El avance representa estudios completados, no estudios iniciados,
y permite identificar el ciclo actual antes del siguiente descanso largo.

## 4. Error al guardar una transición

**Pregunta:** ¿Qué debe ver el estudiante si falla el guardado de la nueva
fase o del contador?

**Respuesta:** La aplicación muestra un error claro, conserva la última fase y
el último contador guardados, y no presenta la transición como completada.

**Motivo:** Evita que una transición parezca exitosa cuando el estado podría
perderse al cerrar la aplicación.

## 5. Persistencia de una fase preparada

**Pregunta:** ¿Qué ocurre si el estudiante cierra la aplicación después de
que una fase quedó preparada, pero antes de iniciarla?

**Respuesta:** La fase preparada y el contador se guardan. Al volver, se
muestran exactamente igual, sin consumir tiempo ni avanzar automáticamente.

**Motivo:** Conserva el estado que el estudiante ya alcanzó y evita iniciar
una fase durante su ausencia.

## 6. Cambio del objetivo durante un ciclo

**Pregunta:** ¿Qué cantidad de pomodoros determina el descanso largo si el
estudiante cambia esa configuración mientras un ciclo está en curso?

**Respuesta:** El ciclo actual conserva el objetivo con el que comenzó. El
nuevo valor se aplica desde el siguiente ciclo, después de completar el
descanso largo y reiniciar el contador.

**Motivo:** Evita que el criterio para llegar al descanso largo cambie
inesperadamente a mitad del ciclo.

## 7. Estado guardado inválido

**Pregunta:** ¿Qué debe ocurrir si la sesión guardada está incompleta,
corrupta o contiene una fase o contador inválido?

**Respuesta:** La aplicación muestra un aviso claro de que no pudo recuperar la
sesión, descarta solo ese estado inválido y muestra una sesión nueva detenida
con los valores configurados. No intenta repararlo silenciosamente.

**Motivo:** Evita continuar con datos inconsistentes y hace visible al
estudiante que la sesión anterior no pudo recuperarse.

## 8. Evolución del formato de almacenamiento

**Pregunta:** ¿Cómo se incorporan la fase, los pomodoros completados y el
objetivo del ciclo al contrato persistido de `pomodoro.activeSession`?

**Respuesta:** Se utilizará la versión 2 del contrato manteniendo la clave
`pomodoro.activeSession`. Las sesiones de versión 1 se migrarán explícitamente
a una sesión equivalente de estudio detenida, conservando la duración y el
tiempo restante cuando sean válidos. Las versiones desconocidas o los datos
inválidos se rechazarán, mostrarán un aviso claro y crearán una sesión nueva
detenida según la Decisión 7.

**Motivo:** Conserva las sesiones existentes sin cambiar silenciosamente el
significado de la versión 1 y deja una base explícita para futuras
migraciones.
