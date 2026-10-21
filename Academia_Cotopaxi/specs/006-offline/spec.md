# Spec 006 — Usar la aplicación sin registro, sin internet y sin publicidad

Estado: aprobada
HU de origen: docs/historias/HU-006.md

## Contexto y objetivo

El estudiante necesita una herramienta de estudio concentrado basada en la técnica Pomodoro que respete su tiempo, su privacidad y su enfoque desde el primer instante de uso. La aplicación debe ser completamente operativa apenas se instala, eliminando cualquier barrera de entrada como pantallas de registro, creación de cuentas o inicio de sesión obligatorios. Asimismo, debe garantizar funcionamiento autónomo al 100% sin conexión a internet (modo avión, sin wifi ni datos móviles), asegurando que todas las funciones de temporizado, avisos locales y ajustes persistan en el dispositivo. Finalmente, la experiencia debe estar blindada contra anuncios publicitarios, rastreadores y enlaces distractores para proteger la concentración del estudiante durante sus jornadas de estudio.

## Usuarios

- Estudiante de la Academia Cotopaxi.

## Historias de usuario

Como estudiante, quiero usar la aplicación apenas la instalo, sin crear una cuenta, sin datos móviles y sin anuncios, para empezar a estudiar sin trabas.

## Definiciones

- **Modo sin conexión (offline):** estado en el que el dispositivo móvil no cuenta con conexión de datos móviles ni red Wi-Fi activa, o se encuentra en modo avión.
- **Avisos locales en primer plano:** avisos acústicos y vibraciones ejecutados directamente por la aplicación mientras se mantiene abierta y visible en la pantalla.
- **Temporizador en reposo:** estado inicial del temporizador listo para comenzar una sesión de estudio a 25:00 minutos sin haber iniciado el conteo.
- **Recursos locales empaquetados:** archivos de audio, fuentes tipográficas e iconos integrados dentro del paquete de instalación de la aplicación, sin descargas en tiempo de ejecución.
- **Almacenamiento local del dispositivo:** espacio de persistencia interno provisto por el sistema operativo del teléfono para almacenar preferencias y estado de sesión.

## Requisitos funcionales

- **RF-001:** CUANDO el estudiante abra la aplicación por primera vez tras la instalación, EL SISTEMA presentará directamente la pantalla principal con el temporizador en reposo configurado en la fase de estudio inicial a 25:00 minutos, sin solicitar registro, creación de cuenta, inicio de sesión ni mostrar pantallas de bienvenida o tutoriales.
  **Origen:** Escenario «Abrir la aplicación por primera vez» de HU-006 y Decisión 1 de `decisiones.md`.

- **RF-002:** EL SISTEMA operará de forma idéntica y transparente con o sin conexión a internet, sin mostrar banners, etiquetas, iconos ni mensajes de alerta referidos al estado de conectividad del dispositivo.
  **Origen:** Escenario «Usarla sin conexión» de HU-006 y Decisión 2 de `decisiones.md`.

- **RF-003:** MIENTRAS el dispositivo no cuente con conexión a internet, EL SISTEMA mantendrá plenamente operativas todas las funciones de inicio, pausa, reinicio de temporizador, configuración de duraciones y emisión de avisos utilizando exclusivamente recursos multimedia locales empaquetados en la aplicación.
  **Origen:** Escenario «Usarla sin conexión» de HU-006 y Decisión 3 de `decisiones.md`.

- **RF-004:** SI la reproducción del sonido de aviso falla o el canal de audio del dispositivo no se encuentra disponible, ENTONCES EL SISTEMA emitirá vibración como mecanismo de respaldo sin interrumpir la sesión activa ni mostrar mensajes de error fatales.
  **Origen:** Decisión 3 de `decisiones.md`.

- **RF-005:** EL SISTEMA presentará todas sus pantallas, configuraciones y flujos completamente libres de anuncios publicitarios, elementos patrocinados, enlaces a sitios web externos y componentes de analítica o rastreo.
  **Origen:** Escenario «Usarla sin publicidad» de HU-006 y Decisión 5 de `decisiones.md`.

- **RF-006:** EL SISTEMA almacenará en el almacenamiento local del dispositivo estrictamente las preferencias del temporizador y el estado de la sesión activa, sin guardar identificadores únicos de dispositivo, nombres, correos electrónicos ni telemetría de uso del estudiante.
  **Origen:** Escenario «Usarla sin conexión» de HU-006 y Decisión 8 de `decisiones.md`.

- **RF-007:** SI ocurre un fallo de lectura o escritura en el almacenamiento local del dispositivo, ENTONCES EL SISTEMA mantendrá los datos de configuración y la progresión del temporizador en memoria durante la sesión activa y mostrará una notificación visual no bloqueante informando al estudiante que los cambios no pudieron guardarse localmente.
  **Origen:** Decisión 4 de `decisiones.md`.

