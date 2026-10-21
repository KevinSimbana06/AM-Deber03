# Plan de implementación — Spec 006: Usar la aplicación sin registro, sin internet y sin publicidad

> La spec está aprobada y cubre RF-001 a RF-009 y RNF-001 a RNF-005. Este plan implementa
> y valida el funcionamiento 100% offline y autónomo de la aplicación: apertura directa
> sin registro ni tutoriales a 25:00 minutos, ausencia total de anuncios y tráfico de red,
> degradación suave con vibración ante fallos de audio, tolerancia a fallos de persistencia
> manteniendo el estado en memoria con avisos visuales no bloqueantes, solicitud no intrusiva
> de permisos de notificación sin bloqueos ante rechazo, y restauración offline exacta mediante
> marcas de tiempo locales. No se requieren dependencias externas adicionales.

---

## Decisiones técnicas y de diseño resueltas

- **Decisión 1:** Apertura directa del temporizador en reposo a 25:00 minutos en el primer inicio tras la instalación, sin pantallas de bienvenida, modales introductorios ni tutoriales que demoren el estudio.
- **Decisión 2:** Comportamiento completamente transparente con o sin conexión a internet: ningún banner, icono, etiqueta ni diálogo alertando sobre el estado de conectividad.
- **Decisión 3:** Recursos multimedia (fuentes, iconos, sonidos) 100% empaquetados localmente; si la reproducción de audio falla o el canal no está disponible, emitir vibración como mecanismo de respaldo sin interrumpir la sesión ni emitir errores fatales.
- **Decisión 4:** Ante fallos de lectura o escritura en el almacenamiento local (`AsyncStorage`), mantener la sesión y los ajustes en memoria durante la sesión activa, mostrando una advertencia visual no bloqueante al estudiante indicando que los cambios no persistirán al cerrar la aplicación.
- **Decisión 5:** Cero tráfico de red y cero dependencias de analítica o publicidad: ningún SDK externo de rastreo, enlaces web externos ni banners comerciales en ninguna pantalla.
- **Decisión 6:** Solicitud de permisos de notificaciones locales de forma no intrusiva al iniciar la primera sesión; si el estudiante los rechaza, la aplicación continúa operando con normalidad emitiendo avisos en primer plano (sonido/vibración) sin bloquear ni insistir de forma recurrente.
- **Decisión 7:** Restauración automática de la sesión al reabrir la app calculando el tiempo transcurrido estrictamente mediante marcas de tiempo locales (`Date.now()`); si la fase concluyó mientras la app estaba cerrada o suspendida, presentar de inmediato el estado de finalización y el avance según el ciclo Pomodoro.
- **Decisión 8:** Alcance estricto de persistencia local limitado a `@pomodoro_settings` y `pomodoro.activeSession`; cero identificadores de dispositivo, perfiles personales o telemetría.

---

## Archivos y responsabilidades

### Capa 1 — Lógica de negocio (sin imports de React Native UI ni colores)

- `src/types/pomodoro.ts`:
  - Mantener los contratos de datos libres de identificadores de usuario o campos de red.
  - Asegurar tipado para avisos de almacenamiento no bloqueantes y estados de degradación en memoria.
- `src/utils/session.ts` y `src/utils/sessionRecovery.ts`:
  - Funciones puras que calculan tiempos restantes y recuperaciones mediante marcas de tiempo locales `Date.now()`, sin dependencias de red ni librerías externas (RF-009, Decisión 7).
  - Pruebas unitarias asegurando recuperación de fases completadas en ausencia sin requerir sincronización externa.
- `src/storage/sessionStorage.ts` y `src/storage/sessionStorage.test.ts`:
  - Persistencia de `pomodoro.activeSession`.
  - Tipado claro y aislamiento de excepciones de lectura/escritura (`StorageError`) para que la capa de contexto pueda capturarlas y degradar a memoria activa sin abortar la ejecución (RF-006, RF-007, Decisiones 4 y 8).
  - Pruebas unitarias simulando fallos de escritura (`AsyncStorage.setItem` arrojando error) y lectura corrupta.
