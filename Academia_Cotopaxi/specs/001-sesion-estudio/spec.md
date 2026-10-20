# Spec 001 — Sesión de estudio

Estado: aprobada  
HU de origen: docs/historias/HU-001.md

## Contexto y objetivo

La estudiante necesita iniciar y controlar un temporizador de estudio durante un
tiempo definido. La sesión debe conservar su estado y mantener un conteo exacto
para que pueda pausar, continuar o reiniciar sin perder el tiempo transcurrido.

## Usuarios

- Estudiante de la Academia Cotopaxi.

## Historias de usuario

Como estudiante, quiero iniciar, pausar y reiniciar un temporizador de estudio,
para concentrarme durante un tiempo definido.

## Definiciones

- **Sesión de estudio:** cuenta regresiva de la fase de estudio actual.
- **Tiempo inicial:** duración de estudio configurada al comenzar la fase.
- **Tiempo restante:** tiempo que falta para llegar a `00:00`, expresado en
  minutos y segundos.
- **Sesión finalizada:** sesión que llegó a `00:00` y quedó detenida hasta que la
  estudiante confirme un reinicio.

## Requisitos funcionales

- **RF-001:** CUANDO la estudiante abra la pantalla principal por primera vez,
  EL SISTEMA mostrará el temporizador detenido en el tiempo inicial configurado.
  **Origen:** Decisión 2 de `decisiones.md`.

- **RF-002:** CUANDO la estudiante presione iniciar con una sesión detenida que
  tenga tiempo restante, EL SISTEMA comenzará la cuenta regresiva usando el
  tiempo de estudio configurado y mostrará los minutos y segundos restantes.
  **Origen:** Escenario «Iniciar el temporizador» de HU-001.

- **RF-003:** MIENTRAS la sesión esté corriendo, EL SISTEMA calculará el tiempo
  restante con la hora real para conservar la exactitud aunque la pantalla esté
  bloqueada o la aplicación se cierre.
  **Origen:** Principio 5 de `docs/constitution.md` y Decisión 2 de
  `decisiones.md`.

- **RF-004:** CUANDO la estudiante pause una sesión corriendo, EL SISTEMA
  detendrá la cuenta y conservará el tiempo restante que tenía en ese momento.
  **Origen:** Escenario «Pausar y continuar» de HU-001.

- **RF-005:** CUANDO la estudiante reanude una sesión pausada, EL SISTEMA
  continuará la cuenta desde el tiempo restante conservado al pausarla.
  **Origen:** Escenario «Pausar y continuar» de HU-001.

- **RF-006:** CUANDO la estudiante decida reiniciar una sesión corriendo o
  pausada, EL SISTEMA solicitará una confirmación explícita antes de cambiar el
  tiempo restante.
  **Origen:** Escenario «Reiniciar el temporizador» de HU-001 y principio 7 de
  `docs/constitution.md`.

- **RF-007:** CUANDO la estudiante confirme el reinicio, EL SISTEMA devolverá
  el temporizador al tiempo inicial de la fase actual y lo dejará detenido.
  **Origen:** Escenario «Reiniciar el temporizador» de HU-001 y Decisión 5 de
  `decisiones.md`.

- **RF-008:** CUANDO la estudiante cancele la confirmación de reinicio, EL
  SISTEMA cerrará la confirmación y conservará sin cambios el estado y el tiempo
  restante de la sesión.
  **Origen:** Escenario «Cambiar de opinión al reiniciar» de HU-001.

- **RF-009:** CUANDO una sesión corriendo llegue a `00:00`, EL SISTEMA la
  marcará como finalizada y detenida, sin iniciar automáticamente otra fase.
  **Origen:** Decisión 1 de `decisiones.md`.

- **RF-010:** MIENTRAS la sesión esté finalizada en `00:00`, EL SISTEMA
  deshabilitará iniciar y pausar y dejará disponible únicamente reiniciar,
  sujeto a confirmación explícita.
  **Origen:** Decisión 5 de `decisiones.md` y principio 7 de
  `docs/constitution.md`.

- **RF-011:** CUANDO la estudiante vuelva a abrir la aplicación y exista una
  sesión guardada, EL SISTEMA restaurará su fase, estado y tiempo restante
  calculado con la hora real.
  **Origen:** Decisión 2 de `decisiones.md`.