- **RF-008:** CUANDO el estudiante inicie una sesión de estudio por primera vez, EL SISTEMA solicitará el permiso del sistema operativo para notificaciones locales de forma no intrusiva; SI el estudiante rechaza el permiso, ENTONCES EL SISTEMA continuará operando normalmente con avisos sonoros y táctiles en primer plano, sin bloquear la interfaz ni volver a insistir repetitivamente con solicitudes de permiso.
  **Origen:** Decisión 6 de `decisiones.md`.

- **RF-009:** CUANDO la aplicación sea reabierta tras haber sido cerrada o suspendida por el sistema operativo sin conexión a internet, EL SISTEMA restaurará el temporizador calculando el tiempo transcurrido mediante las marcas de tiempo locales; SI el tiempo de la fase concluyó mientras la aplicación estaba cerrada, ENTONCES EL SISTEMA presentará de inmediato el aviso de fase completada o pasará a la fase correspondiente según el ciclo Pomodoro.
  **Origen:** Decisión 7 de `decisiones.md` y principio 5 de `docs/constitution.md`.

## Requisitos no funcionales

- **RNF-001:** La aplicación no emitirá ninguna petición de red ni consumirá ancho de banda de datos móviles o Wi-Fi durante toda su ejecución.
- **RNF-002:** El paquete de la aplicación contendrá todos los recursos gráficos, fuentes e insumos de audio necesarios para su ejecución autónoma sin dependencias externas.
- **RNF-003:** La persistencia local no guardará información personal identificable del estudiante, garantizando privacidad total y cumplimiento de cero cuentas.
- **RNF-004:** El tiempo de inicio y respuesta de la interfaz al abrirse por primera vez será inmediato, sin pantallas intermedias ni tiempos de carga perceptibles asociados a llamadas remotas.
- **RNF-005:** En caso de degradación de hardware de audio o fallo de persistencia local, el sistema se recuperará de forma suave priorizando la continuidad de la sesión de estudio del estudiante.

## Casos límite

- **Apertura de la app en modo avión de forma continua:** Todas las vistas (temporizador, configuración) y acciones responden de inmediato sin retrasos ni tiempos de espera por red.
- **Rechazo total de permisos de notificación en primer inicio:** La aplicación no interrumpe el flujo, permite iniciar el pomodoro inmediatamente y emite avisos sonoros/vibratorios mientras se mantenga abierta.
- **Fallo de almacenamiento por memoria del dispositivo llena:** El temporizador sigue corriendo en memoria durante la sesión y se alerta al usuario con un mensaje no bloqueante de que los ajustes o estado no se conservarán tras el cierre.
- **Dispositivo en silencio o sin altavoz funcional:** Si el aviso sonoro no puede reproducirse, se activa la vibración táctil como respaldo sin detener el cronómetro.
- **Cierre forzado de la app sin internet y reapertura horas después:** El sistema calcula el tiempo transcurrido por marca de tiempo local e identifica que la fase terminó, mostrando el estado de finalización y el paso a la siguiente fase sin desfase horario.

## Fuera de alcance

- Sincronización en la nube o respaldo de configuraciones entre múltiples dispositivos.
- Creación de perfiles de usuario, inicio de sesión con redes sociales o cuentas institucionales.
- Módulos de analítica de estudio, tableros remotos o estadísticas enviadas a servidores externos.
- Integración de banners publicitarios o enlaces promocionales a terceros.

## Criterios de finalización

- Todos los escenarios de HU-006 se encuentran cubiertos por requisitos funcionales en formato EARS con origen explícito.
- Se incorporan formalmente las 8 decisiones de diseño establecidas en `specs/006-offline/decisiones.md`.
- No se introducen pantallas de registro, bienvenida ni tutoriales que retrasen el estudio.
- La ausencia de publicidad, enlaces externos y tráfico de red está normada explícitamente.
- Se contempla el comportamiento de degradación suave (vibración ante fallo de audio y memoria temporal ante fallos de almacenamiento).
- El documento describe exclusivamente el QUÉ y el POR QUÉ sin incluir menciones de código, librerías, formatos de datos ni nombres de carpetas o archivos.

## Dudas abiertas

Ninguna.

## Revisión final de la spec

1. **Consistencia interna:** Los requisitos RF-001 a RF-009 son consistentes entre sí y con el modelo autónomo offline de la aplicación.
2. **Cobertura de la HU:** Los tres escenarios de [HU-006.md](../../docs/historias/HU-006.md) («Abrir la aplicación por primera vez», «Usarla sin conexión» y «Usarla sin publicidad») quedan cubiertos en su totalidad por los requisitos RF-001 a RF-006 y RF-009.
3. **Alineación con la constitución:**
   - Cumple estrictamente con el Principio 1 (simplicidad, cero fricción, 100% offline, cero cuentas y cero publicidad).
   - Cumple con el Principio 2 (la spec manda, solo estado borrador, sin avanzar a planificación).
   - Cumple con el Principio 5 (exactitud temporal ante bloqueo o cierre mediante marcas de tiempo locales).
   - Cumple con el Principio 7 (datos del estudiante sagrados y alcance mínimo indispensable en persistencia local).
4. **Delimitación estricta de alcance:** La especificación describe únicamente comportamiento observable del sistema sin incluir detalles de implementación técnica, arquitecturas o nombres de archivos.
