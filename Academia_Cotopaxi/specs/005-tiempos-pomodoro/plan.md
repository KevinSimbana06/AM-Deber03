# Plan de implementación — Spec 005: Ajustar los tiempos del pomodoro

> La spec está aprobada y cubre RF-001 a RF-011 y RNF-001 a RNF-005. Este plan implementa
> la pantalla de configuración accesible mediante un botón en la cabecera principal, la validación
> reactiva en línea para los 4 campos (estudio 25–90 min, descanso corto 5–20 min, descanso largo 15–30 min,
> y 2–8 pomodoros por ciclo), el guardado persistente local en `@pomodoro_settings`, la actualización
> inmediata en reposo vs. diferida en sesión activa, el modal de confirmación explícita para
> restablecer a valores por defecto (25/5/15/4) y la recuperación tolerante ante datos corruptos.
> No se requieren dependencias externas adicionales.

---

## Decisiones técnicas y de diseño resueltas

- **Decisión 1:** Rangos numéricos permitidos para duraciones (números enteros positivos):
  - Estudio (enfoque): 25 a 90 minutos.
  - Descanso corto: 5 a 20 minutos.
  - Descanso largo: 15 a 30 minutos.
- **Decisión 2:** Cantidad de pomodoros por ciclo: 2 a 8 pomodoros (entero positivo, 4 por defecto).
- **Decisión 3:** Acceso mediante un botón con icono de ajustes (engranaje) en la esquina superior derecha de la cabecera principal que navega a `/settings`, accesible en todo momento (temporizador en reposo, en curso o pausado).
- **Decisión 4:** Botón explícito «Guardar» en `/settings`. Si los 4 campos son válidos, persiste los ajustes, muestra un mensaje breve de éxito («Ajustes guardados») y regresa automáticamente a la pantalla principal.
- **Decisión 5:** Retroalimentación inmediata en el formulario con mensajes de error en línea debajo de cada campo inválido indicando el rango permitido y resaltando el campo; si hay errores, el botón «Guardar» se inhabilita.
- **Decisión 6:** Botón «Restablecer valores por defecto» que despliega un modal con diseño Cotopaxi advirtiendo que los valores regresarán a 25/5/15/4, con opciones «Cancelar» y «Restablecer». Al confirmar, actualiza los campos, persiste el cambio y muestra confirmación visual.
- **Decisión 7:** Si el temporizador está en reposo (sin iniciar), la pantalla principal se actualiza de inmediato con el nuevo tiempo guardado; si está corriendo o en pausa, conserva su conteo en curso y los nuevos valores rigen a partir de la siguiente fase o al reiniciar.
- **Decisión 8:** Esquema de persistencia local en AsyncStorage con clave `@pomodoro_settings` y objeto JSON `{ studyDurationMinutes, shortBreakMinutes, longBreakMinutes, cycleTarget }`. Si la clave no existe o los datos están corruptos, restablecer de forma segura y silenciosa a los valores por defecto (25/5/15/4).

---

## Archivos y responsabilidades

### Capa 1 — Lógica de negocio (sin imports de React Native UI ni colores)

- `src/types/pomodoro.ts`:
  - Ampliar el contrato `PomodoroSettings` (o `StudySettings`):
    ```ts
    export interface PomodoroSettings {
      studyDurationMinutes: number;
      shortBreakMinutes: number;
      longBreakMinutes: number;
      cycleTarget: number;
    }
    ```
  - Definir tipos de validación por campo e inputs crudos del formulario (`SettingsFieldErrors`, `SettingsFormInput`).
- `src/utils/cycleSettings.ts` y `src/utils/cycleSettings.test.ts`:
  - Actualizar `validateCycleSettings` y crear funciones puras de validación individual por campo con los límites de HU-005:
    - Estudio: 25 a 90 min.
    - Descanso corto: 5 a 20 min.
    - Descanso largo: 15 a 30 min.
    - Pomodoros por ciclo: 2 a 8.
  - Retornar `{ valid: true }` o `{ valid: false, error: string }` con mensajes pedagógicos claros en español.
  - Pruebas unitarias de valores válidos, límites exactos, decimales, texto, vacíos, ceros y negativos.
