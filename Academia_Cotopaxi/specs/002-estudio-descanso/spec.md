# Spec 002 — Alternar entre estudio y descanso

Estado: aprobada
HU de origen: docs/historias/HU-002.md

## Contexto y objetivo

La estudiante necesita avanzar por las fases de estudio, descanso corto y
descanso largo sin llevar manualmente la cuenta de los pomodoros. Al terminar
una fase, la siguiente debe quedar preparada y detenida para que la estudiante
decida cuándo iniciarla, conservando el avance del ciclo y la exactitud del
tiempo transcurrido.

## Usuarios

- Estudiante de la Academia Cotopaxi.

## Historias de usuario

Como estudiante, quiero que la aplicación pase sola del tiempo de estudio al de
descanso, para seguir la técnica Pomodoro sin tener que llevar la cuenta yo
misma.

## Definiciones

- **Fase:** un tiempo de estudio, descanso corto o descanso largo.
- **Fase preparada:** fase que ya fue seleccionada por el sistema, muestra su
  duración inicial y permanece detenida hasta que la estudiante la inicie.
- **Ciclo actual:** conjunto de tiempos de estudio que comienza después de un
  descanso largo y termina al completar la cantidad objetivo de pomodoros.
- **Pomodoros completados:** cantidad de tiempos de estudio terminados dentro
  del ciclo actual.
- **Objetivo del ciclo:** cantidad de tiempos de estudio necesaria para llegar al
  descanso largo. El valor predeterminado es cuatro.
- **Transición pendiente:** cambio de fase que ocurrió mientras la aplicación no
  estaba visible y aún debe procesarse al volver a ella.

## Requisitos funcionales

- **RF-001:** CUANDO termine un tiempo de estudio y los pomodoros completados
  sean menores que el objetivo del ciclo, EL SISTEMA aumentará en uno los
  pomodoros completados y dejará preparado y detenido un descanso corto.
  **Origen:** Escenario «Terminar un pomodoro» de HU-002 y Decisión 3 de
  `decisiones.md`.

- **RF-002:** CUANDO termine un tiempo de estudio y los pomodoros completados
  alcancen el objetivo del ciclo, EL SISTEMA dejará preparado y detenido un
  descanso largo y reiniciará en cero los pomodoros completados.
  **Origen:** Escenario «Llegar al descanso largo» de HU-002 y Decisión 3 de
  `decisiones.md`.

- **RF-003:** CUANDO termine un descanso corto o un descanso largo, EL SISTEMA
  dejará preparado y detenido el siguiente tiempo de estudio.
  **Origen:** Escenario «Terminar un descanso» de HU-002 y Decisión 1 de
  `decisiones.md`.

- **RF-004:** CUANDO termine una fase, EL SISTEMA cambiará automáticamente a
  la fase siguiente sin comenzar su cuenta regresiva.
  **Origen:** Decisión 1 de `decisiones.md`.

- **RF-005:** CUANDO la estudiante vuelva a la aplicación después de que una
  fase corriendo haya terminado mientras no estaba visible, EL SISTEMA
  procesará como máximo una transición pendiente, actualizará el contador
  correspondiente y dejará detenida la fase siguiente.
  **Origen:** Decisión 2 de `decisiones.md` y principio 5 de
  `docs/constitution.md`.

- **RF-006:** MIENTRAS una fase preparada esté detenida, EL SISTEMA conservará
  su duración inicial, su tipo y los pomodoros completados sin consumir tiempo
  ni avanzar a otra fase aunque la aplicación se cierre o la estudiante vuelva
  después.
  **Origen:** Decisión 5 de `decisiones.md`.

- **RF-007:** MIENTRAS exista una fase corriendo, EL SISTEMA determinará su
  finalización con la hora real y no únicamente con el paso del tiempo en
  pantalla, para mantener la exactitud si el celular se bloquea o la aplicación
  se cierra.
  **Origen:** Principio 5 de `docs/constitution.md` y Decisión 2 de
  `decisiones.md`.

- **RF-008:** MIENTRAS la estudiante esté en una sesión, EL SISTEMA mostrará si
  la fase actual es de estudio, descanso corto o descanso largo, junto con la
  cantidad de pomodoros completados en el ciclo actual.
  **Origen:** Escenario «Ver mi avance» de HU-002.

- **RF-009:** CUANDO la estudiante cambie el objetivo de pomodoros durante un
  ciclo actual, EL SISTEMA conservará para ese ciclo el objetivo con el que
  comenzó y aplicará el nuevo objetivo solamente después de completar el
  descanso largo e iniciar el ciclo siguiente.
  **Origen:** Decisión 6 de `decisiones.md`.

- **RF-010:** SI el SISTEMA no puede guardar la nueva fase o el contador durante
  una transición, ENTONCES EL SISTEMA mostrará un error claro, conservará la
  última fase y el último contador guardados y no presentará la transición como
  completada.
  **Origen:** Decisión 4 de `decisiones.md`.

