# Decisiones de Diseño - HU-005: Ajustar los tiempos del pomodoro

Documento generado a través de la entrevista `/grill-me` para resolver las decisiones de interfaz, casos límite, rangos numéricos, comportamiento ante errores y persistencia no detallados en la historia de usuario [HU-005](../../docs/historias/HU-005.md).

---

### Decisión 1: Rangos numéricos permitidos para las duraciones
- **Pregunta:** Para el Escenario 'Ingresar un valor no válido', ¿cuáles deben ser los rangos numéricos exactos permitidos para cada uno de los 4 campos de configuración?
- **Respuesta:** Enfoque (estudio): 25 a 90 minutos; Descanso corto: 5 a 20 minutos; Descanso largo: 15 a 30 minutos (números enteros positivos).
- **Motivo:** Establece límites pedagógicos y ergonómicos realistas acordes al ritmo de estudio de la Academia Cotopaxi, evitando intervalos inviables o perjudiciales para la concentración y el descanso.

---

### Decisión 2: Rango permitido para la cantidad de pomodoros por ciclo
- **Pregunta:** Comprendido los rangos de tiempo (Enfoque: 25-90 min, Descanso corto: 5-20 min, Descanso largo: 15-30 min). ¿Cuál debe ser el rango permitido para la cantidad de pomodoros por ciclo antes del descanso largo?
- **Respuesta:** De 2 a 8 pomodoros por ciclo (números enteros positivos, con 4 por defecto).
- **Motivo:** Permite adaptar la técnica Pomodoro a sesiones cortas o intensivas respetando un ciclo mínimo de alternancia (al menos 2 pomodoros) sin inducir fatiga excesiva antes del descanso mayor (máximo 8).

---

### Decisión 3: Acceso y disponibilidad de la pantalla de ajustes
- **Pregunta:** ¿Cómo debe acceder el estudiante a la pantalla de ajustes desde la pantalla principal y qué disponibilidad tiene según el estado del temporizador?
- **Respuesta:** Un icono/botón de ajustes (engranaje) en la esquina superior derecha de la pantalla principal que navega a '/settings'; accesible en todo momento (esté el temporizador en reposo, corriendo o pausado).
- **Motivo:** Permite al estudiante acceder a la configuración de manera inmediata y consistente desde cualquier estado, cumpliendo el escenario de cambiar ajustes con una sesión en curso sin interrumpir el temporizador.

---

### Decisión 4: Mecanismo de guardado y retroalimentación visual
- **Pregunta:** En la pantalla de ajustes, ¿cómo debe confirmarse el guardado de los cambios y qué retroalimentación visual debe recibir el estudiante?
- **Respuesta:** Un botón explícito 'Guardar' en la pantalla de ajustes; si los 4 campos son válidos, persiste los cambios, muestra un mensaje breve de éxito ('Ajustes guardados') y regresa automáticamente a la pantalla principal.
- **Motivo:** Brinda una acción deliberada y segura para aplicar los cambios, confirmando al usuario que la operación fue exitosa y devolviéndolo a su entorno de estudio principal sin pasos innecesarios.

---

### Decisión 5: Presentación de errores de validación en el formulario
- **Pregunta:** En el Escenario 'Ingresar un valor no válido', ¿cómo debe presentarse el aviso de error e indicarse los valores permitidos al estudiante?
- **Respuesta:** Mensajes de error en línea debajo de cada campo con valor inválido indicando el rango permitido (ej. 'Debe ser entre 25 y 90 min') y resaltando el campo; si hay errores, el botón 'Guardar' permanece deshabilitado o avisa del error impidiendo guardar.
- **Motivo:** Otorga retroalimentación inmediata y contextualizada junto a cada input, cumpliendo exactamente el criterio de indicarle al estudiante qué valores puede usar sin ambigüedades.

---

### Decisión 6: Confirmación explícita para restablecer valores por defecto
- **Pregunta:** En el Escenario 'Volver a los valores por defecto', ¿cómo debe presentarse la acción de restablecer y su confirmación explícita requerida por la Constitución?
- **Respuesta:** Un botón 'Restablecer valores por defecto' que abre un modal personalizado con diseño Cotopaxi advirtiendo que los valores volverán a 25/5/15/4, con opciones 'Cancelar' y 'Restablecer'; al confirmar, actualiza los campos, persiste el cambio y muestra confirmación visual.
- **Motivo:** Cumple el Principio 7 de la Constitución exigiendo confirmación explícita para acciones destructivas, manteniendo la consistencia de diseño con los modales personalizados de la aplicación.

---

### Decisión 7: Aplicación de cambios en estado de reposo vs sesión en curso
- **Pregunta:** Si el estudiante cambia la duración en ajustes cuando el temporizador está en reposo (sin iniciar) vs cuando está en pausa, ¿cómo debe reflejarse el nuevo tiempo en la pantalla principal?
- **Respuesta:** Si el temporizador está en reposo (sin iniciar), la pantalla principal se actualiza de inmediato al nuevo tiempo guardado (ej. 50:00); si está corriendo o en pausa, conserva su conteo en curso y el nuevo valor rige recién a partir del siguiente ciclo de esa fase (o al reiniciar).
- **Motivo:** Elimina la confusión del usuario al configurar tiempos antes de empezar a estudiar (espera ver reflejado el cambio de inmediato en reposo), al tiempo que respeta estrictamente el principio y criterio de no interrumpir ni alterar una sesión ya iniciada o pausada.

---

### Decisión 8: Esquema de persistencia local y tolerancia a datos corruptos
- **Pregunta:** ¿Cuál debe ser el esquema de persistencia local en AsyncStorage para los ajustes de tiempos y ciclos, y cómo se gestiona si los datos están ausentes o corruptos?
- **Respuesta:** Clave de AsyncStorage '@pomodoro_settings' con objeto JSON `{ studyDurationMinutes: number, shortBreakMinutes: number, longBreakMinutes: number, cycleTarget: number }`; si la clave no existe o los datos están corruptos, restablecer de forma segura y silenciosa a los valores por defecto (25/5/15/4).
- **Motivo:** Asegura almacenamiento desacoplado, lectura eficiente al arranque de la app y recuperación robusta ante fallos o corrupciones de almacenamiento, preservando los datos del estudiante (Principio 7 de la Constitución).