- `src/storage/settingsStorage.ts` y `src/storage/settingsStorage.test.ts`:
  - Persistencia de `@pomodoro_settings`.
  - Manejo tolerante ante fallos de lectura recuperando valores por defecto y propagación controlada de errores de escritura para degradación a memoria en el contexto (RF-006, RF-007, Decisión 4).
  - Pruebas unitarias de almacenamiento seguro sin campos de rastreo.
- `src/services/notificationService.ts` y `src/services/notificationService.test.ts`:
  - Mecanismo seguro de aviso que combina canal de alarma y vibración rítmica (RF-003, RF-004, Decisiones 3 y 8).
  - Respaldo automático mediante `startAlarmVibration()` si la reproducción sonora no está disponible o falla, sin generar excepciones no capturadas.
  - Comprobación no intrusiva de permisos con `getNotificationPermissionStatus()` y solicitud condicionada (RF-008, Decisión 6).
  - Pruebas unitarias simulando rechazo de permisos y fallos de canales de audio con activación de vibración de respaldo.
- `src/context/SettingsContext.tsx` y `src/context/SettingsContext.test.tsx`:
  - Orquestación de ajustes con soporte de modo en memoria ante fallos de escritura en almacenamiento local (RF-007).
  - Si `saveSettingsToStorage` falla, conservar los ajustes en el estado de React, aplicarlos a la sesión y exponer una advertencia no bloqueante.
  - Pruebas unitarias simulando persistencia fallida y conservación exitosa en memoria.
- `src/context/StudySessionContext.tsx` y `src/context/StudySessionContext.test.tsx`:
  - Modificación de la función `commit`: si `saveStudySession` falla por error de disco o E/S, no revertir el estado de la sesión; en su lugar, actualizar el estado en memoria (`setSession(next)`), permitir que el temporizador continúe su curso y establecer un mensaje de advertencia no bloqueante (`warning: "No se pudieron guardar los cambios en el dispositivo. La sesión continuará en memoria mientras la app permanezca abierta."`) (RF-007, Decisión 4).
  - Manejo de permisos en `start`: si el usuario rechaza los permisos de notificación, marcar que ya fue atendido (`hasDismissedPermissionModal: true`), no volver a mostrar el modal en inicios posteriores y continuar la sesión con avisos en primer plano (RF-008, Decisión 6).
  - Tolerancia de audio en avisos: invocación protegida de sonido y vibración garantizando que si el audio falla, la vibración actúa de inmediato y la alarma visual se activa sin interrumpir la sesión (RF-004).
  - Restauración offline mediante `evaluateSessionRecovery` al montar y al cambiar a `AppState: "active"` (RF-009).
  - Pruebas unitarias exhaustivas para fallo de guardado en memoria, rechazo de permisos y recuperación sin red.

### Capa 2 — Diseño e interfaz (sin llamadas a storage ni cálculos de timestamps)

- `src/constants/theme.ts`:
  - Verificación de ausencia total de tokens o estilos asociados a banners publicitarios, anuncios o avisos de red externa.
- `src/components/SessionMessage.tsx` y `src/components/SessionMessage.test.tsx`:
  - Renderizado de mensajes de advertencia (`warning`) e informativos (`info`) con estilo accesible de la Academia Cotopaxi.
  - Despliegue no bloqueante del aviso de degradación a memoria ante fallos de almacenamiento (RF-007).
- `src/components/NotificationPermissionModal.tsx`:
  - Diálogo no intrusivo con botones claros «Activar avisos» y «Continuar sin avisos».
  - Al pulsar «Continuar sin avisos», descarta el diálogo sin bloquear el inicio del temporizador (RF-008).
- `src/app/index.tsx`:
  - Apertura inmediata en la pantalla del temporizador en reposo (25:00) en el primer montaje, sin pantallas de bienvenida, modales de inicio ni login (RF-001, Decisión 1).
  - Ausencia de indicadores de red, banners de conexión, enlaces externos o scripts publicitarios (RF-002, RF-005, Decisiones 2 y 5).
- `src/app/settings.tsx`:
  - Pantalla de ajustes 100% funcional sin conexión a internet, validación local pura y sin enlaces externos ni políticas en línea (RF-003, RF-005).

---

## Organización por capa

