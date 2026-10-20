# Plan de implementación — Spec 001: Sesión de estudio

> La spec está aprobada y este plan cubre RF-001 a RF-014 y RNF-001 a RNF-004.
> No se implementan descansos, transiciones automáticas ni edición de duración,
> porque están fuera de alcance. Las dependencias y el formato de persistencia
> fueron aprobados en la Decisión 6 de `decisiones.md`.

## Archivos y responsabilidades

### Capa 1 — lógica de negocio

- `src/types/pomodoro.ts`: tipos y contratos para la fase de estudio, estados
  detenido/corriendo/pausado/finalizado, configuración de duración y sesión
  activa. No incluirá componentes ni valores visuales.
- `src/utils/timer.ts`: funciones puras para calcular tiempo restante desde
  `endTimestamp - Date.now()`, detenerlo en cero y formatearlo como `MM:SS`.
- `src/utils/timer.test.ts`: pruebas de tiempo restante, vencimiento, límites y
  formato con ceros iniciales.
- `src/utils/session.ts`: funciones puras para iniciar, pausar, reanudar,
  reiniciar y derivar el estado final de una sesión a partir de sus datos.
- `src/utils/session.test.ts`: pruebas escritas antes del código para los
  cuatro escenarios de HU-001 y los estados límite definidos en la spec.
- `src/utils/settings.ts`: validación de la duración de estudio que ya entrega
  el flujo de configuración, sin crear ni modificar esa pantalla en esta spec.
- `src/utils/settings.test.ts`: pruebas de aceptación y rechazo de rangos y
  valores no válidos.
- `src/storage/sessionStorage.ts`: lectura y escritura local de la sesión
  usando el contrato aprobado. Debe conservar el último estado confirmado y
  propagar errores diferenciados de lectura y escritura.
- `src/storage/sessionStorage.test.ts`: pruebas con el almacenamiento
  aislado/mockeado para éxito, ausencia de sesión y fallos explícitos.
- `src/services/notificationService.ts`: solicitud/verificación de permisos,
  programación y cancelación del aviso de finalización. No bloqueará el
  temporizador si el aviso no está disponible; devolverá un resultado que
  permita mostrar la advertencia de RF-014.
- `src/services/notificationService.test.ts`: pruebas de permiso disponible,
  permiso rechazado, fallo de programación y cancelación.
- `src/context/StudySessionContext.tsx`: orquestación entre utilidades,
  persistencia, avisos y ciclo de vida de la aplicación. Expondrá el estado
  derivado y las acciones iniciar, pausar, reanudar y reiniciar, además de
  errores y advertencias explícitos.
- `src/context/StudySessionContext.test.tsx`: pruebas de integración del
  contexto para restauración, persistencia, vencimiento, confirmación delegada
  a la UI y conservación del último estado confirmado.

### Capa 2 — diseño e interfaz

- `src/constants/theme.ts`: tokens visuales de la Academia Cotopaxi que
  requiera la pantalla, siguiendo `cotopaxi-brand`. No contendrá lógica de
  temporización.
- `src/components/StudyTimer.tsx`: presentación del tiempo `MM:SS`, fase y
  estado recibidos por props.
- `src/components/StudyTimerControls.tsx`: botones y estados habilitados
  recibidos por props; no calculará timestamps ni accederá a almacenamiento.
- `src/components/RestartConfirmation.tsx`: confirmación explícita del
  reinicio y callbacks de confirmar/cancelar.
- `src/components/SessionMessage.tsx`: presentación de errores de persistencia
  y advertencias de aviso no disponible.
- `src/app/index.tsx`: conexión del contexto con los componentes, restauración
  visible y composición de la pantalla principal. No llamará directamente a
  `AsyncStorage` o `expo-notifications`.
- `src/app/_layout.tsx`: incorporación del proveedor de sesión si el layout
  existente es el punto apropiado, sin introducir lógica visual en la Capa 1.

## Capa 1: flujo de negocio

1. Al abrir la pantalla, el contexto solicita la sesión guardada.
2. Si no existe, crea en memoria una sesión detenida con la duración inicial
   configurada.
3. Si existe una sesión pausada o detenida, restaura su tiempo conservado.
4. Si existe una sesión corriendo, calcula el tiempo real con la marca temporal
   de finalización. Si el resultado es cero, la transforma en finalizada.
