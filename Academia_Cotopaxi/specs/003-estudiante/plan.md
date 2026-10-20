# Plan de implementación — Spec 003: Mantener el conteo con el celular bloqueado o la app cerrada

> La spec está aprobada y cubre RF-001 a RF-013 y RNF-001 a RNF-005. Este plan extiende
> la gestión del temporizador para garantizar exactitud temporal ante bloqueo de pantalla o
> cierre de la aplicación, reprogramación y cancelación precisa de avisos nativos,
> detección de alteraciones en el reloj, expiración por inactividad (> 24 h), limpieza de
> notificaciones y migración segura a la versión 3 del contrato persistido. No se añaden dependencias nuevas.

## Decisiones de producto y arquitectura resueltas

- **Decisión 1:** Al volver a abrir la aplicación tras cumplirse el tiempo de una fase en ausencia, se pasa a la siguiente fase preparada y detenida (según HU-002), mostrando un mensaje visible que informa que la fase anterior concluyó mientras la aplicación no estaba activa.
- **Decisión 2:** Se almacena el identificador del aviso (`notificationId`) en la sesión activa persistida (`pomodoro.activeSession`) para cancelarlo de forma exacta al pausar o reiniciar tras reabrir la app.
- **Decisión 3:** Si el reloj del dispositivo cambia hacia atrás y el tiempo restante calculado supera la duración inicial de la fase, se limita el tiempo restante a dicha duración nominal y se muestra una advertencia en pantalla informando la modificación del reloj.
- **Decisión 4:** Si transcurren más de 24 horas desde que venció una sesión sin interacción, se considera el ciclo expirado por inactividad, se reinicia el contador de pomodoros a 0 de 4 y se deja la fase de Estudio inicial preparada y detenida con un aviso explicativo.
- **Decisión 5:** Al ingresar a la aplicación (tras haberse disparado un aviso de fin), se limpian automáticamente las notificaciones de la bandeja del sistema mediante `dismissAllNotificationsAsync()`.
- **Decisión 6:** Si la app se reabre con una sesión en curso que aún tiene tiempo pendiente (por ejemplo, tras reinicio del teléfono), se recalcula el tiempo restante y se reprograma automáticamente el aviso nativo en el sistema operativo; si faltan permisos de notificación, se muestra una advertencia.
- **Decisión 7:** Si una sesión pausada permanece más de 24 horas sin actividad, se considera expirada por inactividad, se reinicia el ciclo a 0 de 4 y se prepara la fase de Estudio inicial con mensaje explicativo.
- **Decisión 8:** El contrato persistido en `pomodoro.activeSession` evoluciona a la versión 3 (incorporando `notificationId: string | null` y `lastActiveTimestamp: number`), manteniendo migración transparente desde las versiones 1 y 2, y descartando datos corruptos con un aviso claro.

---

## Archivos y responsabilidades

### Capa 1 — Lógica de negocio (sin imports de UI ni colores)

- `src/types/pomodoro.ts`:
  - Actualizar `StudySession` a `version: 3`, agregando `notificationId: string | null` y `lastActiveTimestamp: number`.
  - Definir tipos de estado de recuperación (`SessionRecoveryResult`, anomalías por reloj o inactividad).
- `src/utils/timer.ts` y `src/utils/timer.test.ts`:
  - Mantener cálculo puro del tiempo restante mediante `endTimestamp - currentTimestamp` y formato `MM:SS`.
  - Añadir soporte para detección de reloj atrasado con limitación estricta al tope nominal de la fase.
  - Pruebas unitarias para cálculo exacto, reloj atrasado, reloj adelantado y tiempo agotado.
- `src/utils/sessionRecovery.ts` y `src/utils/sessionRecovery.test.ts`:
  - Funciones puras para evaluar el estado de la sesión al restaurar o al volver a primer plano:
    - Evaluación de inactividad de más de 24 horas (86.400.000 ms) para fases vencidas o pausadas, retornando sesión inicial de estudio (0 pomodoros) y mensaje explicativo.
    - Detección de finalización en ausencia (fase vencida dentro de las 24 horas), derivando la siguiente fase preparada y detenida con mensaje informativo.
    - Detección de reloj atrasado (`remainingSeconds > initialDurationSeconds`).
  - Pruebas unitarias exhaustivas con timestamps simulados cubriendo todos los casos límite de tiempo.