- **RF-011:** SI el SISTEMA detecta que la sesión recuperada está incompleta,
  corrupta o contiene una fase o un contador inválido, ENTONCES EL SISTEMA
  mostrará un aviso claro de que no pudo recuperar la sesión, descartará
  únicamente ese estado inválido y mostrará una sesión nueva detenida con los
  valores configurados.
  **Origen:** Decisión 7 de `decisiones.md`.

- **RF-012:** CUANDO el SISTEMA procese una transición pendiente al volver a la
  aplicación, EL SISTEMA no encadenará fases adicionales ni iniciará
  automáticamente la fase preparada.
  **Origen:** Decisión 2 de `decisiones.md`.

## Requisitos no funcionales

- **RNF-001:** La alternancia de fases funcionará sin conexión a internet, sin
  cuenta y sin publicidad.
- **RNF-002:** La sesión activa, la fase preparada, los pomodoros completados y
  los tiempos personalizados se conservarán al cerrar la aplicación.
- **RNF-003:** El tiempo de una fase corriendo conservará exactitud durante el
  bloqueo del celular o el cierre de la aplicación.
- **RNF-004:** Los errores de guardado y recuperación se comunicarán
  explícitamente y no se sustituirán por estados de éxito silenciosos.
- **RNF-005:** El sistema no guardará datos sensibles para cumplir esta historia.

## Casos límite

- Si termina el primer tiempo de estudio de un ciclo cuyo objetivo es cuatro,
  se preparará un descanso corto y se mostrará un pomodoro completado de cuatro.
- Si termina el cuarto tiempo de estudio con el objetivo predeterminado, se
  preparará un descanso largo y se mostrará cero pomodoros completados para el
  ciclo siguiente.
- Si una fase preparada permanece sin iniciar durante un tiempo indefinido, no
  se consumirá su duración ni se producirá otra transición.
- Si una fase corriendo termina mientras la aplicación está cerrada, al volver
  se procesará una sola transición; no se atravesarán varias fases durante la
  ausencia.
- Si falla el guardado de una transición, se mantendrá visible el último estado
  confirmado y la transición no se considerará realizada.
- Si el estado recuperado es inválido, se descartará solo ese estado y la nueva
  sesión detenida usará los valores configurados.
- Si cambia el objetivo durante el ciclo, el ciclo en curso no cambiará su
  criterio para llegar al descanso largo.

## Fuera de alcance

- Iniciar automáticamente la fase preparada sin una acción explícita de la
  estudiante.
- Encadenar varias fases durante una ausencia de la aplicación.
- Definir nuevas duraciones o reglas distintas de las configuradas para las
  fases.
- Cambiar el objetivo de un ciclo que ya comenzó.
- Definir colores, tipografías, animaciones o la composición visual de la
  pantalla.
- Crear cuentas, sincronizar sesiones en línea, guardar datos sensibles o
  mostrar publicidad.

## Criterios de finalización

- Los cuatro escenarios de HU-002 tienen requisitos funcionales verificables:
  terminar un pomodoro (RF-001), llegar al descanso largo (RF-002), terminar un
  descanso (RF-003) y ver el avance (RF-008).
- Cada transición deja la siguiente fase preparada y detenida, sin iniciar una
  cuenta regresiva sin acción explícita.
- El contador aumenta al completar un estudio, se reinicia al preparar el
  descanso largo y permanece visible en el ciclo actual.
- Al regresar después de una ausencia se procesa como máximo una transición y
  el conteo usa la hora real.
- Las fases preparadas y el contador sobreviven al cierre de la aplicación sin
  consumir tiempo.
- Los cambios de objetivo respetan el objetivo fijado al inicio del ciclo y se
  aplican al siguiente ciclo.
- Los fallos de guardado y los estados inválidos se comunican explícitamente
  sin mostrar una transición o recuperación falsa.
- El comportamiento funciona sin conexión, sin cuentas, sin publicidad y sin
  guardar datos sensibles.

## Dudas abiertas

Ninguna.

## Revisión final de la spec

- No se observan contradicciones entre los requisitos funcionales.
- Los cuatro escenarios de HU-002 están cubiertos por RF-001, RF-002, RF-003 y
  RF-008.
- La preparación detenida de la siguiente fase coincide con RF-003, RF-004 y
  Decisión 1.
- El procesamiento de una sola transición durante una ausencia coincide con
  RF-005 y RF-012 y no permite encadenamientos automáticos.
- La conservación de la fase preparada coincide con RF-006 y no consume tiempo
  durante la ausencia.
- El objetivo fijado por ciclo coincide con RF-009 y la Decisión 6.
- Los errores de persistencia y los estados inválidos están cubiertos por
  RF-010 y RF-011.
- No se identifican conflictos con la exactitud temporal, el funcionamiento
  offline ni la conservación de la sesión activa exigidos por la constitución.
