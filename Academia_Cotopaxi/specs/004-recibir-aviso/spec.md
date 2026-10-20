# Spec 004 — Recibir aviso al terminar el tiempo

Estado: aprobado
HU de origen: docs/historias/HU-004.md

## Contexto y objetivo

El estudiante necesita recibir un aviso perceptible, confiable y claro cuando concluye un tiempo de estudio o descanso, sin verse obligado a mirar constantemente la pantalla del dispositivo. El aviso debe funcionar de forma consistente tanto si el teléfono tiene el sonido activado como si se encuentra en modo silencio o vibración, permitiendo al estudiante detener la alarma con rapidez desde la pantalla de bloqueo o desde la propia aplicación, respetando el ciclo de estudio sin generar fricción en la gestión de permisos.

## Usuarios

- Estudiante de la Academia Cotopaxi.

## Historias de usuario

Como estudiante, quiero que la aplicación me avise cuando termine el tiempo de estudio o de descanso, incluso con el celular en silencio, para cambiar de actividad sin estar mirando la pantalla.

## Definiciones

- **Aviso de fin:** señal sonora y de vibración emitida al completarse la duración de una fase.
- **Canal de alarma:** mecanismo del sistema que permite emitir sonido prioritario incluso cuando el teléfono está configurado en modo silencio o vibración.
- **Patrón de vibración rítmico:** secuencia pulsante y perceptible de vibración que acompaña al sonido de la alarma.
- **Límite de seguridad:** tiempo máximo continuo (60 segundos) tras el cual la alarma se silencia automáticamente si el estudiante no la detiene manualmente.
- **Fase preparada:** fase siguiente que queda seleccionada, muestra su duración nominal y permanece detenida esperando la acción del estudiante.

## Requisitos funcionales

- **RF-001:** CUANDO el estudiante inicie un temporizador por primera vez y la aplicación no cuente con permiso para emitir notificaciones, EL SISTEMA mostrará un mensaje explicativo antes de solicitar el permiso del dispositivo.
  **Origen:** Escenario «Permiso de notificaciones» de HU-004 y Decisión 1 de `decisiones.md`.

- **RF-002:** SI el estudiante no otorga el permiso de notificaciones solicitado, ENTONCES EL SISTEMA permitirá iniciar la sesión del temporizador y mostrará una advertencia visible no bloqueante informando que no se recibirán avisos al estar fuera de la aplicación.
  **Origen:** Decisión 1 de `decisiones.md` y principio 1 de `docs/constitution.md`.

- **RF-003:** SI el permiso de notificaciones se encuentra denegado en el dispositivo e impide nuevas solicitudes automáticas, ENTONCES EL SISTEMA ofrecerá en el mensaje informativo una opción directa para abrir los ajustes del teléfono y una opción para continuar sin avisos.
  **Origen:** Decisión 7 de `decisiones.md`.

- **RF-004:** CUANDO el tiempo de una fase llegue a cero y el dispositivo tenga el sonido activado, EL SISTEMA emitirá un aviso sonoro perceptible y un patrón de vibración rítmico, informando qué fase terminó.
  **Origen:** Escenario «Aviso con el celular en sonido» de HU-004 y Decisión 8 de `decisiones.md`.

- **RF-005:** CUANDO el tiempo de una fase llegue a cero y el dispositivo se encuentre en modo silencio o vibración, EL SISTEMA emitirá el aviso con nivel de prioridad de alarma sonora, vibración rítmica y notificación visible en la pantalla de bloqueo.
  **Origen:** Escenario «Aviso con el celular en silencio» de HU-004 y Decisión 5 de `decisiones.md`.

- **RF-006:** CUANDO concluya una fase, EL SISTEMA presentará un aviso con texto diferenciado según el tipo de fase completada: indicará «¡Estudio terminado!» junto a la duración del descanso que corresponde preparar (corto o largo), o «¡Descanso terminado!» motivando el inicio de la siguiente sesión de estudio.
  **Origen:** Escenario «Aviso con el celular en sonido» de HU-004 y Decisión 6 de `decisiones.md`.

- **RF-007:** MIENTRAS el aviso de fin esté sonando y vibrando sin haber sido detenido manualmente, EL SISTEMA mantendrá la emisión de alarma de forma continua durante un máximo de 60 segundos, tras lo cual se silenciará automáticamente para proteger el dispositivo.
  **Origen:** Decisión 2 de `decisiones.md`.

- **RF-008:** CUANDO la alarma esté activa y la aplicación esté visible en primer plano, EL SISTEMA mostrará un control visual prominente para detener el aviso inmediatamente.
  **Origen:** Escenario «Detener el aviso» de HU-004 y Decisión 3 de `decisiones.md`.

- **RF-009:** CUANDO el estudiante active el control para detener el aviso en la aplicación, EL SISTEMA silenciará el sonido, interrumpirá la vibración de inmediato y mostrará la siguiente fase preparada y detenida lista para iniciar.
  **Origen:** Escenario «Detener el aviso» de HU-004 y Decisiones 3 y 8 de `decisiones.md`.