- `src/storage/settingsStorage.ts` y `src/storage/settingsStorage.test.ts`:
  - Funciones puras de persistencia: `loadSettings(): Promise<PomodoroSettings>` y `saveSettings(settings: PomodoroSettings): Promise<void>`.
  - Almacenar bajo la clave `@pomodoro_settings`.
  - Fallback tolerante y seguro a valores por defecto `DEFAULT_SETTINGS` (25/5/15/4) si la clave no existe o el JSON es inválido/corrupto (RF-011, Decisión 8).
  - Pruebas unitarias de guardado, lectura, JSON corrupto y recuperación silenciosa de valores por defecto.
- `src/context/SettingsContext.tsx` y `src/context/SettingsContext.test.tsx`:
  - Proveedor `SettingsProvider` y hook `useSettings()`.
  - Exponer `settings`, `loading`, `saveSettings(newSettings)` y `resetToDefaults()`.
  - Coordinar la actualización con la sesión activa:
    - Notificar a `StudySessionContext` para que, si el temporizador está en reposo, actualice de inmediato la duración nominal visible (RF-006).
    - Si el temporizador está corriendo o pausado, preservar el conteo actual y suministrar los nuevos valores para las transiciones siguientes (RF-007).
  - Pruebas unitarias simulando guardado en reposo vs. guardado en sesión activa.

### Capa 2 — Diseño e interfaz (sin llamadas a storage ni cálculos de timestamps)

- `src/constants/theme.ts`:
  - Tokens de estilo para formulario: bordes en `#7678A6`, foco/acento en `#141759`, error en `danger` (`#D33724`), campos de 72 × 48 px centrados, y botón de ajustes en la cabecera.
- `src/components/SettingsForm.tsx` y `src/components/SettingsForm.test.tsx`:
  - Formulario con 4 campos numéricos (`keyboardType="number-pad"`).
  - Validación instantánea al escribir (`onChangeText`) con mensajes de error en línea debajo de cada campo inválido.
  - Botón primario «Guardar» (`#141759` con texto `#FEFFFE`), deshabilitado cuando hay errores de validación.
  - Botón secundario «Restablecer valores por defecto» (`#D33724` con texto `#FEFFFE`).
- `src/components/ResetSettingsModal.tsx` y `src/components/ResetSettingsModal.test.tsx`:
  - Modal personalizado de confirmación con diseño institucional Cotopaxi.
  - Advierte que los valores regresarán a 25/5/15/4.
  - Botón destructivo «Restablecer» en `#D33724` y botón «Cancelar» en `#141759`.
- `src/app/settings.tsx`:
  - Pantalla de configuración montada con `KeyboardAvoidingView` y `ScrollView` para que el teclado no tape los campos ni el botón de guardar.
  - Cabecera con título «Ajustes», botón de retorno y retroalimentación visible tras guardar.
- `src/app/index.tsx`:
  - Añadir botón de ajustes con icono de engranaje en la esquina superior derecha del encabezado, enlazado a `/settings` mediante Expo Router.

---

## Organización por capa

### Capa 1: Lógica de negocio
1. Las funciones de validación en `src/utils/cycleSettings.ts` son puras, deterministas y libres de efectos.
2. `src/storage/settingsStorage.ts` encapsula el acceso a `AsyncStorage`, separando completamente los ajustes de la sesión activa (`@pomodoro_settings` vs. `pomodoro.activeSession`).
3. `src/context/SettingsContext.tsx` orquesta el ciclo de vida de los ajustes y sincroniza con `StudySessionContext`.

### Capa 2: Diseño e interfaz
1. Los componentes `SettingsForm` y `ResetSettingsModal` reciben datos y callbacks por `props`.
2. Las pantallas `index.tsx` y `settings.tsx` únicamente conectan los contextos con los componentes presentacionales.
3. Se respetan estrictamente los estándares de accesibilidad (objetivos táctiles ≥ 44 px, `accessibilityLabel`, contraste WCAG ≥ 4.5:1).

---

## Algoritmo en pseudocódigo

### Validación reactiva en formulario de ajustes