- `src/storage/sessionStorage.ts` y `src/storage/sessionStorage.test.ts`:
  - Elevar `STORAGE_VERSION` a 3.
  - Validar campos de versión 3 (`notificationId` como `string | null`, `lastActiveTimestamp` como número entero positivo).
  - Migración transparente y explícita desde versiones 1 y 2 hacia versión 3.
  - Rechazo explícito de versiones desconocidas o datos corruptos lanzando `StorageError("invalid", ...)` sin borrar archivos arbitrarios.
  - Pruebas unitarias de lectura, escritura, migración v1→v3 y v2→v3, datos corruptos y errores de persistencia.
- `src/services/notificationService.ts` y `src/services/notificationService.test.ts`:
  - Añadir `dismissAllNotifications(): Promise<void>` para limpiar la bandeja del sistema operativo al entrar a la app.
  - Robustecer `cancelFinishNotification(notificationId: string | null)` para asegurar cancelación exacta del ID guardado.
  - Proveer reprogramación del aviso de fin con retorno del nuevo identificador generado.
  - Pruebas unitarias de programación, cancelación, limpieza y manejo de permisos denegados.
- `src/context/StudySessionContext.tsx` y `src/context/StudySessionContext.test.tsx`:
  - Orquestar la carga inicial y el evento `AppState` (`active`):
    - Limpieza automática de la bandeja del sistema (`dismissAllNotifications`).
    - Evaluación pura de inactividad (> 24 h), reloj atrasado y fin en ausencia.
    - Reprogramación automática del aviso nativo si la sesión estaba en curso y tiene tiempo pendiente.
    - Cancelación precisa del aviso persistido al pausar o reiniciar.
    - Gestión de mensajes informativos (`info`), advertencias (`warning`) y errores (`error`).
    - Actualización de `lastActiveTimestamp` en cada transición o persistencia.
  - Pruebas unitarias completas simulando ciclo de vida, segundo plano, cierre, restauración, reloj manipulado y datos corruptos.

### Capa 2 — Diseño e interfaz (sin llamadas a storage ni cálculos temporales)

- `src/constants/theme.ts`:
  - Conservar la paleta oficial de la Academia Cotopaxi (plantilla activa sobre blanco: `navyBrand`, `gold`, `slate`, `white`, `danger`).
- `src/components/SessionMessage.tsx`:
  - Extender el componente para recibir y presentar mensajes informativos (`info`), advertencias (`warning`) y errores (`error`) con contraste accesible y estilo Cotopaxi.
- `src/components/StudyTimer.tsx`, `src/components/StudyTimerControls.tsx`, `src/components/PomodoroProgress.tsx`, `src/components/RestartConfirmation.tsx`:
  - Mantener como componentes visuales puros que reciben datos y callbacks por `props`.
- `src/app/index.tsx`:
  - Conectar el contexto con los componentes de la interfaz, visualizando los avisos de fase terminada en ausencia, inactividad o anomalías del reloj según las props del contexto.

---

## Organización por capa

### Capa 1: Lógica de negocio
1. Los contratos y esquemas definen sesión versión 3, preservando `notificationId` y `lastActiveTimestamp`.
2. Las funciones de `src/utils/` son puras y deterministas, recibiendo marcas de tiempo explícitas y duraciones sin depender del reloj global ni de componentes de React.
3. El almacenamiento valida rigurosamente los esquemas, efectúa migraciones declaradas y no repara datos corruptos silenciosamente.
4. El servicio nativo maneja permisos, programación, cancelación precisa y descarte de notificaciones en la bandeja del sistema.
5. El contexto centraliza `AppState`, coordina la persistencia atómica y expone un estado reactivo y mensajes limpios a la UI.