### Capa 1: Lógica de negocio
1. No importa componentes visuales de React Native (`View`, `Text`, `StyleSheet`) ni colores del tema.
2. La degradación a memoria ante errores de persistencia se resuelve en la capa de contexto (`StudySessionContext` y `SettingsContext`), manteniendo la sesión viva en React state sin truncar el ciclo.
3. El cálculo temporal y la recuperación tras cierre de app dependen enteramente de funciones puras en `src/utils/` evaluando marcas locales `Date.now()`.
4. El respaldo de vibración ante fallos de audio se encapsula en `src/services/notificationService.ts`.

### Capa 2: Diseño e interfaz
1. Componentes visuales puros (`StudyTimer`, `SessionMessage`, `StudyTimerControls`, `NotificationPermissionModal`) reciben estado y callbacks mediante `props`.
2. Las pantallas `index.tsx` y `settings.tsx` se limitan a orquestar los hooks de contexto y presentar los componentes sin lógica de timestamps ni acceso directo a disco.
3. No existen vistas de registro, login, tutoriales, banners de conectividad ni enlaces a sitios externos.

---

## Algoritmo en pseudocódigo

### Manejo de persistencia con degradación suave a memoria (RF-007, Decisión 4)

```text
funcion commitSesion(siguienteSesion):
  intento:
    ejecutar saveStudySession(siguienteSesion) en almacenamiento local
    actualizarEstadoSesion(siguienteSesion)
    limpiarAdvertenciaAlmacenamiento()
    retornar VERDADERO
  captura error:
    // Degradación suave: la sesión continúa en memoria
    actualizarEstadoSesion(siguienteSesion)
    establecerAdvertencia(
      "No se pudieron guardar los cambios en el dispositivo. La sesión continuará en memoria mientras la aplicación esté abierta."
    )
    retornar VERDADERO
```

### Gestión de avisos con respaldo de vibración ante degradación de audio (RF-004, Decisión 3)

```text
funcion dispararAvisoFinFase(faseActual):
  activarModalAlarmaVisual(faseActual)
  iniciarVibracionRespaldo()
  
  intento:
    reproducirSonidoAlarma()
  captura errorAudio:
    // Si el canal de audio o el altavoz fallan, la vibración ya está activa
    registrarFalloSilencioso("Audio no disponible, respaldo táctil activo")
```

### Inicio no intrusivo y gestión de permisos sin insistencia (RF-008, Decisión 6)

```text
funcion iniciarTemporizador():
  detenerAlarmaSiActiva()
  si estadoSesion == "running":
    retornar

  permiso = obtenerEstadoPermisoNotificaciones()
  si NO permiso.otorgado Y NO haDescartadoModalPermiso Y permiso.puedePreguntar:
    mostrarModalPermisoNotificacion(VERDADERO)
    retornar

  si NO permiso.otorgado:
    establecerAdvertencia("No recibirás avisos fuera de la app. Puedes activarlos en los ajustes.")
    ejecutarInicioEnMemoria(permitirNotificaciones = FALSO)
  si no:
    ejecutarInicioEnMemoria(permitirNotificaciones = VERDADERO)
```

### Restauración de sesión offline basada en marcas de tiempo locales (RF-009, Decisión 7)

```text
funcion alReabrirAppOVolverAPrimerPlano():
  tiempoActual = Date.now()
  recuperacion = evaluarRecuperacionSesion(sesionActual, tiempoActual, duracionesFase)
  
  si recuperacion.sesion != sesionActual:
    sesionActualizada = recuperacion.sesion
    commitSesion(sesionActualizada)

  si recuperacion.anomalia == "phaseCompletedInAbsence":
    establecerInformacion("La fase terminó mientras la app estaba cerrada.")
    dispararAvisoFinFase(recuperacion.faseFinalizada)
```

---

## Datos del estudiante y acciones destructivas

- **Datos persistidos estrictamente limitados (RF-006, Decisión 8):**
  - Ajustes de temporizador: clave `@pomodoro_settings` con 4 números enteros (`studyDurationMinutes`, `shortBreakMinutes`, `longBreakMinutes`, `cycleTarget`).
  - Sesión activa: clave `pomodoro.activeSession` con estado de fase, duración, marcas de tiempo relativas y conteo del ciclo.
  - Cero recopilación de nombres, identificadores de dispositivo, direcciones IP, credenciales o analítica de uso.
