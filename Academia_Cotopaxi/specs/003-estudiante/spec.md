# Spec 003 — Mantener el conteo con el celular bloqueado o la app cerrada

Estado: aprobado
HU de origen: docs/historias/HU-003.md

## Contexto y objetivo

El estudiante necesita tener la seguridad de que el tiempo de su sesión de estudio o descanso se registrará con total exactitud sin importar si bloquea la pantalla de su teléfono o cierra la aplicación. Asimismo, si el tiempo de una fase culmina mientras la aplicación no está activa, el estudiante debe recibir el aviso correspondiente a tiempo y encontrar al regresar un estado consistente y comprensible, con la siguiente fase preparada y detenida y el avance de su ciclo debidamente preservado.

## Usuarios

- Estudiante de la Academia Cotopaxi.

## Historias de usuario

Como estudiante, quiero que el temporizador siga contando aunque bloquee el celular o cierre la aplicación, para no perder el tiempo que llevo estudiando.

## Definiciones

- **Fase en curso:** fase de estudio, descanso corto o descanso largo que se encuentra actualmente en cuenta regresiva activa.
- **Fase pausada:** fase que fue iniciada pero cuya cuenta regresiva fue detenida voluntariamente por el estudiante, manteniendo un tiempo restante menor a su duración inicial.
- **Fase preparada:** fase seleccionada por el ciclo Pomodoro que muestra su duración inicial completa y permanece detenida esperando la acción del estudiante para iniciar.
- **Aviso de fin:** señal sonora y de vibración emitida en el dispositivo al completarse la duración de una fase.
- **Hora real de finalización:** instante temporal absoluto calculado al iniciar o reanudar una fase (`tiempo actual + tiempo restante`), independiente de la ejecución activa de la aplicación en pantalla.
- **Inactividad prolongada:** período superior a 24 horas transcurrido desde la culminación o pausa de una fase sin interacción del estudiante en la aplicación.

## Requisitos funcionales

- **RF-001:** MIENTRAS el temporizador esté en curso y la pantalla del celular se bloquee o la aplicación pase a segundo plano, EL SISTEMA calculará el tiempo restante con base en la hora real transcurrida, mostrando el tiempo exacto al desbloquear el dispositivo o reanudar la aplicación.
  **Origen:** Escenario «Bloquear el celular» de HU-003 y principio 5 de `docs/constitution.md`.

- **RF-002:** CUANDO el estudiante vuelva a abrir la aplicación tras haberla cerrado con una fase en curso y el tiempo restante no haya llegado a cero, EL SISTEMA recuperará la sesión activa y mostrará el tiempo restante exacto calculado a partir de la hora real de finalización.
  **Origen:** Escenario «Cerrar la aplicación» de HU-003 y principio 5 de `docs/constitution.md`.

- **RF-003:** CUANDO el tiempo de una fase en curso se cumpla mientras la aplicación está cerrada o con la pantalla bloqueada, EL SISTEMA emitirá en el dispositivo el aviso sonoro y de vibración programado en el momento exacto de finalización.
  **Origen:** Escenario «El tiempo termina con la aplicación cerrada» de HU-003 y principio 5 de `docs/constitution.md`.

- **RF-004:** CUANDO el estudiante abra la aplicación después de que una fase haya concluido mientras la aplicación no estaba activa, EL SISTEMA dejará la siguiente fase preparada y detenida, actualizará el contador de pomodoros según corresponda y mostrará un mensaje visible informando que la fase anterior terminó en su ausencia.
  **Origen:** Escenario «El tiempo termina con la aplicación cerrada» de HU-003 y Decisión 1 de `decisiones.md`.

- **RF-005:** CUANDO el estudiante vuelva a abrir la aplicación tras haberla cerrado con el temporizador pausado dentro de las 24 horas siguientes, EL SISTEMA recuperará la sesión en estado pausado con el mismo tiempo restante que tenía al salir, sin emitir ningún aviso sonoro ni de vibración.
  **Origen:** Escenario «Pausar antes de cerrar» de HU-003 y Decisión 7 de `decisiones.md`.