### Capa 2: Diseño e interfaz
1. Las pantallas y componentes no hacen operaciones asíncronas de almacenamiento ni programan notificaciones.
2. Toda la información temporal se recibe formateada o procesada desde el contexto.
3. Las advertencias y mensajes informativos se muestran en español con los colores normados en la paleta institucional de la Academia Cotopaxi.

---

## Algoritmo en pseudocódigo

### Restauración inicial y cambio a `AppState: "active"`

```text
funcion sincronizarEstadoSesion(sesionActual, marcaActual, duraciones):
  // 1. Limpieza de notificaciones del sistema
  descartarNotificacionesDeBandeja()

  // 2. Comprobar inactividad prolongada (> 24 horas = 86.400.000 ms)
  si sesionActual.status == "running" y sesionActual.endTimestamp != null:
    si (marcaActual - sesionActual.endTimestamp) > 24 horas:
      sesionLimpia = crearSesionInicialEstudio(duraciones)
      persistir(sesionLimpia)
      establecerMensajeInfo("El ciclo anterior expiró por inactividad (más de 24 horas). Se inició un nuevo ciclo de estudio.")
      retornar sesionLimpia

  si sesionActual.status == "paused":
    si (marcaActual - sesionActual.lastActiveTimestamp) > 24 horas:
      sesionLimpia = crearSesionInicialEstudio(duraciones)
      persistir(sesionLimpia)
      establecerMensajeInfo("La sesión pausada expiró por inactividad (más de 24 horas). Se inició un nuevo ciclo de estudio.")
      retornar sesionLimpia

  // 3. Comprobar reloj del sistema modificado hacia atrás
  si sesionActual.status == "running" y sesionActual.endTimestamp != null:
    tiempoCalculado = calcularRestante(sesionActual.endTimestamp, marcaActual)
    si tiempoCalculado > sesionActual.initialDurationSeconds:
      sesionCorregida = clonar(sesionActual)
      sesionCorregida.remainingSeconds = sesionActual.initialDurationSeconds
      sesionCorregida.endTimestamp = marcaActual + (sesionCorregida.remainingSeconds * 1000)
      persistir(sesionCorregida)
      establecerAdvertencia("Se detectó un cambio en el reloj del dispositivo. El tiempo restante se ajustó al máximo de la fase.")
      retornar sesionCorregida

  // 4. Comprobar fin de fase en curso mientras la app no estaba activa
  si sesionActual.status == "running" y sesionActual.endTimestamp != null:
    tiempoCalculado = calcularRestante(sesionActual.endTimestamp, marcaActual)
    si tiempoCalculado == 0:
      siguienteSesion = calcularSiguienteFasePreparada(sesionActual, duraciones)
      siguienteSesion.notificationId = null
      siguienteSesion.lastActiveTimestamp = marcaActual
      persistir(siguienteSesion)
      establecerMensajeInfo("La fase anterior terminó mientras la aplicación no estaba activa.")
      retornar siguienteSesion
    si no:
      // La sesión sigue corriendo con tiempo pendiente: verificar reprogramación de aviso
      nuevoIdAviso = reprogramarAvisoSiEsNecesario(sesionActual.endTimestamp, sesionActual.phase)
      sesionActualizada = clonar(sesionActual)
      sesionActualizada.remainingSeconds = tiempoCalculado
      sesionActualizada.notificationId = nuevoIdAviso
      sesionActualizada.lastActiveTimestamp = marcaActual
      persistir(sesionActualizada)
      retornar sesionActualizada

  retornar sesionActual
```

### Pausar y Reiniciar con cancelación exacta

```text
funcion pausarSesion(sesionActual, marcaActual):
  si sesionActual.status != "running":
    retornar
  sesionPausada = pausarPura(sesionActual, marcaActual)
  si sesionActual.notificationId != null:
    cancelarAvisoNativo(sesionActual.notificationId)
  sesionPausada.notificationId = null
  sesionPausada.lastActiveTimestamp = marcaActual
  persistir(sesionPausada)

funcion reiniciarSesion(sesionActual, confirmada):
  si no confirmada:
    retornar
  si sesionActual.notificationId != null:
    cancelarAvisoNativo(sesionActual.notificationId)
  nuevaSesion = crearSesionInicialEstudio()
  persistir(nuevaSesion)
```

