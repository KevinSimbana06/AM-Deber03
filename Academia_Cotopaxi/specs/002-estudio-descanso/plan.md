# Plan de implementación — Spec 002: Alternar entre estudio y descanso

> La spec está aprobada y cubre RF-001 a RF-012 y RNF-001 a RNF-005. Este
> plan modifica el temporizador de estudio existente para incorporar descanso
> corto, descanso largo, contador de pomodoros y objetivo fijado por ciclo.
> No se añaden dependencias nuevas.

## Decisión resuelta antes de implementar

- La Decisión 8 de `decisiones.md` autoriza la versión 2 de
  `pomodoro.activeSession`, con migración explícita desde la versión 1 y
  rechazo visible de versiones desconocidas o datos inválidos.

## Archivos y responsabilidades

### Capa 1 — lógica de negocio

- `src/types/pomodoro.ts`: ampliar los contratos para `study`, `shortBreak` y
  `longBreak`, el estado detenido/corriendo/pausado/finalizado, la sesión
  activa, los pomodoros completados y el objetivo fijado para el ciclo. No
  importar React Native ni colores.
- `src/utils/timer.ts`: conservar el cálculo de tiempo restante mediante
  `endTimestamp - currentTimestamp` y el formato `MM:SS`; cubrir vencimiento y
  límites sin depender de un intervalo.
- `src/utils/timer.test.ts`: agregar pruebas de exactitud al avanzar el reloj,
  bloqueo/cierre simulado y formato de las tres fases.
- `src/utils/session.ts`: extender las transiciones puras de iniciar, pausar,
  reanudar y derivar el estado efectivo; al completar estudio seleccionar
  descanso corto o largo, incrementar o reiniciar el contador y fijar el
  objetivo del ciclo; al completar cualquier descanso preparar estudio.
- `src/utils/session.test.ts`: escribir primero pruebas para los cuatro
  escenarios de HU-002, una sola transición pendiente, fase preparada detenida,
  objetivo estable durante el ciclo y entradas inválidas.
- `src/utils/settings.ts` y `src/utils/settings.test.ts`: reutilizar la
  validación existente para el objetivo de pomodoros y las duraciones de las
  fases, sin introducir reglas no definidas por la spec.
- `src/storage/sessionStorage.ts`: validar y persistir el estado ampliado como
  versión 2, migrar explícitamente sesiones válidas de versión 1, diferenciar
  recuperación inválida de fallo de lectura y conservar el último estado
  confirmado ante fallos de escritura.
- `src/storage/sessionStorage.test.ts`: cubrir ausencia, estado válido,
  estado incompleto/corrupto, fase o contador inválido y errores de lectura y
  escritura, con el almacenamiento mockeado.
- `src/services/notificationService.ts`: conservar la programación y
  cancelación del aviso de finalización de una fase corriendo; no encadenar
  avisos para fases preparadas.
- `src/services/notificationService.test.ts`: cubrir programación,
  cancelación, permisos no disponibles y fallos sin bloquear las transiciones.
- `src/context/StudySessionContext.tsx`: orquestar restauración, transición
  pendiente al volver a primer plano, persistencia atómica de fase/contador,
  ciclo de vida, avisos y errores explícitos; exponer a la UI la fase y el
  avance del ciclo.
- `src/context/StudySessionContext.test.tsx`: probar restauración de fase
  preparada y corriendo, una sola transición tras ausencia, fallos de guardado,
  recuperación inválida, cambio de objetivo entre ciclos y conservación del
  último estado confirmado.

### Capa 2 — diseño e interfaz

- `src/constants/theme.ts`: reutilizar la paleta y tokens de Academia Cotopaxi
  para diferenciar visualmente estudio, descanso corto y descanso largo solo
  donde la pantalla ya lo requiera; no incluir lógica temporal.
- `src/components/StudyTimer.tsx`: mostrar el tiempo y la etiqueta de la fase
  recibidos por props.
- `src/components/StudyTimerControls.tsx`: conservar controles y estados
  habilitados mediante props; no acceder a almacenamiento, avisos ni reloj.
- `src/components/SessionMessage.tsx`: mostrar errores de persistencia y aviso
  de recuperación inválida de forma explícita.
- `src/components/PomodoroProgress.tsx`: mostrar `n de objetivo` mediante
  props, como componente separado del reloj. No acceder a almacenamiento,
  avisos ni cálculos temporales.
