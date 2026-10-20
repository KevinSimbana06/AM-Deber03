# Plan de implementación — Spec 004: Recibir aviso al terminar el tiempo

> La spec está aprobada y cubre RF-001 a RF-012 y RNF-001 a RNF-005. Este plan implementa
> el canal de alarma nativo en Android (audible en silencio), el patrón de vibración rítmico,
> la detención inmediata desde la notificación («Detener» y toque en cuerpo) y desde la interfaz
> mediante un modal prominente, el corte automático de seguridad a los 60 segundos, y el flujo
> de permisos sin fricción (modal previo, banner no bloqueante y enlace a ajustes). No se requieren
> dependencias externas adicionales.

---

## Decisiones técnicas y de diseño resueltas

- **Decisión 1:** Mostrar un modal explicativo con la paleta de la Academia Cotopaxi antes de invocar la solicitud de permisos del sistema; si el estudiante lo rechaza, permitir iniciar el temporizador de todos modos con un banner visible de advertencia no bloqueante informando que no recibirá avisos fuera de la app.
- **Decisión 2:** Reproducir el sonido y la vibración en bucle continuo de alarma hasta que el estudiante la detenga de forma explícita, o hasta alcanzar el límite de seguridad de 60 segundos tras el cual cesa automáticamente.
- **Decisión 3:** Mostrar en primer plano una pantalla/modal superpuesto prominente («¡Fase finalizada!») con un botón de gran tamaño («Detener aviso») que silencia la alarma y deja visible la siguiente fase preparada y detenida.
- **Decisión 4:** Configurar en `expo-notifications` una categoría interactiva con el botón de acción «Detener» para silenciar la alarma directamente desde la pantalla de bloqueo sin abrir la app; y si se toca el cuerpo de la notificación, silenciarla inmediatamente, abrir la app y mostrar la siguiente fase preparada.
- **Decisión 5:** Configurar el canal de notificación de Android con `importance: AndroidImportance.MAX`, `usage: AndroidAudioUsage.ALARM`, `contentType: AndroidAudioContentType.SONIFICATION` y visibilidad pública en pantalla de bloqueo, permitiendo que el sistema emita la alarma en modo silencio o vibración sin librerías externas.
- **Decisión 6:** Títulos y cuerpos motivadores y diferenciados según la fase concluida:
  - Fin de estudio: *«¡Estudio terminado!»* — *«Bien hecho. Listo para descanso corto (5 min)»* o *(15 min)* si completó el ciclo.
  - Fin de descanso: *«¡Descanso terminado!»* — *«Tiempo de concentrarse en la siguiente sesión de estudio»*.
- **Decisión 7:** Si el permiso fue denegado en el sistema e impide solicitudes directas, ofrecer en el mensaje de advertencia un botón «Abrir ajustes» (`Linking.openSettings()`) y la opción de «Continuar sin avisos».
- **Decisión 8:** Patrón de vibración rítmico tipo alarma `[0, 500, 250, 500, 250, 500]` gestionado con `Vibration` de React Native y cancelación inmediata (`Vibration.cancel()`), con manejo tolerante en dispositivos sin motor de vibración.

---

## Archivos y responsabilidades

### Capa 1 — Lógica de negocio (sin componentes de UI ni colores)

- `src/types/pomodoro.ts`:
  - Extender tipos para incluir el estado de la alarma en la sesión o contexto (`isAlarmActive: boolean`, `alarmPhase?: PomodoroPhase`).
  - Contratos de contenido de notificaciones y acciones (`NotificationContent`, `AlarmActionType`).
- `src/utils/alarmMessages.ts` y `src/utils/alarmMessages.test.ts`:
  - Funciones puras para generar los textos exactos de notificación y modales según la fase terminada, la fase siguiente y su duración en minutos.
  - Función pura de verificación de límite de 60 segundos de alarma (`isAlarmExpired(startedTimestamp, currentTimestamp)`).