5. Al iniciar o reanudar, calcula una nueva marca de finalización a partir del
   tiempo restante, persiste el estado y solicita programar el aviso.
6. Al pausar, calcula primero el tiempo real restante, elimina la marca de
   ejecución, persiste el tiempo conservado y cancela el aviso.
7. Al llegar a cero, marca la sesión como finalizada y detenida, persiste ese
   estado y no inicia otra fase.
8. Al reiniciar, la UI solicita confirmación. Solo después de confirmar el
   contexto restaura la duración inicial, deja la sesión detenida, persiste y
   cancela cualquier aviso anterior.
9. Un intervalo, si se usa para refrescar la pantalla, solo vuelve a leer el
   estado y recalcular desde la hora real; nunca será la fuente de verdad.
10. Todo fallo de lectura/escritura conserva el último estado confirmado y
    expone un error. Un fallo del aviso expone una advertencia, pero no impide
    controlar el temporizador.

## Algoritmo temporal en pseudocódigo

```text
restaurar():
  guardado = leerSesion()
  si guardado no existe:
    devolver detenido(tiempoInicial)
  si guardado.estado != corriendo:
    devolver guardado
  restante = max(0, guardado.endTimestamp - relojActual())
  si restante == 0:
    devolver finalizado(00:00)
  devolver corriendo(restante, guardado.endTimestamp)

iniciarOReanudar():
  validar que el estado tenga tiempoRestante > 0
  endTimestamp = relojActual() + tiempoRestante
  persistir(corriendo, endTimestamp)
  programarAviso(endTimestamp)

refrescarMientrasCorriendo():
  restante = max(0, endTimestamp - relojActual())
  si restante == 0:
    persistir(finalizado, 00:00)
    cancelarAviso()
  mostrar(formatear(restante))

pausar():
  restante = max(0, endTimestamp - relojActual())
  persistir(pausado, restante)
  cancelarAviso()

reiniciar(confirmado):
  si no confirmado:
    no cambiar nada
  si confirmado:
    persistir(detenido, tiempoInicial)
    cancelarAviso()
```

El cálculo usa marcas temporales persistidas y el reloj real, por lo que la
pantalla bloqueada o la aplicación cerrada no alteran el resultado. El aviso
programado es un respaldo del sistema operativo, no la fuente del conteo.

## Datos del estudiante y acciones destructivas

- Se persisten únicamente los datos necesarios para restaurar la sesión activa:
  fase actual, estado, duración inicial, tiempo restante conservado y/o marca
  temporal de finalización según el contrato aprobado. No se persisten cuentas,
  identificadores personales ni datos sensibles.
- Se guarda antes de presentar como exitosas las operaciones de iniciar,
  pausar, reanudar, finalizar y reiniciar.
- La restauración ocurre al montar el proveedor/pantalla principal y al volver
  al primer plano si la sesión pudo avanzar mientras la app no estaba visible.
- Reiniciar siempre muestra confirmación explícita. Cancelar cierra el diálogo
  sin modificar estado ni tiempo. Una sesión finalizada solo expone reiniciar,
  también con confirmación.
- Los fallos de persistencia no se sustituyen silenciosamente por memoria:
  conservan el último estado confirmado y muestran un error claro.

## Decisiones técnicas y alternativas descartadas

1. **Marcas temporales como fuente de verdad.** Se usará el tiempo real para
   cumplir el principio 5 y RF-003/RF-011/RF-012. Se descarta depender de un
   contador decrementado por `setInterval`, porque pierde exactitud con bloqueo
   o cierre.
2. **Estado de sesión centralizado en contexto.** Permite que la pantalla solo
   conecte datos y callbacks y respeta la frontera de capas. Se descarta que
   cada componente gestione persistencia o tiempo.
3. **Aviso local desacoplado del conteo.** El temporizador continúa si el aviso
   falla, conforme a RF-014. Se descarta hacer obligatorio el permiso para
   iniciar.
4. **Confirmación en la interfaz y mutación solo tras confirmar.** Protege el
   principio 7 y RF-006/RF-008/RF-010. Se descarta reiniciar al pulsar el
   botón sin confirmación.