- **RF-012:** CUANDO la estudiante vuelva a abrir la aplicación y la sesión
  guardada corriendo haya vencido mientras la aplicación estaba cerrada, EL
  SISTEMA mostrará la sesión finalizada en `00:00`.
  **Origen:** Decisión 2 de `decisiones.md`.

- **RF-013:** SI el SISTEMA no puede guardar o recuperar la sesión, ENTONCES EL
  SISTEMA mostrará un error claro, no presentará la operación como guardada y
  conservará en pantalla el último estado confirmado.
  **Origen:** Decisión 3 de `decisiones.md`.

- **RF-014:** SI el SISTEMA no puede programar el aviso local, ENTONCES EL
  SISTEMA permitirá iniciar y controlar la sesión, mostrará una advertencia
  explícita de que el aviso no estará disponible y mantendrá funcionando el
  conteo.
  **Origen:** Decisión 4 de `decisiones.md`.

## Requisitos no funcionales

- **RNF-001:** La sesión funcionará sin conexión a internet, sin cuenta y sin
  publicidad.
- **RNF-002:** El tiempo restante visible se expresará en minutos y segundos,
  incluyendo ceros iniciales cuando corresponda.
- **RNF-003:** La sesión activa y los tiempos personalizados se conservarán al
  cerrar la aplicación, sin guardar datos sensibles.
- **RNF-004:** El sistema no presentará como exitosa una operación de guardado o
  recuperación que haya fallado.

## Casos límite

- Si no existe una sesión guardada al abrir la pantalla principal, se aplicará
  RF-001.
- Si una sesión guardada estaba pausada, se restaurará pausada con el tiempo
  restante conservado.
- Si una sesión guardada estaba corriendo y aún no vence, se restaurará
  corriendo con el tiempo restante calculado con la hora real.
- Si una sesión guardada corriendo vence mientras la aplicación está cerrada,
  se restaurará como finalizada en `00:00`.
- Si la estudiante cancela el reinicio, no se modificarán el tiempo restante ni
  el estado de la sesión.
- Si el aviso local no está disponible, la falta del aviso no impedirá el uso
  del temporizador.
- Una sesión finalizada no podrá iniciar otra fase mediante iniciar o pausar;
  requerirá un reinicio confirmado.

## Fuera de alcance

- Iniciar automáticamente una fase posterior al llegar a `00:00`.
- Definir o modificar la duración de estudio desde esta historia.
- Gestionar descansos cortos o largos y las transiciones del ciclo Pomodoro.
- Definir el contenido visual, los colores o las animaciones de la pantalla.
- Crear cuentas, sincronizar sesiones en línea o mostrar publicidad.

## Criterios de finalización

- Los cuatro escenarios de HU-001 tienen requisitos funcionales verificables:
  iniciar (RF-002), pausar y continuar (RF-004 y RF-005), reiniciar confirmado
  (RF-006 y RF-007) y cancelar reinicio (RF-008).
- La sesión conserva su estado y tiempo restante al cerrar y volver a abrir la
  aplicación, incluyendo el vencimiento durante el cierre.
- El conteo usa la hora real como referencia y no depende únicamente de un
  contador en memoria.
- Las acciones de reinicio solicitan confirmación explícita y respetan la
  cancelación.
- Los estados inicial, corriendo, pausado y finalizado muestran controles
  coherentes con su comportamiento definido.
- Los fallos de persistencia y de aviso local se comunican explícitamente sin
  crear estados de éxito falsos.
- El comportamiento funciona sin conexión, sin cuentas, sin publicidad y sin
  guardar datos sensibles.

## Dudas abiertas

Ninguna.

## Revisión final de la spec

- No se observan contradicciones entre los requisitos funcionales.
- Los cuatro escenarios de HU-001 están cubiertos por RF-002, RF-004, RF-005,
  RF-006, RF-007 y RF-008.
- El comportamiento al finalizar la cuenta está cubierto por RF-009 y RF-010 y
  coincide con las decisiones 1 y 5.
- La recuperación de una sesión al reabrir la aplicación está cubierta por
  RF-011 y RF-012.
- Los fallos de almacenamiento están cubiertos por RF-013.
- La indisponibilidad del aviso local está cubierta por RF-014.
- No se identifican conflictos con el funcionamiento sin conexión, sin cuentas y
  sin publicidad.
- No se identifican conflictos con la exactitud temporal durante el bloqueo o
  cierre de la aplicación.
- No se identifican conflictos con la conservación de la sesión activa ni con
  la confirmación explícita de acciones destructivas.