- `src/app/index.tsx`: conectar el contexto con reloj, etiqueta de fase,
  avance, controles y mensajes; no calcular timestamps ni acceder directamente
  a `AsyncStorage` o `expo-notifications`.
- `src/app/_layout.tsx`: conservar el proveedor existente si ya es el punto de
  montaje; no agregar lógica de negocio.

## Organización por capa

### Capa 1

1. Los tipos describen una sesión con fase actual, estado, duración inicial,
   tiempo restante, `endTimestamp`, contador de pomodoros y objetivo del ciclo.
2. Las funciones puras calculan el tiempo desde la hora real y producen la
   siguiente fase preparada, sin efectos secundarios.
3. El almacenamiento restaura únicamente estados válidos y expone errores; no
   repara datos corruptos silenciosamente.
4. El servicio de avisos respalda la finalización de la fase corriendo, pero no
   es la fuente de verdad ni inicia la fase siguiente.
5. El contexto coordina utilidades, almacenamiento, servicio de avisos y
   `AppState`, y solo publica estados confirmados.

### Capa 2

1. La pantalla consume el hook del contexto y pasa valores/callbacks a
   componentes presentacionales.
2. El reloj muestra la fase actual y el avance del ciclo sin hacer cálculos de
   timestamps.
3. La siguiente fase se muestra preparada y detenida; ningún componente la
   inicia automáticamente.
4. Los errores de guardado o recuperación se hacen visibles y no se presentan
   transiciones falsas como exitosas.

## Algoritmo en pseudocódigo

```text
restaurar():
  guardado = leerSesion()
  si no existe:
    devolver nuevaSesionDetenida(configuracionActual)
  si guardado es inválido:
    descartar solo ese estado
    mostrar aviso de recuperación
    devolver nuevaSesionDetenida(configuracionActual)
  si guardado.estado != corriendo:
    devolver guardado sin consumir tiempo
  restante = max(0, guardado.endTimestamp - relojActual())
  si restante > 0:
    devolver guardado con restante derivado del reloj real
  siguiente = calcularSiguienteFase(guardado)
  persistir(siguiente)
  si falla:
    conservar guardado confirmado y mostrar error
  si funciona:
    devolver siguiente detenida

refrescarMientrasCorriendo():
  restante = max(0, endTimestamp - relojActual())
  mostrar(restante)
  si restante == 0:
    procesarUnaTransicion()

procesarUnaTransicion():
  si fase == estudio:
    si pomodorosCompletados + 1 < objetivoDelCiclo:
      siguiente = descansoCorto
      contador = pomodorosCompletados + 1
    si no:
      siguiente = descansoLargo
      contador = 0
  si fase == descansoCorto o fase == descansoLargo:
    siguiente = estudio
    contador = contadorActual
    si fase == descansoLargo:
      objetivoDelCiclo = objetivoConfiguradoParaElNuevoCiclo
  preparar siguiente con duración inicial y estado detenido
  persistir fase, contador y objetivo juntos
  si falla:
    conservar último estado confirmado y mostrar error
  si funciona:
    cancelar aviso de la fase anterior
    no iniciar la fase preparada

alVolverAlPrimerPlano():
  actualizarDesdeRelojReal()
  si una fase corriendo venció:
    procesarUnaTransicion()
  no repetir procesarUnaTransicion en la misma activación
```

El intervalo, si se mantiene para refrescar la pantalla, solo vuelve a derivar
el estado a partir de la marca temporal; nunca es la fuente de verdad. Durante
una ausencia se procesa como máximo una transición y no se encadenan fases.

## Datos del estudiante y acciones destructivas

- Se persisten únicamente la fase actual, su estado, duración inicial, tiempo
  restante conservado, `endTimestamp` cuando corre, pomodoros completados y
  objetivo fijado del ciclo. No se guardan cuentas, identificadores ni datos
  sensibles.
- Una fase preparada detenida conserva su duración, fase, contador y objetivo
  sin consumir tiempo al cerrar o reabrir la aplicación.
- El estado se guarda antes de presentar una transición como completada. Si
  falla la escritura, se conserva el último estado confirmado y se muestra un
  error claro.
- Al restaurar, un estado inválido se descarta de forma explícita y se muestra
  una sesión nueva detenida con la configuración vigente.
- Reiniciar continúa siendo una acción destructiva y requiere confirmación
  explícita en la interfaz. Cancelar no cambia fase, contador ni tiempo.
- Cambiar la configuración del objetivo no altera el objetivo del ciclo en
  curso; el nuevo valor se aplica al iniciar el ciclo posterior al descanso
  largo.