5. **Persistencia local sin red.** Cumple RNF-001 y evita cuentas/sincronización.
   Se descarta cualquier backend o almacenamiento remoto.
6. **Dependencias de persistencia y avisos.** Se usarán
   `@react-native-async-storage/async-storage` y `expo-notifications`, instaladas
   con `npx expo install` en versiones compatibles con Expo SDK 57, conforme a
   la Decisión 6. Se descarta una base de datos y una solución sin avisos por
   ser innecesarias o incompletas para RF-003 y RF-014.
7. **Contrato inicial de almacenamiento.** Se usará un único objeto JSON
   versionado bajo `pomodoro.activeSession`, con los campos aprobados en la
   Decisión 6. Se descartan claves independientes por riesgo de escrituras
   parciales y un formato sin versión por dificultar migraciones controladas.

## Estrategia de pruebas

### Jest en la Capa 1

- `timer.test.ts`: `endTimestamp - Date.now()`, cero al vencer, nunca valores
  negativos, formato `MM:SS` y ceros iniciales.
- `session.test.ts`: iniciar, pausar, reanudar, reiniciar, finalización,
  controles derivados y ausencia de transición automática.
- `settings.test.ts`: límites válidos, límites inválidos y valores no numéricos.
- `sessionStorage.test.ts`: serialización/deserialización del contrato
  aprobado, sesión inexistente, error de lectura y error de escritura.
- `notificationService.test.ts`: permiso concedido/denegado, aviso
  programado/cancelado y error que no impide el temporizador.
- `StudySessionContext.test.tsx`: restauración de estados, vencimiento durante
  cierre, persistencia tras cada operación, conservación del último estado
  confirmado y exposición de error/advertencia.

Las pruebas de Capa 1 se escriben primero y se ejecutan con `npx jest` y
`npx tsc --noEmit`. No se avanza con pruebas rojas ni errores de tipos.

### Verificación manual en dispositivo/APK

- Pantalla inicial, estados detenido/corriendo/pausado/finalizado y controles
  habilitados según RF-001/RF-010.
- Iniciar, pausar, reanudar y reiniciar confirmado/cancelado.
- Bloquear la pantalla durante una sesión y comprobar que el tiempo visible se
  recupera correctamente.
- Cerrar y volver a abrir la app con sesión pausada y corriendo, incluyendo
  vencimiento durante el cierre.
- Comprobar aviso sonoro/vibración o la advertencia explícita cuando el sistema
  no permite programarlo.
- Simular fallo de almacenamiento y comprobar que se muestra el error y no se
  presenta la operación como guardada.
- Revisar fronteras de capas y, si se modifican colores/estilos, validar con
  `cotopaxi-brand`; validar controles, ciclo de vida y accesibilidad con
  `rn-conventions`.

## Cobertura de requisitos

| Parte | Requisitos cubiertos |
|---|---|
| Tipos y utilidades de tiempo/sesión | RF-001 a RF-012, RNF-002 |
| Validación de duración | RF-001/RF-002, según la configuración existente |
| Persistencia local | RF-001, RF-004, RF-005, RF-007, RF-011 a RF-013, RNF-001, RNF-003, RNF-004 |
| Servicio de avisos | RF-003, RF-009, RF-014 |
| Contexto de sesión | RF-001 a RF-014, RNF-001 a RNF-004 |
| Reloj y controles visuales | RF-001, RF-002, RF-004, RF-005, RF-009, RF-010, RNF-002 |
| Confirmación y mensajes | RF-006, RF-008, RF-010, RF-013, RF-014 |
| Pruebas Jest | Principio 6 y comportamiento verificable de la Capa 1 |
| Verificación manual | RF-003, RF-009, RF-010, RF-014 y escenarios de ciclo de vida |

## Validación del plan

- Respeta las dos capas de la constitución: la Capa 1 no importa componentes ni
  colores y la Capa 2 no accede directamente a almacenamiento/avisos ni calcula
  timestamps.
- Incluye pruebas primero para toda la lógica de la Capa 1.
- Mantiene el conteo basado en reloj real y no solo en `setInterval`.
- Conserva sesión y configuración sin datos sensibles y confirma acciones
  destructivas.
- Cubre todos los RF y RNF de la spec.
- Se requieren 10 tareas, por lo que no es necesario dividir esta spec.
