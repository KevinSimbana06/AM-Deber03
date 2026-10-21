# Decisiones de Diseño - HU-006: Usar la aplicación sin registro, sin internet y sin publicidad

Documento generado a través de la entrevista `/grill-me` para resolver las decisiones de interfaz, casos límite relevantes, comportamiento ante errores, formatos y datos guardados no detallados en la historia de usuario [HU-006](../../docs/historias/HU-006.md).

---

### Decisión 1: Experiencia de apertura por primera vez
- **Pregunta:** Para el Escenario 'Abrir la aplicación por primera vez', ¿debe existir algún tipo de bienvenida, tutorial o modal explicativo en el primer inicio, o debe presentarse la interfaz del temporizador directamente y en silencio?
- **Respuesta:** Abrir directamente el temporizador en reposo (25:00) sin ninguna pantalla de bienvenida, modal de bienvenida ni tutorial.
- **Motivo:** Cumple estrictamente con el Principio 1 de la Constitución (simplicidad y cero fricción), eliminando cualquier paso previo o distracción para que el estudiante empiece a estudiar de inmediato tras la instalación.

---

### Decisión 2: Indicadores visuales de conectividad
- **Pregunta:** En el Escenario 'Usarla sin conexión', ¿la aplicación debe mostrar algún indicador visual de conectividad (banner/etiqueta de modo offline) o debe ser totalmente transparente sin avisos de red?
- **Respuesta:** Completamente transparente: no mostrar ningún banner, ícono ni alerta de conectividad; la aplicación opera de forma idéntica con o sin conexión sin advertencias.
- **Motivo:** Evita ruido visual y confusión innecesaria al estudiante, dado que la arquitectura es 100% autónoma y no requiere servicios de backend ni internet para ninguna función.

---

### Decisión 3: Gestión de recursos multimedia y comportamiento de respaldo
- **Pregunta:** Respecto a los recursos multimedia (sonido de alarma, fuentes e iconos) en modo sin conexión, ¿cómo deben gestionarse y cuál es el comportamiento de respaldo ante un fallo de carga o reproducción?
- **Respuesta:** Todos los recursos (fuentes, sonidos, iconos) deben estar empaquetados localmente; si la reproducción de sonido falla, emitir vibración táctil como respaldo sin interrumpir la sesión ni mostrar errores fatales.
- **Motivo:** Garantiza que la aplicación nunca dependa de descargas en tiempo de ejecución para sonar o renderizar su interfaz, asegurando una experiencia confiable incluso en modo avión y degradación suave mediante vibración si el hardware de audio no responde.

---

### Decisión 4: Comportamiento ante fallos de escritura en almacenamiento local
- **Pregunta:** En caso de que el almacenamiento local (AsyncStorage) falle al guardar los ajustes o la sesión (ej. disco lleno o error de E/S), ¿cómo debe reaccionar la aplicación y qué debe ver el usuario?
- **Respuesta:** Mantener los valores en memoria durante la sesión activa y mostrar una alerta o mensaje no bloqueante advirtiendo que no se pudo guardar en el almacenamiento local.
- **Motivo:** Evita interrumpir o congelar el temporizador del estudiante ante fallos en el sistema de archivos del dispositivo, permitiéndole continuar su sesión activa mientras se le notifica que los cambios no persistirán si se cierra la app.

---

### Decisión 5: Política de red, analíticas, publicidad y enlaces externos
- **Pregunta:** Para garantizar la ausencia total de publicidad y privacidad del estudiante, ¿cuál es la política estricta respecto a analíticas, SDKs de terceros y enlaces web externos en la aplicación?
- **Respuesta:** Cero tráfico de red y cero dependencias de analítica o publicidad: no incluir ningún SDK de terceros, rastreadores ni enlaces web externos en ninguna pantalla.
- **Motivo:** Garantiza inmunidad completa frente a publicidad, fugas de datos y consumo de datos móviles, blindando el respeto a la privacidad del estudiante y la concentración durante el estudio.

---

### Decisión 6: Manejo de permisos nativos de notificación
- **Pregunta:** Dado que no hay pantallas de registro ni configuración previa, ¿cómo debe manejarse el permiso nativo del sistema para notificaciones locales (necesario para avisos con pantalla bloqueada) si el estudiante lo rechaza?
- **Respuesta:** Solicitar permiso de notificaciones de forma no intrusiva al iniciar la primera sesión; si se deniega, la aplicación funciona con normalidad usando avisos locales en primer plano (audio/vibración) sin bloquear ni insistir repetitivamente.
- **Motivo:** Respeta la decisión y el control del usuario sobre su dispositivo, permitiéndole usar la app con avisos en primer plano sin interrupciones recurrentes ni bloqueos molestos.

---

### Decisión 7: Restauración de sesión offline tras cierre o finalización del sistema
- **Pregunta:** Al reabrir la aplicación en modo sin conexión tras haber sido cerrada o finalizada por el sistema operativo, ¿cómo debe comportarse el temporizador respecto a la sesión que estaba en curso?
- **Respuesta:** Restaurar automáticamente el temporizador calculando el tiempo transcurrido por timestamps locales; si el tiempo expiró mientras la app estaba cerrada, pasar a la siguiente fase o mostrar el aviso de fase completada de forma inmediata.
- **Motivo:** Garantiza el Principio 5 de la Constitución (exactitud temporal ante bloqueo o cierre) enteramente con marcas de tiempo en el dispositivo, asegurando continuidad temporal exacta sin requerir conexión horaria a servidores externos.

---

### Decisión 8: Alcance estricto de los datos persistidos localmente
- **Pregunta:** Respecto a los datos guardados en el almacenamiento local del dispositivo (AsyncStorage), ¿cuál es el alcance estricto de la información persistida para cumplir con privacidad y cero cuentas?
- **Respuesta:** Almacenamiento estrictamente limitado a preferencias del temporizador (`@pomodoro_settings`) y estado de la sesión activa (`@pomodoro_session`); cero identificadores de dispositivo, cero nombres o correos y cero telemetría local.
- **Motivo:** Garantiza una arquitectura libre de perfiles de usuario y datos sensibles (Principio 1 y 7 de la Constitución), almacenando únicamente las estructuras estrictamente necesarias para el ciclo Pomodoro.