---

## Datos del estudiante y acciones destructivas

- **Persistencia en `pomodoro.activeSession` (v3):** Se guardan versión, fase, estado, duración inicial, tiempo restante, `endTimestamp`, pomodoros completados, objetivo de ciclo, `notificationId` (o `null`) y `lastActiveTimestamp`. No se recogen cuentas ni datos personales.
- **Acciones destructivas:**
  - El reinicio del temporizador requiere confirmación explícita mediante diálogo modal.
  - La expiración por inactividad de más de 24 horas limpia el contador de pomodoros y devuelve a la fase inicial de estudio únicamente tras confirmar el paso del tiempo, informando de forma transparente la razón al estudiante.
- **Resguardo ante datos corruptos:** Si el contenido almacenado es inválido o no compatible, se informa al usuario mediante un mensaje visible, se descartan únicamente los datos inválidos y se inicializa una sesión limpia detenida con valores por defecto.

---

## Decisiones técnicas y alternativas descartadas

1. **Persistencia del identificador de notificación (`notificationId`):**
   - *Adoptada (Decisión 2):* Guardar el ID retornado por `expo-notifications` en el contrato v3 de la sesión activa para cancelar puntualmente la alarma programada.
   - *Descartada:* Depender únicamente de `cancelAllScheduledNotificationsAsync()`, lo cual podría interferir con avisos de otras funcionalidades o no garantizar cancelación si se reprograman tareas.
2. **Registro de última actividad (`lastActiveTimestamp`):**
   - *Adoptada (Decisiones 4, 7 y 8):* Registrar la marca de tiempo de la última interacción o finalización en el contrato para evaluar con exactitud matemática el umbral de 24 horas.
   - *Descartada:* Suponer que la sesión es reciente sin almacenar fecha absoluta o depender de marcas del sistema de archivos.
3. **Limpieza proactiva de bandeja:**
   - *Adoptada (Decisión 5):* Ejecutar `dismissAllNotificationsAsync()` al ingresar a la app en primer plano para evitar notificaciones residuales.
   - *Descartada:* Dejar que la notificación persista en la barra de estado obligando al estudiante a descartarla manualmente.
4. **Tratamiento de salto temporal negativo (reloj hacia atrás):**
   - *Adoptada (Decisión 3):* Limitar el tiempo restante a la duración nominal configurada y mostrar advertencia visible.
   - *Descartada:* Dejar que el temporizador incremente su tiempo por encima de la duración configurada o bloquear la app en estado de error irrecuperable.
5. **Evolución del contrato a versión 3 con soporte legacy v1 y v2:**
   - *Adoptada (Decisión 8):* Esquema v3 que migra automáticamente sesiones válidas previas sin pérdida de avance.
   - *Descartada:* Borrar el almacenamiento local o romper la compatibilidad con usuarios que ya tenían sesiones de HU-001 o HU-002.

---

## Estrategia de pruebas

### Pruebas unitarias automatizadas con Jest (`npx jest`)

- `timer.test.ts`:
  - Cálculo de tiempo restante con reloj modificado hacia atrás (comprobación de limitación al máximo).
  - Cálculo normal de tiempo restante y formato `MM:SS`.
- `sessionRecovery.test.ts`:
  - Inactividad > 24 horas tras vencer una fase (retorno a estudio con 0 pomodoros y aviso informativo).
  - Inactividad > 24 horas en sesión pausada (reinicio de ciclo y mensaje explicativo).
  - Retorno dentro de las 24 horas tras finalizar fase en ausencia (preparar siguiente fase detenida con mensaje visible).
  - Retorno con sesión en curso y tiempo restante válido.
- `sessionStorage.test.ts`:
  - Guardado y lectura de sesión versión 3 con `notificationId` y `lastActiveTimestamp`.
  - Migración explícita y transparente de sesiones v1 a v3.
  - Migración explícita y transparente de sesiones v2 a v3.
  - Detección y rechazo de JSON corrupto, campos faltantes y versiones desconocidas con error tipado `StorageError("invalid", ...)`.