- **RF-006:** CUANDO el estudiante pause o reinicie una sesión recuperada que estaba en curso, EL SISTEMA cancelará inmediatamente el aviso de finalización programado en el dispositivo para evitar alarmas erróneas posteriores.
  **Origen:** Decisión 2 de `decisiones.md`.

- **RF-007:** SI el reloj del sistema es modificado hacia atrás de tal forma que el tiempo restante calculado resulte mayor a la duración total configurada para la fase, ENTONCES EL SISTEMA limitará el tiempo restante a dicha duración inicial y mostrará una advertencia visible informando que la hora del dispositivo fue modificada.
  **Origen:** Decisión 3 de `decisiones.md`.

- **RF-008:** SI han transcurrido más de 24 horas desde que concluyó una fase sin que el estudiante haya abierto la aplicación, ENTONCES EL SISTEMA considerará el ciclo expirado por inactividad, reiniciará el contador de pomodoros a cero, dejará preparada y detenida la fase inicial de estudio y mostrará un aviso informativo explicando la expiración.
  **Origen:** Decisión 4 de `decisiones.md`.

- **RF-009:** SI una sesión pausada permanece sin reanudarse ni reiniciarse durante más de 24 horas, ENTONCES EL SISTEMA considerará la sesión expirada por inactividad, reiniciará el contador de pomodoros a cero, dejará preparada y detenida la fase inicial de estudio y mostrará un aviso informativo explicando la expiración.
  **Origen:** Decisión 7 de `decisiones.md`.

- **RF-010:** CUANDO el estudiante abra la aplicación habiéndose ya emitido el aviso de fin de fase en el dispositivo, EL SISTEMA retirará automáticamente la notificación correspondiente de la barra del sistema y presentará el estado directamente en pantalla.
  **Origen:** Decisión 5 de `decisiones.md`.

- **RF-011:** CUANDO el estudiante abra la aplicación con una sesión en curso que aún tiene tiempo restante y cuyo aviso nativo requiera reprogramación, EL SISTEMA reprogramará automáticamente el aviso de fin con el tiempo restante exacto; SI los permisos de notificación del dispositivo no estuvieran concedidos, ENTONCES EL SISTEMA mostrará una advertencia al respecto.
  **Origen:** Decisión 6 de `decisiones.md`.

- **RF-012:** SI se detectan datos guardados incompletos, corruptos o incompatibles al intentar restaurar la sesión activa, ENTONCES EL SISTEMA mostrará un aviso claro comunicando la imposibilidad de recuperar la sesión anterior, descartará únicamente dicho estado inválido y preparará una sesión nueva detenida lista con los valores configurados.
  **Origen:** Decisión 8 de `decisiones.md` y principio 7 de `docs/constitution.md`.

- **RF-013:** EL SISTEMA mantendrá la compatibilidad y recuperará de manera íntegra y transparente las sesiones guardadas válidas originadas en versiones previas de la aplicación.
  **Origen:** Decisión 8 de `decisiones.md` y principio 7 de `docs/constitution.md`.

## Requisitos no funcionales

- **RNF-001:** La aplicación y el control de sesiones operarán 100% de manera local y fuera de línea, sin exigir registro, inicio de sesión ni conexión a internet.
- **RNF-002:** El cálculo de tiempo no dependerá del refresco visual de la pantalla ni de temporizadores volátiles en memoria durante la suspensión de la aplicación.
- **RNF-003:** Las alarmas y avisos locales deberán programarse de modo que funcionen en el momento exacto aun cuando el dispositivo se encuentre bloqueado o con la aplicación cerrada.
- **RNF-004:** Toda condición irregular detectada al recuperar el estado (reloj alterado, inactividad superior a 24 horas o corrupción de datos) se informará de forma explícita y transparente al estudiante mediante mensajes visuales claros.
- **RNF-005:** No se recopilarán ni guardarán datos de carácter personal o confidencial del estudiante.

## Casos límite