- `src/services/notificationService.ts` y `src/services/notificationService.test.ts`:
  - Configurar canal de alarma en Android con `AndroidImportance.MAX`, `usage: AndroidAudioUsage.ALARM` y patrón de vibración `[0, 500, 250, 500, 250, 500]`.
  - Configurar categoría de notificación interactiva `ALARM_CATEGORY` con botón de acción `Detener` (`opensAppToForeground: false`).
  - Registrar listener de respuesta a notificaciones (`addNotificationResponseReceivedListener`) para capturar la acción `Detener` o el toque en el cuerpo.
  - Control de vibración con React Native `Vibration` (`vibrate` rítmico continuo y `cancel`), tolerante ante plataformas sin vibrador.
  - Reprogramación con los textos específicos definidos en la Decisión 6.
- `src/context/StudySessionContext.tsx` y `src/context/StudySessionContext.test.tsx`:
  - Gestionar el estado de alarma activa (`isAlarmActive`, `alarmPhase`).
  - Desencadenar el temporizador de corte automático a los 60 segundos para silenciar la alarma desatendida.
  - Integrar listener de notificaciones para silenciar la alarma cuando el usuario presiona «Detener» en la notificación o toca su cuerpo.
  - Exponer método `stopAlarm()` que detiene el sonido, cancela la vibración, oculta el modal y asegura que la siguiente fase quede lista y detenida.
  - Gestionar el flujo de permisos: `permissionModalVisible`, `requestPermission()`, `dismissPermissionModal()`, advertencia de permisos denegados con acción `openSettings()`.

### Capa 2 — Diseño e interfaz (sin llamadas a storage ni cálculos de timestamps)

- `src/constants/theme.ts`:
  - Paleta institucional sobre fondo blanco: botones de acción en `navyBrand`, botón «Detener aviso» con alta visibilidad y contraste accesible (WCAG ≥ 4.5:1), y tokens de espaciado/radio.
- `src/components/AlarmActiveModal.tsx` y `src/components/AlarmActiveModal.test.tsx`:
  - Modal superpuesto prominente («¡Fase finalizada!») accesible con una sola mano.
  - Botón grande «Detener aviso» con `accessibilityLabel="Detener aviso de fin de fase"`.
  - Muestra texto claro de la fase que terminó y la siguiente fase preparada.
- `src/components/NotificationPermissionModal.tsx` y `src/components/NotificationPermissionModal.test.tsx`:
  - Modal explicativo con identidad Academia Cotopaxi previo a la solicitud del sistema.
  - Botón primario «Permitir avisos» y botón secundario «Continuar sin avisos».
- `src/components/SessionMessage.tsx`:
  - Extender para soportar botón de acción «Abrir ajustes» en la advertencia de permisos denegados.
- `src/app/index.tsx`:
  - Montar los componentes modales conectados al contexto.
  - Garantizar que la siguiente fase se visualice preparada y detenida tras silenciar la alarma.

---

## Organización por capa

### Capa 1: Lógica de negocio
1. Las funciones en `src/utils/alarmMessages.ts` son puras y formulan los textos en español sin dependencias de React ni Expo.
2. `src/services/notificationService.ts` encapsula las llamadas nativas a `expo-notifications`, `Vibration` y `Linking`.
3. `src/context/StudySessionContext.tsx` coordina la máquina de estados del temporizador con el estado de alarma y el ciclo de permisos.

### Capa 2: Diseño e interfaz
1. Los modales `AlarmActiveModal` y `NotificationPermissionModal` son componentes puramente presentacionales que reciben estado y callbacks (`onStop`, `onConfirm`, `onCancel`) vía `props`.
2. Toda la presentación cumple la paleta de la Academia Cotopaxi y estándares de contraste WCAG ≥ 4.5:1.
3. No se realizan llamadas a servicios nativos desde componentes o pantallas.

---

## Algoritmo en pseudocódigo

### Activación de alarma al llegar a cero o detectar fase vencida