- `notificationService.test.ts`:
  - Descarte de notificaciones en bandeja (`dismissAllNotifications`).
  - Cancelación exacta por `notificationId`.
  - Comportamiento en entornos sin permisos o sin módulo nativo disponible.
- `StudySessionContext.test.tsx`:
  - Recuperación de sesión corriendo al montar y en evento `AppState: "active"`.
  - Recuperación de sesión pausada tras cierre manteniendo tiempo sin avisos sonoros.
  - Cancelación de notificación programada al pausar y al reiniciar.
  - Presentación de advertencia ante reloj atrasado.
  - Presentación de aviso de inactividad de más de 24 horas.
  - Notificación de fase vencida en ausencia.
  - Manejo y aviso de datos corruptos al restaurar.

### Verificación manual en dispositivo móvil / APK

- Bloquear la pantalla con el temporizador corriendo durante 2 minutos; desbloquear y verificar que se descontaron exactamente los 2 minutos.
- Cerrar la app desde aplicaciones recientes con el temporizador corriendo; abrirla y comprobar que continúa desde el tiempo real exacto.
- Cerrar la app con el temporizador corriendo a falta de 1 minuto; esperar a que venza el tiempo, verificar aviso sonoro y vibración con celular bloqueado; abrir la app y comprobar que la siguiente fase está preparada y detenida con mensaje visible.
- Pausar la sesión, cerrar la app y reabrirla; comprobar que sigue pausada con el mismo tiempo y que no emite alarma.
- Pausar o reiniciar una sesión restaurada y verificar que la notificación programada no se dispara.
- Alterar el reloj del sistema hacia atrás y comprobar que la app limita el tiempo al valor nominal y muestra la advertencia.
- Simular o verificar inactividad mayor a 24 horas y corroborar el reinicio a 0 pomodoros con mensaje informativo.
- Descartar automáticamente la notificación de la barra de estado al entrar a la app.

---

## Cobertura de requisitos

- **RF-001:** `timer.ts`, `sessionRecovery.ts` y sincronización ante cambio de `AppState` en el contexto.
- **RF-002:** `sessionStorage.ts`, `sessionRecovery.ts` y restauración al montar `StudySessionContext`.
- **RF-003:** `notificationService.ts` y canal prioritario nativo con trigger por fecha absoluta.
- **RF-004:** `sessionRecovery.ts`, `phaseTransition.ts`, `StudySessionContext` y `SessionMessage`.
- **RF-005:** `sessionStorage.ts`, `sessionRecovery.ts` y `StudySessionContext`.
- **RF-006:** `notificationService.ts` (cancelación por ID), `session.ts` y callbacks en `StudySessionContext`.
- **RF-007:** `timer.ts`, `sessionRecovery.ts`, advertencia en contexto y `SessionMessage`.
- **RF-008:** `sessionRecovery.ts`, detección de 24 horas tras vencer, contexto y `SessionMessage`.
- **RF-009:** `sessionRecovery.ts`, detección de 24 horas en pausa, contexto y `SessionMessage`.
- **RF-010:** `notificationService.ts` (`dismissAllNotifications`) invocado en `StudySessionContext`.
- **RF-011:** Reprogramación en `StudySessionContext` y comprobación de permisos en `notificationService.ts`.
- **RF-012:** Validación en `sessionStorage.ts`, captura en contexto y mensaje de error en `SessionMessage`.
- **RF-013:** Esquema v3 y migradores declarativos de v1 y v2 en `sessionStorage.ts`.
- **RNF-001 y RNF-005:** Arquitectura local sin red, sin telemetría ni datos sensibles.
- **RNF-002 y RNF-003:** Cálculo basado en marcas de tiempo reales y notificaciones nativas programadas.
- **RNF-004:** Mensajes visuales explícitos para inactividad, reloj alterado y datos corruptos en `SessionMessage`.

---

## Criterio de salida de la planificación

Se definen 7 tareas de implementación, cada una acotada a un tiempo máximo estimado de 20 a 30 minutos, ordenadas estrictamente por dependencias (tipos → utilidades puras → almacenamiento → servicios → contexto → interfaz → verificación). No se requiere dividir la spec.