## Decisiones técnicas y alternativas descartadas

1. **Marcas temporales como fuente de verdad:** se conserva el reloj real para
   RF-005, RF-007 y RF-012; se descarta depender de decrementos en memoria.
2. **Una sola transición pendiente al volver:** se adopta la Decisión 2 de
   `decisiones.md`; se descarta recorrer automáticamente varias fases durante
   una ausencia.
3. **Fase siguiente preparada y detenida:** se adopta la Decisión 1; se
   descarta iniciar descansos o estudios sin acción explícita.
4. **Contador al completar estudio:** se adopta la Decisión 3; se descarta
   contar estudios iniciados.
5. **Persistencia confirmada antes de actualizar la UI:** se adopta la
   Decisión 4; se descarta mostrar transiciones exitosas si no se guardaron.
6. **Objetivo fijado por ciclo:** se adopta la Decisión 6; se descarta recalcular
   el criterio del descanso largo a mitad del ciclo.
7. **Validación explícita y descarte de estado inválido:** se adopta la
   Decisión 7; se descarta reparar silenciosamente JSON o campos inválidos.
8. **Contexto como orquestador y componentes presentacionales:** respeta la
   frontera del principio 3; se descarta que la UI gestione persistencia,
   notificaciones o timestamps.
9. **Versión 2 con migración explícita:** se adopta la Decisión 8 de
   `decisiones.md`; se descarta cambiar el significado de la versión 1 sin
   migración o borrar silenciosamente sesiones existentes.

## Estrategia de pruebas

### Jest en Capa 1

- `timer.test.ts`: tiempo restante con reloj adelantado, fase vencida, cero
  mínimo y formato `MM:SS`.
- `session.test.ts`: cada transición, contador antes/después del cuarto
  estudio, objetivo estable, descanso que prepara estudio, una sola transición
  y fase preparada detenida.
- `settings.test.ts`: rangos válidos e inválidos de duraciones y objetivo.
- `sessionStorage.test.ts`: lectura/escritura del contrato, ausencia, JSON
  corrupto, campos inválidos y fallos explícitos.
- `notificationService.test.ts`: permisos, programación, cancelación y
  disponibilidad parcial.
- `StudySessionContext.test.tsx`: restauración, AppState, persistencia
  confirmada, errores, recuperación inválida y no encadenamiento.

Cada cambio de Capa 1 se valida con `npx jest` y `npx tsc --noEmit`. No se
instalan dependencias nuevas ni se ejecuta Expo durante esta fase.

### Verificación manual en dispositivo/APK

- Iniciar y completar estudio para comprobar descanso corto preparado.
- Completar el estudio objetivo para comprobar descanso largo y contador en
  cero.
- Completar descansos corto y largo para comprobar estudio preparado.
- Confirmar etiqueta de fase y progreso visible.
- Bloquear el celular y cerrar la app durante una fase corriendo; volver y
  comprobar una sola transición.
- Cerrar con fase preparada y comprobar que no consume tiempo.
- Simular aviso no disponible y fallos visibles de recuperación/guardado.
- Confirmar y cancelar reinicio; verificar que cancelar no modifica el estado.
- Revisar manualmente fronteras de `rn-conventions` y colores/estilos con
  `cotopaxi-brand` si se modifica la presentación.

## Cobertura de requisitos

- RF-001 y RF-002: `session.ts`, contexto, almacenamiento y progreso.
- RF-003 y RF-004: transiciones puras, contexto y reloj de fase.
- RF-005, RF-007 y RF-012: `timer.ts`, ciclo de vida y pruebas de ausencia.
- RF-006: contrato de sesión, almacenamiento y restauración.
- RF-008: `StudyTimer` y componente de progreso.
- RF-009: tipos, utilidades, contexto y pruebas de objetivo por ciclo.
- RF-010 y RNF-004: almacenamiento, contexto y `SessionMessage`.
- RF-011: validación de almacenamiento, contexto y mensaje de recuperación.
- RNF-001 y RNF-005: ausencia de red, cuentas, publicidad y datos sensibles en
  el diseño de persistencia.
- RNF-002 y RNF-003: almacenamiento, marcas temporales, avisos y pruebas
  manuales de cierre/bloqueo.

## Criterio de salida de la planificación

Hay nueve tareas de implementación, todas de 20-30 minutos como máximo. No se
propone dividir la spec. El formato de almacenamiento y el componente separado
para el progreso están definidos antes de implementar.