```text
funcion activarAlarma(faseTerminada, siguienteFase, duracionSiguienteMinutos):
  contenido = generarTextosAviso(faseTerminada, siguienteFase, duracionSiguienteMinutos)
  iniciarVibracionRitmica([0, 500, 250, 500, 250, 500])
  estadoAlarma.activa = verdadero
  estadoAlarma.marcaInicio = ahora()

  // Límite de seguridad de 60 segundos
  programarCorteAutomatico(60000, funcion():
    si estadoAlarma.activa:
      silenciarAlarma()
  )

funcion silenciarAlarma():
  detenerVibracion()
  descartarNotificacionesDeBandeja()
  estadoAlarma.activa = falso
  estadoAlarma.marcaInicio = nulo
```

### Respuesta a eventos de notificación interactiva

```text
alRecibirRespuestaNotificacion(respuesta):
  si respuesta.actionIdentifier == "DETENER_AVISO":
    silenciarAlarma()
  si no (toque en el cuerpo de la notificación):
    silenciarAlarma()
    traerAppAlPrimerPlano()
```

### Solicitud de permiso con modal explicativo

```text
alIniciarTemporizadorPorPrimeraVez():
  si no tienePermisoNotificaciones y no seHaPreguntadoAntes:
    mostrarModalExplicativoPermisos()
    retornar

alConfirmarModalExplicativo():
  ocultarModalExplicativo()
  resultado = solicitarPermisoSistema()
  si resultado == "concedido":
    guardarPreferenciaPermiso(verdadero)
    iniciarSesion()
  si no:
    guardarPreferenciaPermiso(falso)
    mostrarAdvertenciaNoBloqueante("No recibirás avisos fuera de la app.")
    iniciarSesion()
```

---

## Datos del estudiante y acciones destructivas

- **Persistencia y privacidad:** No se almacenan cuentas, credenciales ni información privada. Solo se persiste localmente si el estudiante decidió continuar sin avisos para evitar mostrar el modal explicativo en cada inicio.
- **Acciones destructivas:** Silenciar la alarma no destruye la sesión ni reinicia el contador: mantiene intacto el conteo de pomodoros acumulados y deja lista la siguiente fase preparada y detenida.
- **Seguridad del dispositivo:** El temporizador de seguridad de 60 segundos previene el sobrecalentamiento del vibrador y el agotamiento de la batería ante alarmas no atendidas.

---

## Decisiones técnicas y alternativas descartadas

1. **Canal de alarma nativo en Android vs. librería de sonido `expo-av`:**
   - *Adoptada (Decisión 5):* Uso de canal de notificación con `AndroidAudioUsage.ALARM`. No añade paquetes pesados externos y funciona en modo silencio de manera estándar.
   - *Descartada:* Instalar `expo-av`, que requeriría assets de audio locales adicionales y gestión compleja del foco de audio en segundo plano.
2. **Acción «Detener» en la notificación interactiva:**
   - *Adoptada (Decisión 4):* `setNotificationCategoryAsync` con acción interactiva. Permite detener la alarma desde la pantalla de bloqueo sin abrir la app.
   - *Descartada:* Obligar al estudiante a desbloquear el teléfono y abrir la app para silenciar el aviso.
3. **Modal prominente vs. botón ordinario en pantalla:**
   - *Adoptada (Decisión 3):* Modal superpuesto con botón gigante «Detener aviso». Evita toques erróneos en «Reiniciar» o «Ajustes» mientras suena la alarma.
   - *Descartada:* Cambiar simplemente el botón de Iniciar por Detener en la botonera principal.
4. **Corte automático a los 60 segundos:**
   - *Adoptada (Decisión 2):* Silenciamiento automático tras 60 segundos.
   - *Descartada:* Vibración infinita hasta agotar batería o sonido puntual de 2 segundos que pasa desapercibido.
