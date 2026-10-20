# Decisiones de HU-001

## 1. Qué ocurre al llegar a cero

**Pregunta:** La historia no indica qué sucede cuando la cuenta llega a `00:00`. ¿Debe la sesión quedar finalizada y detenida o iniciar otra fase automáticamente?

**Respuesta:** Al llegar a `00:00`, la sesión queda finalizada y detenida hasta que el estudiante pulse Reiniciar. No inicia otra fase automáticamente.

**Motivo:** HU-001 solo define el control de una sesión de estudio; dejarla finalizada evita introducir una transición a descanso que la historia no especifica.

## 2. Estado al abrir o volver a la app

**Pregunta:** ¿Qué debe mostrarse en la primera apertura y cuando existe una sesión guardada? ¿Qué ocurre si una sesión corriendo vence mientras la app está cerrada?

**Respuesta:** La primera apertura muestra el temporizador detenido en el tiempo inicial configurado. Si existe una sesión guardada, se restaura su fase, estado y tiempo restante real. Si una sesión corriendo venció mientras la app estaba cerrada, se muestra finalizada en `00:00`.

**Motivo:** Conserva la sesión del estudiante y permite un conteo exacto basado en la hora real, incluso con la app cerrada.

## 3. Error al guardar o recuperar datos

**Pregunta:** ¿Qué debe ocurrir si la app no puede guardar o leer la sesión activa?

**Respuesta:** Se muestra un error claro, no se presenta la operación como guardada y se conserva el último estado confirmado.

**Motivo:** Continuar silenciosamente en memoria podría hacer que el estudiante pierda la sesión al cerrar la app sin saberlo.

## 4. Aviso de finalización no disponible

**Pregunta:** ¿Qué debe ocurrir si el sistema no permite programar el aviso local?

**Respuesta:** El estudiante puede iniciar y controlar el temporizador, y se muestra una advertencia explícita de que el aviso no estará disponible.

**Motivo:** El permiso no debe bloquear el temporizador, pero la aplicación debe informar claramente la limitación.

## 5. Controles cuando la sesión termina

**Pregunta:** ¿Qué controles quedan disponibles cuando la sesión finaliza en `00:00`?

**Respuesta:** Iniciar y Pausar quedan deshabilitados. Solo Reiniciar queda disponible para volver al tiempo inicial y requiere confirmación explícita.

**Motivo:** Evita iniciar accidentalmente otra cuenta y mantiene el reinicio como la única acción destructiva definida para este flujo.

## 6. Persistencia, avisos y formato de almacenamiento

**Pregunta:** ¿Qué dependencias y formato inicial deben utilizarse para conservar
la sesión activa y programar avisos locales?

**Respuesta:** Se usará `@react-native-async-storage/async-storage` para guardar
la sesión activa y `expo-notifications` para programar avisos locales. Las
dependencias se instalarán con `npx expo install` usando versiones compatibles
con Expo SDK 57. La sesión se almacenará como un único objeto JSON versionado
con la clave `pomodoro.activeSession`, con los campos
`schemaVersion`, `phase`, `status`, `initialDurationSeconds`,
`remainingSeconds` y `endTimestamp`.

**Motivo:** Esta combinación cubre la persistencia local y los avisos con la app
cerrada, mantiene la aplicación offline y evita introducir una base de datos
para una única sesión activa. El formato versionado permite detectar futuras
migraciones sin cambiarlo de forma implícita.