- **Reinicio del dispositivo móvil:** Si el teléfono se apaga o reinicia mientras corre una fase, al reabrir la aplicación con tiempo pendiente, el sistema recalcula el tiempo restante a partir de la hora real y reprograma la alarma en el sistema operativo.
- **Apertura de la aplicación en el instante exacto de finalización:** Si la aplicación se abre en el milisegundo exacto en que expira la fase o inmediatamente después, se procesa como fase finalizada, preparando la siguiente fase detenida y mostrando el aviso en pantalla.
- **Retorno tras más de 24 horas:** Independientemente de si la sesión quedó corriendo o pausada, transcurridas más de 24 horas sin actividad se limpia el ciclo acumulado, volviendo a 0 pomodoros con aviso explícito.
- **Cambio deliberado o accidental del reloj del teléfono:** Si la hora del sistema se atrasa, el tiempo restante nunca excede la duración nominal de la fase y se muestra advertencia. Si la hora se adelanta más allá del tiempo de fin, se procesa la fase como finalizada.
- **Permisos de notificación deshabilitados:** Si el estudiante desactiva los avisos en la configuración del teléfono, la aplicación mantiene la exactitud del cálculo en pantalla y muestra una advertencia informativa de la falta de permisos al reprogramar o continuar la sesión.
- **Cierre repentino tras pausar:** Si la estudiante pausa y de inmediato expulsa la aplicación de la lista de tareas recientes, el tiempo restante pausado se conserva intacto al reabrir antes de las 24 horas.

## Fuera de alcance

- Encadenar automáticamente múltiples fases sucesivas (por ejemplo, pasar de estudio a descanso corto y de descanso corto a estudio) mientras la app está cerrada sin la presencia e inicio del estudiante.
- Crear alarmas con repetición infinita o tonos externos no provistos de forma local.
- Sincronización en la nube o seguimiento remoto de tiempos entre varios dispositivos.
- Modificar configuraciones globales del sistema operativo que escapen al estándar de permisos de notificaciones locales.
- Forzar la apertura o encendido automático de la pantalla si el sistema operativo del fabricante lo restringe de manera nativa.

## Criterios de finalización

- Todos los escenarios de HU-003 cuentan con requisitos funcionales explícitos y verificables en formato EARS.
- Se contemplan e integran formalmente las 8 decisiones tomadas en `decisiones.md`.
- El cálculo del tiempo en curso ante bloqueo o cierre de la aplicación se rige por la hora real de finalización y no por contadores volátiles en memoria.
- Al terminar el tiempo con la app cerrada se garantiza la emisión del aviso programado y, al reabrir, se presenta la siguiente fase preparada y detenida con mensaje visible.
- Al pausar o reiniciar una sesión restaurada se garantiza la cancelación del aviso nativo programado.
- Se gestionan de forma segura y advertida los escenarios de reloj retrasado, inactividad de más de 24 horas y datos corruptos.
- La spec está expresada estrictamente en términos del QUÉ y POR QUÉ funcional observable, sin referencias a nombres de archivos, carpetas, código ni arquitectura interna.

## Dudas abiertas

Ninguna.

## Revisión final de la spec

1. **Consistencia interna:** Los RF-001 a RF-013 son mutuamente consistentes; en particular, RF-004 respeta la regla de HU-002 de dejar la siguiente fase preparada y detenida mientras cumple HU-003 al visibilizar que la fase terminó en ausencia.
2. **Cobertura de la HU:** Los cuatro escenarios de HU-003 («Bloquear el celular», «Cerrar la aplicación», «El tiempo termina con la aplicación cerrada» y «Pausar antes de cerrar») se encuentran cubiertos en su totalidad por RF-001, RF-002, RF-003, RF-004 y RF-005.
3. **Alineación con la constitución:** Se respeta plenamente el principio 1 (sin cuentas, sin conexión, sin datos sensibles), el principio 5 (exactitud temporal por marcas de tiempo reales y notificaciones locales), y el principio 7 (los datos del estudiante se preservan y los datos corruptos se manejan explícitamente sin fallos silenciosos).
4. **Sin desbordamiento de alcance:** No se introducen detalles de implementación, nombres de archivos de código ni estructuras de carpetas en la spec.