5. **Modal explicativo previo no bloqueante vs. alerta directa del sistema:**
   - *Adoptada (Decisión 1 y 7):* Explicación previa institucional Cotopaxi con opción de continuar sin avisos y botón a ajustes si se denegó. Cero fricción (Constitución #1).
   - *Descartada:* Bloquear el inicio del temporizador si el usuario rechaza las notificaciones.

---

## Estrategia de pruebas

### Pruebas unitarias automatizadas con Jest (`npx jest`)

- `alarmMessages.test.ts`:
  - Textos de notificación para fin de estudio con descanso corto (5 min).
  - Textos de notificación para fin de estudio con descanso largo (15 min) al completar el objetivo.
  - Textos de notificación para fin de descanso corto y descanso largo.
  - Verificación del cálculo de expiración de 60 segundos.
- `notificationService.test.ts`:
  - Configuración del canal con `AndroidAudioUsage.ALARM` y prioridad máxima.
  - Registro de categoría con acción «Detener».
  - Invocación de `Vibration.vibrate` con patrón rítmico y `Vibration.cancel`.
  - Tolerancia cuando `Vibration` no está disponible o falla.
  - Despacho de listeners de respuesta a notificación.
- `StudySessionContext.test.tsx`:
  - Activación de alarma (`isAlarmActive: true`) al completarse la fase.
  - Detención de alarma con `stopAlarm()`, silenciando vibración y dejando siguiente fase preparada.
  - Corte automático de alarma tras 60 segundos.
  - Detención mediante acción remota de notificación («Detener»).
  - Flujo de solicitud y rechazo de permisos con advertencia no bloqueante.
- `AlarmActiveModal.test.tsx` y `NotificationPermissionModal.test.tsx`:
  - Renderizado correcto de textos, botones y disparo de callbacks `onStop`, `onConfirm`, `onCancel`.

### Verificación manual en dispositivo móvil / APK

- Dejar que el temporizador llegue a cero con el teléfono en modo silencio: verificar que emite sonido de alarma y vibración rítmica perceptible.
- Verificar que la notificación en pantalla de bloqueo incluye el botón «Detener» y que al presionarlo se silencia la alarma sin abrir la app.
- Tocar el cuerpo de la notificación: verificar que silencia la alarma, abre la app y muestra la siguiente fase preparada.
- Abrir la app mientras suena la alarma: verificar la aparición del modal prominente y que el botón «Detener aviso» silencia el aviso al instante.
- Dejar el aviso sonar sin tocar el teléfono: verificar que se silencia solo a los 60 segundos exactos.
- Probar primera ejecución: verificar modal explicativo institucional antes del diálogo del sistema.
- Denegar permisos: verificar que el temporizador inicia con advertencia visible y que el botón «Abrir ajustes» redirige a la configuración de la app.

---

## Cobertura de requisitos

- **RF-001:** `NotificationPermissionModal`, `StudySessionContext`.
- **RF-002:** `StudySessionContext`, `SessionMessage` (advertencia visible no bloqueante).
- **RF-003:** `SessionMessage` con enlace a ajustes vía `Linking.openSettings()`.
- **RF-004:** `notificationService.ts` (canal sonoro y vibración rítmica), `alarmMessages.ts`.
- **RF-005:** `notificationService.ts` (`AndroidAudioUsage.ALARM`, visibilidad pública en lockscreen).
- **RF-006:** `alarmMessages.ts` (textos diferenciados para estudio y descanso).
- **RF-007:** `StudySessionContext` (temporizador de seguridad de 60 segundos).
- **RF-008 y RF-009:** `AlarmActiveModal.tsx`, `StudySessionContext` (`stopAlarm`).
- **RF-010 y RF-011:** `notificationService.ts` (categoría interactiva con acción «Detener» y listener de respuesta).
- **RF-012:** `notificationService.ts` (envoltorio seguro de `Vibration`).
- **RNF-001 a RNF-005:** Operación 100% offline, latencia < 100 ms al detener, ahorro de batería con corte a 60s, sin datos sensibles.

---

## Criterio de salida de la planificación

Se formulan 7 tareas de implementación ordenadas por dependencias, cada una acotada a un tiempo máximo estimado de 20 a 30 minutos. No se requiere dividir la spec.
