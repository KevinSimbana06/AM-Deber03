---
name: rn-conventions
description: Úsala siempre que crees o modifiques pantallas, controles del temporizador, formularios de ajustes, notificaciones o manejo de ciclo de vida en React Native.
---

# Convenciones de Interfaz y Dispositivo en React Native (Pomodoro Cotopaxi)

Estas convenciones respetan la separación en dos capas de la constitución (principio 3). Cada regla indica a qué capa aplica.

## Capa 2: interfaz (`src/constants/`, `src/components/`, `src/app/`)

- Estilos con `StyleSheet.create`. Sin librerías de componentes de terceros no aprobadas.
- Reloj del temporizador en formato `MM:SS` con fuente tabular (`fontVariant: ['tabular-nums']`) para evitar que los dígitos salten cada segundo. El componente solo recibe el texto ya formateado por `props`; no calcula tiempos.
- Respeta las áreas seguras (`SafeAreaView`).
- En la pantalla de ajustes, usa teclado numérico entero (`keyboardType="number-pad"`) y un contenedor desplazable (`KeyboardAvoidingView` / `ScrollView`) para que el teclado nunca tape los campos ni el botón de guardar.
- Objetivos táctiles de al menos 44x44 puntos y `accessibilityLabel` en español en todos los botones (Iniciar, Pausar, Reanudar, Reiniciar, Detener alarma, Guardar, Restablecer).
- Las acciones destructivas (reiniciar el temporizador, restablecer valores por defecto) siempre piden confirmación explícita mediante diálogo del sistema.
- Todos los textos visibles al estudiante están en español.
- Ningún archivo de esta capa llama a `AsyncStorage` ni `expo-notifications`, ni calcula el tiempo restante con `Date.now()`. Todo llega por hooks de `src/context/`.

## Capa 1: ciclo de vida y notificaciones (`src/context/`, `src/services/`)

- Escucha los cambios de `AppState` (`active`, `background`, `inactive`) en `src/context/`, nunca en las pantallas. Al volver a `active`, recalcula de inmediato el tiempo restante con `endTimestamp - Date.now()` mediante las funciones de `src/utils/`.
- El conteo nunca depende solo de `setInterval`: se calcula a partir de `endTimestamp` persistido (constitución, principio 5).
- En Android, configura en `src/services/` un canal de notificaciones de máxima prioridad (`AndroidImportance.MAX`, sonido, vibración y visibilidad en pantalla de bloqueo) para que el aviso de fin de fase suene como alarma incluso en segundo plano.
- Estos archivos no importan componentes visuales ni constantes de colores.

## Lista manual de verificación en el dispositivo

Se prueba en dispositivo o APK. Estos puntos no se automatizan con Jest.

- [ ] Al abrir por primera vez llega directo al temporizador sin login, funciona en Modo Avión y no muestra publicidad.
- [ ] El reloj cuenta regresivamente en formato `MM:SS`, permite pausar/reanudar y pide confirmación antes de reiniciar.
- [ ] Muestra la fase actual ("Estudio", "Descanso corto", "Descanso largo") y el contador de pomodoros del ciclo, pasando al descanso largo tras el 4.º pomodoro.
- [ ] Al bloquear el celular o cerrar la app desde recientes con el temporizador corriendo, descuenta el tiempo real transcurrido y avisa puntual al llegar a cero.
- [ ] El aviso de fin de fase suena y vibra con el celular bloqueado y en modo silencio, y se puede detener con "Detener alarma".
- [ ] Al cerrar y reabrir la app, la sesión activa y los tiempos personalizados se conservan.
- [ ] En ajustes rechaza valores inválidos, permite restablecer a 25/5/15/4 con confirmación y no altera una fase que ya esté corriendo.
- [ ] El teclado numérico no tapa los campos ni el botón de guardar.
