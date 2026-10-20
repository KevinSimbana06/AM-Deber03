# Decisiones de Diseño - HU-004: Recibir aviso al terminar el tiempo

Documento generado a través de la entrevista `/grill-me` para resolver las decisiones de interfaz, casos límite, comportamiento ante errores y permisos no detallados en la historia de usuario [HU-004](../../docs/historias/HU-004.md).

---

### Decisión 1: Flujo de explicación previa y respuesta ante el rechazo del permiso
- **Pregunta:** En el Escenario 'Permiso de notificaciones', ¿cómo debe explicarse el permiso al iniciar por primera vez y qué debe ocurrir si el estudiante decide no otorgarlo?
- **Respuesta:** Mostrar un modal explicativo con diseño de la Academia Cotopaxi antes de pedir el permiso del sistema; si el estudiante lo rechaza, permitir iniciar el temporizador de todos modos mostrando un banner de advertencia no bloqueante de que no recibirá avisos fuera de la app.
- **Motivo:** Respeta el principio de "Simplicidad y cero fricción" (Constitución #1) al no bloquear el estudio si no hay permiso, pero informando de manera clara y no intrusiva sobre la limitación para que el estudiante esté advertido.

---

### Decisión 2: Comportamiento y duración del aviso sonoro y vibratorio
- **Pregunta:** En el Escenario 'Aviso como alarma' y 'Detener el aviso', ¿cómo debe comportarse la reproducción del sonido y la vibración cuando el tiempo llega a cero?
- **Respuesta:** Sonar y vibrar en bucle continuo de alarma hasta que el estudiante la detenga explícitamente (o tras un tiempo límite de seguridad de 60 segundos si no responde), tanto en primer plano como mediante notificación.
- **Motivo:** Garantiza que el estudiante escuche el aviso incluso si está concentrado en otra actividad o lejos del teléfono, pero añade un límite de seguridad de 60 segundos para no drenar la batería ni causar molestias si el dispositivo queda desatendido.

---

### Decisión 3: Presentación del botón 'Detener aviso' en primer plano
- **Pregunta:** Cuando la alarma está sonando con la app en primer plano (o al abrir la app), ¿dónde y cómo se presenta el 'botón de detener' al estudiante?
- **Respuesta:** Mostrar una pantalla/modal superpuesto prominente ('¡Fase finalizada!') con un botón grande 'Detener aviso' que silencia el sonido y deja visible la pantalla con la siguiente fase lista para iniciar.
- **Motivo:** Proporciona un control visual indiscutible y accesible inmediatamente con una sola mano, evitando confusiones o toques accidentales sobre otros controles mientras suena la alarma.

---

### Decisión 4: Interacción y acciones desde la notificación del sistema
- **Pregunta:** ¿Cómo debe responder la notificación del sistema en la pantalla de bloqueo o barra de notificaciones para cumplir con 'tocar la notificación o el botón de detener'?
- **Respuesta:** Incluir un botón de acción 'Detener' en la notificación para silenciarla directamente desde la pantalla de bloqueo; y si el estudiante toca el cuerpo de la notificación, abrir la aplicación silenciando la alarma de inmediato y mostrando la siguiente fase lista.
- **Motivo:** Otorga máxima ergonomía al estudiante: puede silenciar la alarma rápidamente sin desbloquear el celular si está ocupado, o abrir la aplicación de inmediato para ver la siguiente fase preparada.

---

### Decisión 5: Mecanismo de audio y reproducción en modo silencio
- **Pregunta:** Para cumplir con sonar en modo silencio o vibración (Escenario 2) respetando la Constitución (evitar dependencias innecesarias), ¿qué mecanismo y origen de sonido debe utilizar la aplicación?
- **Respuesta:** Configurar el canal de notificación de Android con 'usage: ALARM', importancia máxima y sonido de alarma del sistema, lo que permite que el sistema operativo lo reproduzca a través del canal de alarma incluso en silencio sin requerir dependencias adicionales.
- **Motivo:** Permite que el aviso suene con el canal de alarma nativo del sistema sin instalar librerías pesadas externas ni romper la Constitución, garantizando compatibilidad offline nativa en Android con volumen de alarma.

---

### Decisión 6: Formato y contenidos textuales de las notificaciones por fase
- **Pregunta:** ¿Qué títulos y contenidos textuales debe mostrar la notificación para informar con exactitud qué fase terminó y cuál sigue?
- **Respuesta:** Títulos y cuerpos específicos por fase: 1) Fin de estudio: '¡Estudio terminado!' - 'Bien hecho. Listo para descanso corto (5 min)' o '(15 min)' si completó el ciclo; 2) Fin de descanso: '¡Descanso terminado!' - 'Tiempo de concentrarse en la siguiente sesión de estudio'.
- **Motivo:** Otorga contexto completo y motivación positiva al estudiante directamente en la notificación o pantalla de bloqueo, permitiéndole prepararse para el cambio de actividad de inmediato.

---

### Decisión 7: Gestión de permisos denegados previamente
- **Pregunta:** Si el estudiante denegó el permiso en el pasado y la app no puede volver a solicitarlo por diálogo del sistema, ¿cómo debe permitirle reactivarlo?
- **Respuesta:** Si el permiso fue denegado previamente, ofrecer en el mensaje de advertencia un botón 'Abrir ajustes' para que el estudiante pueda activarlo en la configuración del teléfono ('Linking.openSettings()'), manteniendo la opción de 'Continuar sin avisos'.
- **Motivo:** Facilita el rescate de la funcionalidad si el estudiante cambia de opinión o denegó por error, sin fricción y sin atrapar al usuario en un estado irrecuperable.

---

### Decisión 8: Patrón de vibración y tolerancia ante ausencia de hardware
- **Pregunta:** ¿Qué patrón de vibración debe ejecutarse durante el aviso de fin y cómo debe gestionarse al detenerse o en dispositivos sin vibrador?
- **Respuesta:** Emplear un patrón de vibración rítmico y perceptible tipo alarma ([0, 500, 250, 500, 250, 500]), que se detiene inmediatamente al silenciar la alarma o tocar 'Detener', con manejo seguro silencioso en dispositivos sin soporte de vibración.
- **Motivo:** Asegura una percepción física clara del fin de ciclo en bolsillos o mochilas, cancelando los pulsos al instante cuando el usuario detiene la alarma, y previniendo fallos en entornos sin motor de vibración.