```text
funcion alCambiarTexto(campo, texto):
  formulario[campo] = texto
  resultado = validarCampo(campo, texto)
  si resultado.valido:
    errores[campo] = null
  si no:
    errores[campo] = resultado.mensajeError

  formularioValido = (
    errores.estudio == null y
    errores.descansoCorto == null y
    errores.descansoLargo == null y
    errores.ciclo == null y
    todosCamposLlenos(formulario)
  )
  botonGuardarHabilitado = formularioValido
```

### Guardado y aplicación de ajustes según estado de sesión

```text
funcion guardarAjustes(nuevosAjustes):
  persistirEnStorage("@pomodoro_settings", nuevosAjustes)
  actualizarEstadoSettingsContext(nuevosAjustes)

  si sesionActual.status == "stopped":
    // En reposo: actualizar de inmediato la pantalla principal
    sesionActualizada = crearSesionPreparada(
      duracion = nuevosAjustes.studyDurationMinutes * 60,
      pomodoros = 0,
      objetivo = nuevosAjustes.cycleTarget
    )
    persistirSesion(sesionActualizada)
    actualizarSesionContext(sesionActualizada)
  si no:
    // En curso o en pausa: conservar sesión activa intacta
    // Los nuevos tiempos se asignan a las duraciones futuras del ciclo
    actualizarDuracionesFuturas(nuevosAjustes)

  mostrarMensajeExito("Ajustes guardados")
  navegarAtras()
```

### Restablecer a valores por defecto con confirmación

```text
funcion solicitarRestablecer():
  mostrarModalConfirmacionRestablecer(verdadero)

funcion confirmarRestablecer():
  mostrarModalConfirmacionRestablecer(falso)
  valoresDefecto = { studyDurationMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15, cycleTarget: 4 }
  guardarAjustes(valoresDefecto)
  actualizarCamposFormulario(valoresDefecto)
  mostrarConfirmacionVisual("Valores por defecto restablecidos")

funcion cancelarRestablecer():
  mostrarModalConfirmacionRestablecer(falso)
  // No se alteran los campos ni los datos guardados
```

---

## Datos del estudiante y acciones destructivas

- **Persistencia local y desacoplada:** La clave `@pomodoro_settings` almacena únicamente 4 números enteros. No se guarda telemetría ni información privada.
- **Acción destructiva de restablecimiento:** De acuerdo con el Principio 7 de la Constitución, restablecer a valores por defecto exige confirmación explícita mediante un modal antes de alterar los ajustes guardados.
- **Tolerancia a fallos:** Si el contenido en almacenamiento es nulo, inválido o está corrupto, la aplicación recupera de forma segura los valores por defecto (25/5/15/4) sin provocar fallos de ejecución.

---

## Decisiones técnicas y alternativas descartadas

1. **Clave independiente `@pomodoro_settings` vs. unificar en `pomodoro.activeSession`:**
   - *Adoptada (Decisión 8):* Clave independiente para ajustes. Evita contaminar el contrato de sesión y permite modificar configuraciones sin riesgo de corromper el estado del temporizador activo.
   - *Descartada:* Fusionar configuraciones y sesión en una sola clave monolítica.
2. **Validación reactiva instantánea vs. validación al presionar Guardar:**
   - *Adoptada (Decisión 5):* Validación por campo con feedback inmediato en línea. El estudiante conoce al instante qué rango es admitido sin frustrarse al final del formulario.
   - *Descartada:* Permitir escribir cualquier valor y solo mostrar un diálogo de error al pulsar Guardar.
3. **Actualización condicionada por estado de reposo:**
   - *Adoptada (Decisión 7):* Actualización visual inmediata si el temporizador está en reposo; mantenimiento riguroso de la cuenta si está en curso o en pausa.
   - *Descartada:* Reiniciar o truncar una fase en curso forzosamente al guardar ajustes, o no reflejar el cambio en reposo hasta reiniciar la app.
4. **Modal personalizado Cotopaxi vs. `Alert.alert` del sistema:**
   - *Adoptada (Decisión 6):* Modal con tokens visuales oficiales (`white`, `navyBrand`, `danger`). Consistencia estética en Android e iOS sin depender de alertas nativas heterogéneas.
   - *Descartada:* Alerta nativa genérica no estilizada.

---

## Estrategia de pruebas