- **RF-010:** CUANDO la notificación del aviso esté visible en el sistema y el estudiante presione la acción «Detener» en ella, EL SISTEMA silenciará la alarma sonora y la vibración directamente sin forzar la apertura de la aplicación.
  **Origen:** Escenario «Detener el aviso» de HU-004 y Decisión 4 de `decisiones.md`.

- **RF-011:** CUANDO el estudiante toque el cuerpo de la notificación de fin de fase, EL SISTEMA silenciará de inmediato la alarma sonora y la vibración, abrirá la aplicación y mostrará la siguiente fase preparada y detenida.
  **Origen:** Escenario «Detener el aviso» de HU-004 y Decisión 4 de `decisiones.md`.

- **RF-012:** SI el dispositivo móvil no cuenta con hardware de vibración o este se encuentra inhabilitado por el sistema, ENTONCES EL SISTEMA emitirá el aviso sonoro y visual sin interrumpir la sesión ni provocar errores al estudiante.
  **Origen:** Decisión 8 de `decisiones.md`.

## Requisitos no funcionales

- **RNF-001:** La emisión de avisos y la gestión de alarmas funcionarán de forma 100% local, sin conexión a internet, sin cuentas de usuario y sin publicidad.
- **RNF-002:** El aviso de fin de fase deberá sonar y vibrar en el instante exacto programado, aun cuando el celular esté con la pantalla bloqueada o la aplicación se encuentre cerrada.
- **RNF-003:** La respuesta a las acciones de detención (desde notificación o en pantalla) deberá ser inmediata, interrumpiendo el sonido y la vibración en menos de 100 ms.
- **RNF-004:** El sistema no consumirá batería de forma innecesaria tras un aviso desatendido gracias al límite de corte automático de 60 segundos.
- **RNF-005:** No se recopilarán, transmitirán ni registrarán datos personales o sensibles del estudiante.

## Casos límite

- **Notificaciones denegadas en el sistema:** El estudiante puede continuar utilizando el temporizador visual; se muestra un aviso informativo no bloqueante con acceso a la configuración del dispositivo.
- **Dispositivo sin soporte o con restricción de vibración:** La alarma sonora y visual opera normalmente sin fallos si el hardware de vibración no está disponible.
- **Aviso desatendido:** Si el estudiante no detiene la alarma, a los 60 segundos cesan automáticamente el sonido y la vibración, conservando la notificación y la siguiente fase preparada y detenida.
- **Detención desde la pantalla de bloqueo sin desbloquear:** La acción de detener silencia la alarma sin obligar a desbloquear el teléfono ni interrumpir otra actividad.
- **Apertura de la app mientras la alarma está activa:** Se despliega un diálogo o modal prominente con un botón de gran tamaño para silenciarla y dar paso a la siguiente fase lista para empezar.
- **Llegada a cero con el teléfono en modo «No molestar» o silencio:** La alarma se emite utilizando la prioridad de alarma del sistema para garantizar su audibilidad.

## Fuera de alcance

- Configurar tonos o melodías externas importadas desde la memoria del teléfono.
- Ajuste de volumen individualizado independiente de los controles de volumen del dispositivo.
- Iniciar automáticamente la cuenta regresiva de la siguiente fase tras silenciar el aviso.
- Sincronización remota o alertas en dispositivos externos mediante servicios en la nube.

## Criterios de finalización

- Los cuatro escenarios de HU-004 cuentan con requisitos funcionales explícitos en formato EARS.
- Se integran las ocho decisiones acordadas en `decisiones.md`.
- Se especifica el comportamiento sonoro y vibratorio tanto en modo normal como en modo silencio.
- Se contemplan las dos formas de detención del aviso (desde la notificación del sistema y desde la interfaz de la aplicación).
- Se detalla el flujo de solicitud y manejo de rechazo del permiso de notificaciones sin generar bloqueos.
- La spec está expresada en términos del QUÉ y POR QUÉ funcional observable, sin referencias a arquitectura, código ni nombres de archivos.

## Dudas abiertas

Ninguna.

## Revisión final de la spec

1. **Consistencia interna:** Los requisitos RF-001 a RF-012 son consistentes entre sí; la detención del aviso (RF-009, RF-010, RF-011) respeta en todos los casos la regla de negocio de dejar la siguiente fase preparada y detenida sin iniciarla automáticamente.
2. **Cobertura de la HU:** Los cuatro escenarios de HU-004 («Aviso con el celular en sonido», «Aviso con el celular en silencio», «Detener el aviso» y «Permiso de notificaciones») están completamente cubiertos por los RFs.
3. **Alineación con la constitución:** Se cumple plenamente con el principio 1 (cero fricción, sin cuentas, estudio no bloqueado por falta de permisos), principio 5 (exactitud y aviso en bloqueo/cierre) y principio 7 (datos y estado preservados).
4. **Sin desbordamiento de alcance:** No se incluyen detalles de código, dependencias ni arquitectura técnica.