- **Acciones destructivas:**
  - Reinicio del temporizador solicita confirmación explícita mediante `RestartConfirmation` antes de descartar el conteo en curso.
  - Restablecimiento de ajustes solicita confirmación explícita mediante `ResetSettingsModal` antes de restaurar a 25/5/15/4.
- **Degradación ante fallos:**
  - Si el almacenamiento local falla, los datos continúan en memoria activa de React sin perder el progreso del estudiante durante su sesión.

---

## Decisiones técnicas y alternativas descartadas

1. **Degradación a memoria activa ante fallo de almacenamiento (Decisión 4):**
   - *Adoptada:* Si `AsyncStorage` arroja error de escritura (ej. almacenamiento lleno o error de permisos de disco), la sesión actualiza el estado en memoria de React y emite un mensaje no bloqueante. El estudiante no pierde su sesión de estudio en curso.
   - *Descartada:* Bloquear la aplicación con pantalla de error fatal o abortar la acción impidiendo continuar el temporizador.
2. **Cero indicadores de conectividad (Decisión 2):**
   - *Adoptada:* La aplicación opera sin ningún elemento gráfico referente a internet (sin textos "Modo offline" ni iconos de red).
   - *Descartada:* Mostrar un banner superior indicando "Sin conexión a internet". Esto introduciría ruido visual y distracción innecesaria, ya que la aplicación nunca requiere conexión.
3. **Respaldo de vibración ante fallos de audio (Decisión 3):**
   - *Adoptada:* Iniciar la vibración rítmica de alarma concurrentemente con la señal visual y sonora; si el canal de audio del sistema operativo o el altavoz se degradan, la vibración física asegura la recepción del aviso sin lanzar excepciones.
   - *Descartada:* Reintentar agresivamente la reproducción de audio en bucle bloqueante o lanzar un diálogo de error de sonido.
4. **Solicitud de permisos de notificación no intrusiva y sin repetición (Decisión 6):**
   - *Adoptada:* Solicitar el permiso una sola vez mediante diálogo formativo de la Academia Cotopaxi. Si el usuario cancela o deniega, se inicia el temporizador con avisos en primer plano y no se vuelve a desplegar el modal en inicios posteriores.
   - *Descartada:* Impedir el uso del temporizador hasta que el estudiante active el permiso, o insistir con el diálogo cada vez que pulse "Iniciar".
5. **Restauración offline 100% local (Decisión 7):**
   - *Adoptada:* Calcular el tiempo transcurrido estrictamente con `Date.now()` respecto al `endTimestamp` guardado en el dispositivo, detectando fases culminadas en ausencia sin requerir servidores de hora de red.
   - *Descartada:* Descartar la sesión en curso si la app se cerró o intentar sincronizar la hora con un servidor NTP.

---

## Estrategia de pruebas

### Pruebas unitarias automatizadas con Jest (`npx jest`)

- `notificationService.test.ts`:
  - Verificación de que `startAlarmVibration` no arroja excepciones si el hardware de vibración falla.
  - Comprobación de que la solicitud de permisos retorna advertencia amigable sin lanzar errores fatales.
  - Cancelación y programación de notificaciones sin fallos ante módulos nativos desconectados.
- `sessionStorage.test.ts` y `settingsStorage.test.ts`:
  - Simulación de fallo de escritura (`AsyncStorage.setItem` arrojando excepción de E/S o espacio lleno).
  - Verificación de que los contratos de datos almacenados no contienen identificadores de usuario, correos ni telemetría (RF-006).
  - Manejo de lectura corrupta recuperando valores por defecto de forma segura.
- `StudySessionContext.test.tsx`:
  - Prueba de degradación a memoria (RF-007): simular error en `saveStudySession` al iniciar, pausar o reiniciar; verificar que la sesión cambia de estado en memoria (`status: "running"`, etc.) y se despliega la advertencia no bloqueante sin interrumpir el temporizador.
  - Prueba de rechazo de permisos (RF-008): simular descarte del modal de permisos; verificar que el temporizador arranca con avisos en primer plano y que futuros arranques no vuelven a mostrar el modal.
  - Prueba de restauración offline tras cierre (RF-009): simular sesión corriendo con timestamp final pasado; verificar que al sincronizar se marca la fase como completada y se notifica sin peticiones de red.