### Pruebas unitarias automatizadas con Jest (`npx jest`)

- `cycleSettings.test.ts`:
  - Validación de estudio (25 a 90 min): valores válidos (25, 50, 90), límites inválidos (24, 91), decimales, negativos, texto y vacío.
  - Validación de descanso corto (5 a 20 min): límites válidos (5, 20), inválidos (4, 21).
  - Validación de descanso largo (15 a 30 min): límites válidos (15, 30), inválidos (14, 31).
  - Validación de pomodoros por ciclo (2 a 8): límites válidos (2, 8), inválidos (1, 9).
  - Función integradora de validación de formulario completo.
- `settingsStorage.test.ts`:
  - Guardado y carga exitosa de ajustes personalizados.
  - Carga con clave ausente retornando valores por defecto (25/5/15/4).
  - Carga con JSON corrupto o tipos inválidos recuperando valores por defecto de forma segura.
- `SettingsContext.test.tsx` y `StudySessionContext.test.tsx`:
  - Modificación de ajustes en reposo actualizando inmediatamente la duración nominal visible.
  - Modificación de ajustes con sesión corriendo o en pausa conservando el conteo de la fase activa.
  - Flujo de restablecimiento a valores por defecto tras confirmación.
- `SettingsForm.test.tsx` y `ResetSettingsModal.test.tsx`:
  - Despliegue de mensajes de error en línea ante entradas inválidas.
  - Habilitación e inhabilitación correcta del botón «Guardar».
  - Invocación de callbacks al confirmar y cancelar en el modal de restablecimiento.

### Verificación manual en dispositivo móvil / APK

- Navegar a `/settings` desde la pantalla principal mediante el botón de engranaje en la cabecera.
- Ingresar valores fuera de rango (ej. 10 en estudio, 2 en descanso corto) y corroborar que aparecen los mensajes de error en línea y el botón «Guardar» se bloquea.
- Ingresar valores válidos (ej. 30 en estudio, 10 en descanso corto), presionar «Guardar» y corroborar el mensaje de éxito y la actualización inmediata a 30:00 en reposo.
- Iniciar una sesión de estudio a 30:00, entrar a ajustes, cambiar a 45:00 y guardar: corroborar que la sesión en curso sigue contando desde 30:00 sin saltos bruscos.
- Presionar «Restablecer valores por defecto»: corroborar la aparición del modal de confirmación, cancelar sin cambios, y luego confirmar verificando el retorno a 25/5/15/4.
- Cerrar la aplicación desde recientes, volver a abrirla y corroborar que los ajustes personalizados se conservaron.
- Probar el teclado numérico en un dispositivo físico asegurando que `KeyboardAvoidingView` evita que el teclado tape los campos o el botón de guardar.

---

## Cobertura de requisitos

- **RF-001:** Botón de ajustes en `index.tsx` y pantalla `settings.tsx`.
- **RF-002 y RF-003:** `cycleSettings.ts`, `SettingsForm.tsx` (validación en línea y mensajes de error).
- **RF-004:** `SettingsForm.tsx`, `settings.tsx`, `SettingsContext.tsx` (guardado y regreso).
- **RF-005:** `settingsStorage.ts` (persistencia en `@pomodoro_settings`).
- **RF-006:** `StudySessionContext.tsx`, `SettingsContext.tsx` (actualización inmediata en reposo).
- **RF-007:** `StudySessionContext.tsx` (conservación de fase activa en curso o en pausa).
- **RF-008, RF-009 y RF-010:** `ResetSettingsModal.tsx`, `SettingsContext.tsx` (confirmación explícita de restablecimiento).
- **RF-011:** `settingsStorage.ts` (recuperación tolerante ante datos corruptos).
- **RNF-001 a RNF-005:** Persistencia local sin red, validación reactiva instantánea, sin impacto en sesión activa, confirmación explícita y cero recopilación de datos sensibles.

---

## Criterio de salida de la planificación

Se formulan 7 tareas de implementación ordenadas estrictamente por dependencias (tipos → utilidades → almacenamiento → contexto → componentes → pantallas → verificación), cada una de 20 a 30 minutos de duración máxima estimada. No se requiere dividir la spec.