- `SettingsContext.test.tsx`:
  - Simulación de error de escritura al guardar ajustes; verificar que los ajustes se actualizan en memoria y se propagan a la sesión.
- `SessionMessage.test.tsx`:
  - Verificación del renderizado de advertencias de degradación a memoria en color Cotopaxi sin bloquear la pantalla ni botones de acción.

### Verificación manual en dispositivo móvil / APK (según `rn-conventions`)

- **Instalación limpia y primer inicio (RF-001):**
  - Instalar el APK en un dispositivo o emulador sin datos previos.
  - Abrir la app: corroborar que se entra directo a la pantalla principal con el reloj en `25:00` y fase `Estudio`, sin pantallas de bienvenida, login ni tutoriales.
- **Modo avión continuo (RF-002, RF-003, RF-005):**
  - Activar Modo Avión (sin Wi-Fi y sin datos móviles).
  - Usar la aplicación completa: iniciar, pausar, reiniciar, modificar duraciones en ajustes a `30/10/20/3`, restablecer ajustes.
  - Corroborar que no aparece ningún banner ni alerta de falta de conexión, y no hay anuncios ni enlaces externos.
- **Degradación de audio a vibración (RF-004):**
  - Silenciar el altavoz multimedia del dispositivo y esperar a que el temporizador llegue a cero.
  - Corroborar que el dispositivo vibra rítmicamente y la pantalla de alarma visual se presenta con el botón «Detener aviso».
- **Rechazo de permisos (RF-008):**
  - En una instalación limpia, presionar «Iniciar» por primera vez.
  - En el modal de permisos, presionar «Continuar sin avisos».
  - Corroborar que el temporizador arranca de inmediato a contar, muestra el aviso de advertencia no bloqueante y al pausar y volver a iniciar no vuelve a mostrar el modal.
- **Restauración offline tras cierre forzado (RF-009):**
  - Iniciar una sesión en Modo Avión, salir de la aplicación y forzar el cierre desde la lista de aplicaciones recientes.
  - Reabrir la aplicación varios minutos después (o tras expirar el tiempo): corroborar que la app deduce el tiempo exacto por marcas locales y muestra la fase completada o el tiempo restante exacto.

---

## Cobertura de requisitos

- **RF-001:** `index.tsx` (apertura directa al temporizador a 25:00 en reposo sin registro ni bienvenida).
- **RF-002:** `index.tsx`, `settings.tsx`, `SessionMessage.tsx` (ausencia absoluta de avisos o indicadores de conectividad).
- **RF-003:** Arquitectura global offline con recursos locales (`src/services/`, `src/utils/`, fuentes e iconos del paquete).
- **RF-004:** `notificationService.ts`, `StudySessionContext.tsx` (respaldo por vibración rítmica y tolerancia a fallos de audio).
- **RF-005:** `index.tsx`, `settings.tsx`, `package.json` (cero anuncios, cero rastreadores, cero enlaces externos).
- **RF-006:** `sessionStorage.ts`, `settingsStorage.ts` (persistencia estricta sin identificadores ni datos sensibles).
- **RF-007:** `StudySessionContext.tsx`, `SettingsContext.tsx`, `SessionMessage.tsx` (degradación suave a memoria ante fallos de persistencia con advertencia no bloqueante).
- **RF-008:** `StudySessionContext.tsx`, `NotificationPermissionModal.tsx` (solicitud no intrusiva de permisos, continuidad ante rechazo y no reincidencia).
- **RF-009:** `sessionRecovery.ts`, `StudySessionContext.tsx` (restauración temporal offline exacta mediante marcas de tiempo locales).
- **RNF-001 a RNF-005:** Cero consumo de red, recursos empaquetados, privacidad total, inicio inmediato y recuperación suave ante fallos de hardware o disco.

---

## Criterio de salida de la planificación

Se formulan 6 tareas de implementación de 20 a 30 minutos de duración máxima estimada, ordenadas estrictamente por dependencias (servicios → almacenamiento → contextos de Capa 1 → interfaz de Capa 2 → verificación integral). No se requiere dividir la spec.
