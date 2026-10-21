# Contexto Completo del Proyecto Academia_Cotopaxi


================================================
ðŸ“„ ARCHIVO: .agent\rules\AGENTS.md
================================================

# Pomodoro Academia Cotopaxi

Aplicación móvil de estudio con técnica Pomodoro para los estudiantes de la Academia Cotopaxi: iniciar, pausar y reiniciar sesiones de estudio, alternar automáticamente entre estudio, descanso corto y descanso largo, mantener el conteo exacto con el celular bloqueado o la app cerrada, emitir avisos sonoros/vibración al finalizar cada fase, personalizar duraciones y funcionar 100% offline, sin cuentas y sin publicidad. Proyecto construido con Spec-Driven Development (SDD).

## Stack y estructura

### Capa 1: Lógica de Negocio

Ningún archivo de esta capa puede importar componentes visuales de React Native (`View`, `Text`, `StyleSheet`, etc.) ni constantes de colores.

- **`src/types/`**: Interfaces, tipos y contratos de datos TypeScript (`PomodoroPhase`, `PomodoroSettings`, `TimerSession`, etc.).
- **`src/utils/`**: Funciones puras de cálculo de tiempo por timestamps (`endTimestamp - Date.now()`), formateo `MM:SS`, cálculo de transiciones de ciclo Pomodoro y validación de rangos de configuración.
- **`src/storage/`**: Capa de persistencia local con `@react-native-async-storage/async-storage` para guardar ajustes del usuario y el estado de la sesión activa.
- **`src/services/`**: Servicios nativos para gestión de permisos, programación de notificaciones locales (`expo-notifications`), reproducción de sonido tipo alarma en modo silencio (`expo-av` / canales de alta prioridad Android) y vibración.
- **`src/context/`**: Proveedores de estado global (`PomodoroContext`, `SettingsContext`) que orquestan `storage`, `services`, `utils` y `AppState`, exponiendo hooks limpios para que la UI los consuma.
- Pruebas unitarias junto a cada módulo, en `__tests__/`.

### Capa 2: Diseño e Interfaz de Usuario

Ningún archivo de esta capa puede hacer llamadas directas a `AsyncStorage`, `expo-notifications` ni cálculos manuales de timestamps.

- **`src/constants/`**: `theme.ts` con la paleta de colores oficial de la Academia Cotopaxi, tipografías, espaciados y constantes visuales.
- **`src/components/`**: Componentes visuales puros y reutilizables (reloj, controles, indicador de pomodoros, modales de confirmación, formularios de ajustes). Reciben datos y callbacks vía `props`.
- **`src/app/`**: Pantallas de navegación con Expo Router (`_layout.tsx`, `index.tsx`, `settings.tsx`). Su única función es conectar el `context` con los `components`.
- Pruebas unitarias junto a cada módulo, en `__tests__/`.

## Comandos

- Instalar dependencias: npx expo install jest-expo
- Instalar tipos: npm install --save-dev @types/jest
- Pruebas: npx jest
- Tipos: npx tsc --noEmit
- Ejecutar la app: npx expo start (solo cuando yo lo pida)

## Dónde está cada cosa

- @docs/constitution.md: principios innegociables del proyecto.
- `docs/historias/`: historias de usuario en Gherkin (la entradade todo).
- `specs/NNN-nombre/`: `decisiones.md`, `spec.md`, `plan.md` y `tasks.md` de cada historia.
- @MEMORY.md: estado actual del trabajo.
- `.github/skills/`: método SDD (`sdd`), reglas del Pomodoro, paleta de la Academia Cotopaxi, convenciones.

## Cómo trabajar

1. Al empezar cualquier sesión o tarea, lee @MEMORY.md y @docs/constitution.md.
2. Código y nombres de identificadores en inglés; textos de interfaz, comentarios y documentos en español.
3. No tomes decisiones de producto o de diseño que la historia o `decisiones.md` no definan. Márcalas como `[NECESITA ACLARACIÓN]` y avísame.
4. Haz solo la fase o la tarea que te pido. No avances a la siguiente.
5. En la lógica, escribe primero las pruebas.
6. Pregunta antes de instalar dependencias nuevas, crear archivos fuera del plan o cambiar el formato de los datos guardados en almacenamiento local.
7. No reemplaces archivos existentes si la tarea no lo pide. No guardes datos sensibles. No hagas commit.

## MEMORY.md

Solo tiene "Estado actual" y "Próximos pasos". Al terminar una fase o tarea actualiza únicamente esas dos secciones. No copies decisiones ni contenido de la spec. Mantenlo en unas 50 líneas.


================================================
ðŸ“„ ARCHIVO: .agent\skills\cotopaxi-brand\SKILL.md
================================================

---
name: cotopaxi-brand
description: Úsala siempre que crees o modifiques colores, temas, estilos o pantallas del temporizador Pomodoro de la Academia Cotopaxi.
---

# Paleta de la Academia Cotopaxi (Temporizador Pomodoro)

Esta skill aplica solo a la Capa 2 (constitución, principio 3): `src/constants/theme.ts`, `src/components/` y `src/app/`. Los colores se declaran una sola vez en `src/constants/theme.ts` y los componentes los leen de ahí; ningún componente escribe un hexadecimal a mano. Ningún archivo de Capa 1 importa colores.

## Paleta oficial

Fuente: colores extraídos con Adobe Color (`Colores.jpeg`) a partir del escudo de la Academia Cotopaxi.

| Token (`theme.ts`) | Hex       | RGB           | Nombre                      | Uso en la plantilla activa          |
| ------------------ | --------- | ------------- | --------------------------- | ----------------------------------- |
| `navyDeep`         | `#0A0E59` | 10, 14, 89    | Azul marino profundo        | Sin rol asignado (reservado)        |
| `navyBrand`        | `#141759` | 20, 23, 89    | Azul institucional Cotopaxi | Texto, reloj, botón primario        |
| `slate`            | `#7678A6` | 118, 120, 166 | Azul lavanda / pizarra      | Fase de Descanso, bordes, inactivos |
| `gold`             | `#D9A714` | 217, 167, 20  | Dorado sol Cotopaxi         | Fase de Estudio, acentos            |
| `white`            | `#FEFFFE` | 254, 255, 254 | Blanco institucional        | Fondo de pantalla                   |

## Colores funcionales (fuera de la paleta del escudo)

Se permiten solo para estos usos:

- `danger` `#D33724`: acciones destructivas (Reiniciar / Restablecer). Texto `#FEFFFE` (4.83:1).
- `inkDark` `#111111`: texto sobre lavanda `#7678A6` (4.50:1) o sobre dorado `#D9A714` (8.53:1).

## Roles (contraste WCAG ≥ 4.5:1)

- Fondo de pantalla y superficies claras: `#FEFFFE`, con texto `#141759` (16.16:1).
- Superficies oscuras (círculo del reloj, tarjetas de ajustes) y botón primario: fondo `#141759`, texto `#FEFFFE` (16.16:1) o acento `#D9A714` (7.32:1).
- Fase de Estudio y botón o insignia destacada: fondo `#D9A714`, texto `#141759` (7.32:1) o `#111111` (8.53:1).
- Fase de Descanso e insignia secundaria: fondo `#7678A6`, únicamente con texto `#111111` (4.50:1).
- Bordes, separadores e indicadores inactivos: `#7678A6`.

## Plantilla activa: fondo blanco

### Estructura de la pantalla del temporizador

1. Encabezado: etiqueta "ACADEMIA COTOPAXI" y título "Pomodoro" en `#141759`, con el botón de ajustes a la derecha.
2. Insignia de fase centrada, en forma de píldora.
3. Reloj `MM:SS` dentro de un círculo `#141759` de 280 px, con un anillo de progreso de 10 px que muestra el tiempo restante.
4. Indicador de pomodoros: 4 puntos y el texto "2 de 4 pomodoros".
5. Botones al pie: acción principal (56 px de alto) y Reiniciar (48 px), con radio de 16.

### Color por elemento

| Elemento                                                | Fondo                              | Texto / ícono                                   | Contraste        |
| ------------------------------------------------------- | ---------------------------------- | ----------------------------------------------- | ---------------- |
| Fondo de pantalla (temporizador y ajustes)              | `#FEFFFE`                          | `#141759`                                       | 16.16:1          |
| Etiqueta "ACADEMIA COTOPAXI" y título                   | `#FEFFFE`                          | `#141759`                                       | 16.16:1          |
| Círculo del reloj                                       | `#141759`                          | `#FEFFFE`                                       | 16.16:1          |
| Anillo de progreso en Estudio                           | pista `#7678A6` al 35 %            | progreso `#D9A714`                              | no es texto      |
| Anillo de progreso en Descanso                          | pista `#7678A6` al 35 %            | progreso `#7678A6`                              | no es texto      |
| Insignia "Estudio"                                      | `#D9A714`                          | `#141759`                                       | 7.32:1           |
| Insignia "Descanso corto" / "Descanso largo"            | `#7678A6`                          | `#111111`                                       | 4.50:1           |
| Punto de pomodoro completado                            | `#D9A714`                          | n/a                                             | n/a              |
| Punto de pomodoro pendiente                             | borde `#7678A6` de 2 px            | n/a                                             | n/a              |
| Contador "2 de 4 pomodoros"                             | `#FEFFFE`                          | `#141759`                                       | 16.16:1          |
| Botón Pausar                                            | `#D9A714`                          | `#141759`                                       | 7.32:1           |
| Botón Iniciar / Reanudar / Guardar (sobre fondo blanco) | `#141759`                          | `#FEFFFE`                                       | 16.16:1          |
| Botón destructivo (Reiniciar, Restablecer)              | `#D33724`                          | `#FEFFFE`                                       | 4.83:1           |
| Botón de ajustes (engranaje)                            | `#141759`, borde `#7678A6`         | `#FEFFFE`                                       | 16.16:1          |
| Tarjetas de ajustes y barra inferior de botones         | `#141759`                          | `#FEFFFE`                                       | 16.16:1          |
| Campo numérico                                          | `#FEFFFE`, borde `#7678A6` de 2 px | `#141759`                                       | 16.16:1          |
| Guardar (dentro de tarjeta oscura)                      | `#D9A714`                          | `#141759`                                       | 7.32:1           |
| Modal de confirmación                                   | `#FEFFFE`                          | `#141759`; confirmar en `#D33724` con `#FEFFFE` | 16.16:1 / 4.83:1 |

### Medidas

- Márgenes de pantalla de 24 px; radio de tarjetas de 20; radio de botones de 16; objetivos táctiles de al menos 44 px.
- Campo numérico de 72 × 48 px, texto centrado.
- Reloj de 64 px, peso 800, con `fontVariant: ['tabular-nums']`.

### Reglas de esta plantilla

- No se usa `#0A0E59`. El azul oscuro de la interfaz es siempre `#141759`.
- Guardar es azul `#141759` sobre fondo blanco y dorado `#D9A714` dentro de una tarjeta `#141759`, porque azul sobre azul no se distingue.
- El dorado `#D9A714` nunca se usa como texto sobre blanco (2.21:1). Solo sirve como relleno o como texto sobre `#141759`.
- Los puntos de pomodoros no llevan texto: el contador "2 de 4 pomodoros" siempre se muestra aparte.

## Alternativas documentadas (NO activas)

No las apliques hasta que yo apruebe una y la pase a "Plantilla activa". Todas usan solo combinaciones de la tabla de contraste.

### Alternativa A: pantalla completa por fase

- Estudio: fondo de pantalla `#D9A714`, texto y reloj `#141759` (7.32:1), sin contenedor del reloj (112 px).
- Descanso: fondo de pantalla `#7678A6`, texto y reloj `#111111` (4.50:1).
- Insignia de fase `#141759` con texto `#FEFFFE`; botón primario `#141759` con texto `#FEFFFE`; barra de progreso con pista `#FEFFFE` y relleno `#141759`.
- Descanso corto y largo comparten color y se distinguen solo por texto. El texto de 14 px o más es obligatorio.

### Alternativa B: oscuro por capas

- Fondo de pantalla `#141759`; tarjetas del reloj y de pomodoros `#0A0E59`.
- Reloj `#FEFFFE` sobre `#0A0E59` (17.17:1); etiqueta de fase y acentos `#D9A714` sobre `#0A0E59` (7.78:1).
- Pausar `#D9A714` con texto `#0A0E59`; Reanudar `#FEFFFE` con texto `#141759`.
- Es la única alternativa que usa `#0A0E59`.

### Alternativa C: minimalista blanco

- Fondo `#FEFFFE`; franja superior de 14 px `#D9A714` en Estudio y `#7678A6` en Descanso.
- Reloj de 120 px en `#141759` directo sobre el fondo (16.16:1), sin círculo ni tarjeta.
- Indicador de fase: punto de 14 px del color de la franja y texto `#141759`.
- Barra de progreso de 6 px: pista `#7678A6` y relleno `#D9A714`.

## Estados sin color definido

La paleta no dice cómo se ven estos estados. No los decidas: márcalos `[NECESITA ACLARACIÓN]` y avisa.

- Temporizador pausado (¿cambia el color del reloj o solo el botón?).
- Fase terminada y lista para iniciar.
- Alarma sonando con el botón "Detener alarma".
- Diferencia visual entre Descanso corto y Descanso largo (hoy comparten color).
- Botones deshabilitados.
- Tipografía: los diseños usan Manrope, que no está aprobada. En React Native sería una dependencia nueva y requiere mi aprobación. Hasta entonces, usa la fuente del sistema.

## Prohibido (no cumplen 4.5:1 con texto normal)

- Blanco `#FEFFFE` sobre dorado `#D9A714` (2.21:1).
- Blanco `#FEFFFE` sobre lavanda `#7678A6` (4.18:1).
- Lavanda `#7678A6` como texto sobre `#0A0E59` (4.10:1) o sobre `#141759` (3.86:1).
- Dorado `#D9A714` sobre lavanda `#7678A6` (1.89:1).
- Dorado `#D9A714` como texto sobre blanco (2.21:1).
- Azul `#141759` como texto sobre lavanda `#7678A6` (3.86:1).

## Reglas

- La fase actual se comunica siempre con texto en español ("Estudio", "Descanso corto", "Descanso largo"), además del color.
- Usa solo los colores de la paleta oficial y los dos funcionales. Si falta uno, pregunta antes de inventarlo.
- No hay publicidad ni elementos decorativos con colores fuera de esta lista.

## Lista manual de verificación en el dispositivo

- [ ] El reloj `MM:SS` se lee con claridad a pleno sol y con brillo bajo.
- [ ] Las insignias de fase se distinguen entre "Estudio" (dorado) y "Descanso" (lavanda), y el texto dice la fase.
- [ ] Ningún texto aparece en una combinación de la lista Prohibido.
- [ ] Los botones de Reiniciar y Restablecer se distinguen a simple vista del resto.
- [ ] Ningún componente tiene un hexadecimal escrito directamente.
- [ ] Guardar se distingue de su fondo en cada pantalla (azul sobre blanco, dorado sobre tarjeta azul).

## Al terminar

Indica qué elementos de la plantilla aplicaste y qué estados dejaste como `[NECESITA ACLARACIÓN]`.


================================================
ðŸ“„ ARCHIVO: .agent\skills\grill-me\grilling\SKILL.md
================================================

---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Word each question so "yes" accepts your recommended answer.

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.


================================================
ðŸ“„ ARCHIVO: .agent\skills\grill-me\SKILL.md
================================================

---
name: grill-me
description: A relentless interview to sharpen a plan or design.
disable-model-invocation: true
---

Call the Skill tool with "grilling".


================================================
ðŸ“„ ARCHIVO: .agent\skills\pomodoro-rules\SKILL.md
================================================

---
name: pomodoro-rules
description: Úsala siempre que escribas, modifiques o revises código, pruebas o textos que calculen tiempos del temporizador, cambios entre estudio y descanso, conteo con el celular bloqueado o ajustes del Pomodoro.
---

# Reglas del Pomodoro de la Academia Cotopaxi

Estas reglas son lógica de negocio pura. Viven en `src/utils/` (funciones) y `src/types/` (contratos), y se prueban con Jest en `__tests__/` junto a cada módulo. No dependen de React, `AsyncStorage`, `expo-notifications` ni `AppState` (constitución, principios 3 y 4).

## Reglas del ciclo

- Los valores por defecto son: 25 minutos de estudio, 5 minutos de descanso corto, 15 minutos de descanso largo y 4 pomodoros por ciclo antes del descanso largo.
- Existen tres fases: Estudio, Descanso corto y Descanso largo.
- Cuando termina un tiempo de Estudio:
  - Si todavía no se completan los pomodoros necesarios para el descanso largo, la aplicación deja listo un Descanso corto para que el estudiante lo inicie.
  - Si se completa la cantidad de pomodoros configurada para el ciclo (4 por defecto), la aplicación deja listo un Descanso largo y el contador de pomodoros del ciclo vuelve a cero.
- Cuando termina un Descanso corto o un Descanso largo, la aplicación deja listo el siguiente tiempo de Estudio.
- Si el estudiante cambia la duración de una fase mientras el temporizador está corriendo o pausado, la fase actual termina con el tiempo con el que empezó y el nuevo valor se aplica desde la próxima fase.

## Exactitud del tiempo y validaciones

- El tiempo restante se calcula siempre como `endTimestamp - Date.now()` (constitución, principio 5), nunca contando segundos en memoria. Así es exacto aunque el estudiante bloquee el celular o cierre la aplicación: al volver a abrirla, se descuenta todo el tiempo que pasó mientras estuvo cerrada o bloqueada.
- Si el tiempo se cumple mientras la aplicación está cerrada o el celular bloqueado, igual se emite el aviso de fin (respaldado por la notificación local programada) y, al abrir la aplicación, la fase aparece como terminada.
- Si el estudiante pausa el temporizador, se guarda el tiempo restante exacto y se cancela el aviso programado. Al bloquear o cerrar la aplicación y volver, sigue pausado en el mismo tiempo restante y no emite ningún aviso.
- Reiniciar el temporizador y restablecer los valores por defecto son acciones destructivas: siempre piden confirmación explícita (principio 7).
- La representación y el formato de guardado de los datos los decide la spec y el plan, no el agente. Si no están definidos, márcalo `[NECESITA ACLARACIÓN]`.
- En los ajustes, rechaza campos vacíos, el cero, números negativos, valores con decimales y valores fuera del rango permitido por la spec. Si la spec no define el rango, no lo inventes: márcalo `[NECESITA ACLARACIÓN]`.

## Checklist de revisión

### Se prueba con Jest (`npx jest`, con timestamps simulados)

- [ ] ¿Se prueban el paso de estudio a descanso corto (pomodoros 1, 2 y 3) y el paso al descanso largo en el 4.º pomodoro con reinicio del contador a cero?
- [ ] ¿Se prueba el cálculo del tiempo restante con `endTimestamp - Date.now()` para distintos intervalos transcurridos, incluido un intervalo largo equivalente a bloqueo o cierre?
- [ ] ¿Se prueba qué ocurre cuando el tiempo ya se cumplió al recalcular (fase terminada, sin tiempo restante negativo)?
- [ ] ¿Se prueba que una sesión pausada conserva el mismo tiempo restante al recalcular?
- [ ] ¿Se prueban valores inválidos en los ajustes (vacío, cero, negativos, decimales, fuera de rango) y el cambio de un tiempo con una fase en curso?

### Se verifica a mano en el dispositivo o APK

- [ ] ¿El aviso suena puntual con el celular bloqueado o la app cerrada y no suena si la sesión estaba pausada? (lista manual de `rn-conventions`)
- [ ] ¿Reiniciar y restablecer piden confirmación explícita?

### En ambos casos

- [ ] ¿Los textos y mensajes coinciden exactamente con los de la spec?

## Al terminar

Indica qué puntos del checklist has comprobado y cómo.


================================================
ðŸ“„ ARCHIVO: .agent\skills\rn-conventions\SKILL.md
================================================

---
name: rn-conventions
description: Úsala siempre que crees o modifiques pantallas, controles del temporizador, formularios de ajustes, notificaciones o manejo de ciclo de vida en React Native.
---

# Convenciones de Interfaz y Dispositivo en React Native (Pomodoro Cotopaxi)

Estas convenciones respetan la separación en dos capas de la constitución (principio 3). Cada regla indica a qué capa aplica.

## Capa 2: interfaz (`src/constants/`, `src/components/`, `src/app/`)

- Estilos con `StyleSheet.create`. Sin librerías de componentes de terceros no aprobadas.
- Reloj del temporizador en formato `MM:SS` con fuente tabular (`fontVariant: ['tabular-nums']`) para evitar que los dígitos salten cada segundo. El componente solo recibe el texto ya formateado por `props`; no calcula tiempos.
- Respeta las áreas seguras (`SafeAreaView`).
- En la pantalla de ajustes, usa teclado numérico entero (`keyboardType="number-pad"`) y un contenedor desplazable (`KeyboardAvoidingView` / `ScrollView`) para que el teclado nunca tape los campos ni el botón de guardar.
- Objetivos táctiles de al menos 44x44 puntos y `accessibilityLabel` en español en todos los botones (Iniciar, Pausar, Reanudar, Reiniciar, Detener alarma, Guardar, Restablecer).
- Las acciones destructivas (reiniciar el temporizador, restablecer valores por defecto) siempre piden confirmación explícita mediante diálogo del sistema.
- Todos los textos visibles al estudiante están en español.
- Ningún archivo de esta capa llama a `AsyncStorage` ni `expo-notifications`, ni calcula el tiempo restante con `Date.now()`. Todo llega por hooks de `src/context/`.

## Capa 1: ciclo de vida y notificaciones (`src/context/`, `src/services/`)

- Escucha los cambios de `AppState` (`active`, `background`, `inactive`) en `src/context/`, nunca en las pantallas. Al volver a `active`, recalcula de inmediato el tiempo restante con `endTimestamp - Date.now()` mediante las funciones de `src/utils/`.
- El conteo nunca depende solo de `setInterval`: se calcula a partir de `endTimestamp` persistido (constitución, principio 5).
- En Android, configura en `src/services/` un canal de notificaciones de máxima prioridad (`AndroidImportance.MAX`, sonido, vibración y visibilidad en pantalla de bloqueo) para que el aviso de fin de fase suene como alarma incluso en segundo plano.
- Estos archivos no importan componentes visuales ni constantes de colores.

## Lista manual de verificación en el dispositivo

Se prueba en dispositivo o APK. Estos puntos no se automatizan con Jest.

- [ ] Al abrir por primera vez llega directo al temporizador sin login, funciona en Modo Avión y no muestra publicidad.
- [ ] El reloj cuenta regresivamente en formato `MM:SS`, permite pausar/reanudar y pide confirmación antes de reiniciar.
- [ ] Muestra la fase actual ("Estudio", "Descanso corto", "Descanso largo") y el contador de pomodoros del ciclo, pasando al descanso largo tras el 4.º pomodoro.
- [ ] Al bloquear el celular o cerrar la app desde recientes con el temporizador corriendo, descuenta el tiempo real transcurrido y avisa puntual al llegar a cero.
- [ ] El aviso de fin de fase suena y vibra con el celular bloqueado y en modo silencio, y se puede detener con "Detener alarma".
- [ ] Al cerrar y reabrir la app, la sesión activa y los tiempos personalizados se conservan.
- [ ] En ajustes rechaza valores inválidos, permite restablecer a 25/5/15/4 con confirmación y no altera una fase que ya esté corriendo.
- [ ] El teclado numérico no tapa los campos ni el botón de guardar.


================================================
ðŸ“„ ARCHIVO: .agent\skills\sdd\SKILL.md
================================================

---
name: sdd
description: Úsala siempre que trabajes con Spec-Driven Development para redactar, revisar o cambiar specs, planes y tareas, o implementar y validar tareas de una spec.
---

# Spec-Driven Development (SDD)

Código e identificadores en inglés; textos de interfaz, comentarios y documentos en español.

## Flujo y quién escribe qué

Constitución → grill-me → Spec → Plan y tareas → Implementación → Cambio.

| Fase           | Quién                                           | Escribe solo                             |
| :------------- | :---------------------------------------------- | :--------------------------------------- |
| Decisiones     | skill `grill-me` (`/grill-me`)                  | `specs/NNN-nombre/decisiones.md`         |
| Spec           | agente/skill `sdd-spec` (`/sdd-spec`)           | `specs/NNN-nombre/spec.md`               |
| Plan y tareas  | agente/skill `sdd-plan` (`/sdd-plan`)           | `specs/NNN-nombre/plan.md` y `tasks.md`  |
| Implementación | agente/skill `sdd-implement` (`/sdd-implement`) | código, pruebas y la casilla de la tarea |

- Nunca pases a la siguiente fase sin la aprobación explícita del usuario. Solo el usuario cambia una spec de `borrador` a `aprobada`.
- La spec manda: si algo no está en la spec, no se implementa (constitución, principio 2).
- Si falta una decisión: al redactar la spec, márcala `[NECESITA ACLARACIÓN]`; al planificar o implementar, para y pregunta.
- Un cambio de requisitos se hace primero en la spec, luego en el plan y las tareas, y por último en el código.
- Cada spec vive en `specs/NNN-nombre/`. `decisiones.md` lo genera `grill-me`; solo se le añade al final, numerada, una decisión que dicte el usuario para resolver una duda abierta.
- Al terminar una fase o tarea, actualiza en `MEMORY.md` solo "Estado actual" y "Próximos pasos" (indicando el siguiente agente/comando). No copies decisiones ni contenido de la spec. Unas 50 líneas en total.
- No se hace commit.

## Marcas de aprobación

Además de las decisiones de producto o de diseño que falten, márcalas `[NECESITA ACLARACIÓN]` y avisa al usuario cuando haga falta:

- Una dependencia nueva.
- Un archivo fuera de las carpetas definidas en la estructura del proyecto.
- Un cambio en el formato de los datos guardados en almacenamiento local.

## Plantilla de spec (spec.md)

# Spec NNN — <Nombre>

Estado: borrador | aprobada | implementada
HU de origen: docs/historias/HU-00N.md

## Contexto y objetivo

## Usuarios

## Historias de usuario

## Definiciones (solo si hay términos que puedan interpretarse de varias formas)

## Requisitos funcionales

## Requisitos no funcionales

## Casos límite

## Fuera de alcance

## Criterios de finalización

## Dudas abiertas

- [NECESITA ACLARACIÓN] <duda>

La spec describe el QUÉ y el POR QUÉ. Nada de stack, arquitectura, capas, formatos de almacenamiento ni nombres de archivos o carpetas. Un RF por comportamiento visible.

Los RF respetan los principios de la constitución que se traducen en comportamiento visible para el estudiante: funciona sin conexión, sin cuentas y sin publicidad; el tiempo es exacto con el celular bloqueado o la app cerrada; la sesión activa y los tiempos personalizados se conservan; las acciones destructivas piden confirmación explícita.

## Requisitos en EARS (en español)

- RF-x: CUANDO <evento>, EL SISTEMA <respuesta>.
- RF-x: SI <condición no deseada>, ENTONCES EL SISTEMA <respuesta>.
- RF-x: MIENTRAS <estado>, EL SISTEMA <respuesta>.
- RF-x: EL SISTEMA <comportamiento permanente>.

Cada RF debe ser verificable y terminar con "Origen:", indicando el escenario de la HU o la decisión de `decisiones.md` de la que sale. Cada escenario de la HU debe quedar cubierto por al menos un RF.

## Revisión final de la spec

Al terminar `spec.md`, lista sin proponer soluciones: contradicciones entre RF, escenarios de la HU sin RF y conflictos con los principios de `docs/constitution.md`. Máximo 10 puntos.

## Plan (plan.md)

Se organiza por capa (constitución, principio 3):

- **Archivos y responsabilidades:** los que se crean o modifican, agrupados por Capa 1 y Capa 2.
- **Capa 1** (`src/types/`, `src/utils/`, `src/storage/`, `src/services/`, `src/context/`): tipos y contratos; funciones puras (ciclo Pomodoro, validación de rangos, formateo `MM:SS`, tiempo restante con `endTimestamp - Date.now()`); persistencia; notificaciones, sonido y vibración; orquestación en contexto. Sin componentes visuales ni colores.
- **Capa 2** (`src/constants/`, `src/components/`, `src/app/`): cómo se pinta en la interfaz. Sin llamadas directas a `AsyncStorage` ni `expo-notifications`, ni cálculos de timestamps.
- **Algoritmo en pseudocódigo:** el conteo nunca depende solo de `setInterval` (principio 5).
- **Datos del estudiante:** qué se persiste, cuándo se restaura y qué acciones piden confirmación (principio 7).
- **Decisiones justificadas** con su alternativa descartada. Las de `decisiones.md` se citan por número.
- **Estrategia de pruebas:** qué se prueba con Jest en `__tests__/` junto a cada módulo de Capa 1 y qué se verifica a mano.
- Indica qué RF cubre cada parte.

## Tareas (tasks.md)

- [ ] **Tn. <Descripción>.** RF-x, RF-y
  - Hecho cuando: <comprobación verificable>.

Máximo 20-30 min por tarea, en orden de dependencia. Si salen más de 10, propón dividir la spec.

- Las tareas de Capa 1 empiezan por escribir la prueba y se verifican con `npx jest` y `npx tsc --noEmit`.
- Las tareas de interfaz, alarmas y segundo plano se verifican con la lista manual de `rn-conventions` en dispositivo/APK. Si tocan colores o estilos, también con `cotopaxi-brand`.

## Implementación

Una sola tarea cada vez:

1. Pruebas primero (en rojo) en `__tests__/`, solo en Capa 1.
2. Código hasta que pasen, siguiendo `plan.md` y las skills `pomodoro-rules`, `rn-conventions` y `cotopaxi-brand` cuando correspondan.
3. `npx jest` y `npx tsc --noEmit` en verde. Prohibido avanzar con pruebas en rojo o errores de tipos.
4. Revisión de fronteras: ningún archivo de Capa 1 importa componentes visuales ni colores; ningún archivo de Capa 2 llama a `AsyncStorage` ni `expo-notifications`, ni calcula timestamps. Si hay que cruzar la frontera, para y pregunta.
5. Marcar la tarea y parar.

Si la tarea toca la interfaz, bloqueo de pantalla o notificaciones, no ejecutes la app: entrega la lista manual de verificación y espera a que el usuario confirme que la probó en el dispositivo antes de marcarla como hecha. Si toca acciones destructivas (reiniciar o restablecer), verifica que pidan confirmación explícita.

No instales dependencias ni ejecutes `npx expo start` sin que el usuario lo pida.

Al cerrar la tarea, lista qué escenarios de la HU quedan cubiertos por pruebas y cuáles no. Informa; no declares que algo "está correcto".


================================================
ðŸ“„ ARCHIVO: .agent\skills\sdd-implements\SKILL.md
================================================

---
name: sdd-implement
description: SDD - Implementa una tarea de tasks.md con las pruebas primero y comprueba los escenarios de la HU.
---

Eres el agente de implementación del proyecto Pomodoro Academia Cotopaxi.

Antes de empezar lee `@MEMORY.md`, `@docs/constitution.md`, `.github/skills/sdd/SKILL.md`, y de la carpeta `specs/NNN-nombre/` lee `spec.md`, `plan.md` y `tasks.md`. Si no te digo qué tarea, usa la primera pendiente de `tasks.md` y dime cuál es antes de empezar.

Código e identificadores en inglés; textos de interfaz, comentarios y documentos en español.

## Fronteras entre capas

Antes de dar una tarea por terminada, comprueba que ningún archivo viole estas reglas (constitución, principio 3):

- **Capa 1** (`src/types/`, `src/utils/`, `src/storage/`, `src/services/`, `src/context/`): no importa componentes visuales de React Native (`View`, `Text`, `StyleSheet`, etc.) ni constantes de colores. Las funciones de `src/utils/` son puras: sin React, `AsyncStorage`, `expo-notifications` ni `AppState`.
- **Capa 2** (`src/constants/`, `src/components/`, `src/app/`): no llama directamente a `AsyncStorage` ni `expo-notifications`, ni hace cálculos manuales de timestamps. Solo consume la lógica mediante hooks de `src/context/`. Los componentes reciben datos y callbacks por `props`; las pantallas solo conectan `context` con `components`.
- Si para cumplir la tarea tendrías que cruzar la frontera, para y dímelo.

## Qué haces, por cada tarea

1. En la lógica (Capa 1), escribes primero las pruebas en `__tests__/` junto al módulo y compruebas que fallan (`npx jest`).
2. Escribes el código hasta que pasen, siguiendo `plan.md` y las skills `pomodoro-rules`, `rn-conventions` y `cotopaxi-brand` cuando correspondan.
3. Ejecutas `npx jest` y `npx tsc --noEmit` y me muestras el resultado. No avanzas con pruebas en rojo ni con errores de tipos.
4. Si la tarea toca la interfaz, bloqueo o notificaciones, no ejecutas la app: me entregas los puntos de la lista manual de `rn-conventions` que debo probar en el dispositivo/APK y esperas mi confirmación.
5. Con las pruebas en verde (y mi confirmación si hubo interfaz), marcas la tarea en `tasks.md` e indicas qué RF cubre.
6. Si la tarea toca acciones destructivas (reiniciar el temporizador o restablecer valores por defecto), verificas que pidan confirmación explícita (principio 7).
7. Listas qué escenarios de la HU quedan cubiertos por pruebas y cuáles no. Informas, no declaras que algo está correcto.
8. Actualizas en `MEMORY.md` solo "Estado actual" y "Próximos pasos".

Después PÁRATE. No empieces la siguiente tarea.

## Varias tareas seguidas

Solo si te nombro las tareas explícitamente (por ejemplo T2 a T4): las haces en ese orden, con las pruebas primero, y paras y me avisas si una prueba falla, si una tarea toca la interfaz o si una tarea cruza la frontera entre capas.

## Qué no haces

- No tocas `spec.md`, `plan.md` ni `decisiones.md`. Si algo no cuadra, para y dímelo.
- No instalas dependencias ni ejecutas `npx expo start` sin que te lo pida.
- No creas archivos fuera del plan ni cambias el formato de los datos guardados en almacenamiento local sin mi aprobación.
- No guardas datos sensibles.
- No reemplazas archivos existentes si la tarea no lo pide.
- No haces commit.

================================================
ðŸ“„ ARCHIVO: .agent\skills\sdd-plan\SKILL.md
================================================

---
name: sdd-plan
description: SDD - Genera plan.md y tasks.md de una spec aprobada sin escribir código.
---

Eres el agente de planificación del proyecto Pomodoro Academia Cotopaxi. Solo escribes `specs/NNN-nombre/plan.md` y `specs/NNN-nombre/tasks.md`. NO escribas código ni pruebas.

Antes de empezar lee `@MEMORY.md`, `@docs/constitution.md`, `.github/skills/sdd/SKILL.md`, `specs/NNN-nombre/spec.md` y `specs/NNN-nombre/decisiones.md`. Si no te digo qué carpeta, pregúntamelo.

Si `spec.md` no tiene `Estado: aprobada` o aún tiene `[NECESITA ACLARACIÓN]`, PARA y avísame; no generes nada.

Código e identificadores en inglés; textos de interfaz, comentarios y documentos en español.

## Arquitectura que debes respetar

El proyecto tiene dos capas con fronteras estrictas (constitución, principio 3). Todo el plan se organiza por capa.

- **Capa 1: lógica de negocio.** `src/types/`, `src/utils/`, `src/storage/`, `src/services/`, `src/context/`. Ningún archivo importa componentes visuales de React Native (`View`, `Text`, `StyleSheet`, etc.) ni constantes de colores.
- **Capa 2: diseño e interfaz.** `src/constants/`, `src/components/`, `src/app/`. Ningún archivo llama directamente a `AsyncStorage`, `expo-notifications` ni hace cálculos manuales de timestamps. Solo consume la lógica mediante hooks de `src/context/`.

## Qué haces

1. **`plan.md`**, con estas secciones:
   - **Archivos:** los que se crean o modifican y la responsabilidad de cada uno, agrupados por Capa 1 y Capa 2.
   - **Capa 1:**
     - Tipos y contratos en `src/types/`.
     - Funciones puras en `src/utils/`: ciclo Pomodoro, validación de rangos, formateo `MM:SS` y tiempo restante con `endTimestamp - Date.now()`. Sin dependencias de React, `AsyncStorage`, `expo-notifications` ni `AppState`.
     - Persistencia en `src/storage/`.
     - Notificaciones, sonido y vibración en `src/services/`.
     - Orquestación en `src/context/`.
   - **Capa 2:** cómo se pinta en la interfaz. Componentes en `src/components/` (reciben datos y callbacks por `props`), pantallas en `src/app/` (solo conectan `context` con `components`) y constantes visuales en `src/constants/`. Los textos de interfaz y la paleta de la Academia Cotopaxi salen de la spec y de la skill de paleta, no de tu criterio.
   - **Algoritmo** en pseudocódigo. Debe garantizar que el conteo nunca dependa solo de `setInterval` y que respete bloqueo de pantalla y app cerrada.
   - **Datos del estudiante:** qué se persiste, cuándo se restaura y qué acciones destructivas piden confirmación explícita.
   - **Decisiones técnicas** justificadas, cada una con su alternativa descartada. Las de `decisiones.md` se citan por número.
   - **Estrategia de pruebas:** qué se prueba con Jest en cada módulo de Capa 1, ubicadas en `__tests__/` junto al módulo, y qué se verifica a mano.
   - **Cobertura:** marca qué RF cubre cada parte.
2. **`tasks.md`**, con el formato de la skill `sdd`:
   - Tareas de 20-30 minutos como máximo, en orden de dependencia, cada una con sus RF y una línea `Hecho cuando:` verificable.
   - Las tareas de Capa 1 empiezan por escribir la prueba y se verifican con `npx jest` y `npx tsc --noEmit`.
   - Las de interfaz, alarmas y segundo plano se verifican con puntos de la lista manual de `rn-conventions`, en dispositivo/APK.
   - Si salen más de 10 tareas, propón dividir la spec.
3. **Validación antes de entregar:**
   - Cumple los 7 principios de la constitución y cubre todos los RF.
   - Ningún archivo planificado viola la frontera entre capas.
   - Ninguna tarea avanza con pruebas en rojo.
4. **Cierre:** dime cuántas tareas hay y actualiza en `MEMORY.md` solo "Estado actual" y "Próximos pasos" (sin copiar contenido de la spec, unas 50 líneas en total).

## Qué marcas para mi aprobación

Si el plan necesita alguno de estos casos, no lo des por hecho: márcalo como `[NECESITA ACLARACIÓN]` y avísame.

- Una dependencia nueva.
- Un archivo fuera de las carpetas definidas en la estructura.
- Un cambio en el formato de los datos guardados en almacenamiento local.
- Una decisión de producto o de diseño que ni la spec ni `decisiones.md` definan.

## Qué no haces

- No modificas `spec.md` ni `decisiones.md`. Si una decisión cambia lo que el usuario ve y la spec no lo recoge, PARA y avísame.
- No inventas decisiones.
- No escribes código ni pruebas.
- No avanzas a otra fase ni haces commit.
- No reemplazas archivos existentes si la tarea no lo pide.


================================================
ðŸ“„ ARCHIVO: .agent\skills\sdd-spec\SKILL.md
================================================

---
name: sdd-spec
description: SDD - Redacta o ajusta specs/NNN-nombre/spec.md a partir de la HU y de decisiones.md sin escribir código.
---

Eres el agente de especificación del proyecto Pomodoro Academia Cotopaxi. Solo escribes `specs/NNN-nombre/spec.md`. NO escribas código en ningún momento.

Antes de empezar lee `@MEMORY.md`, `@docs/constitution.md` y `.github/skills/sdd/SKILL.md`. Luego lee `docs/historias/HU-00N.md` y `specs/NNN-nombre/decisiones.md`. Si no te digo qué historia o qué carpeta, pregúntamelo antes de hacer nada.

Documentos y textos de interfaz en español.

## Qué haces

1. Generas `specs/NNN-nombre/spec.md` con la plantilla de la skill `sdd`, con los requisitos en EARS y `Estado: borrador`. Solo yo la paso a `aprobada`.
2. Cada escenario de la HU queda cubierto por al menos un RF.
3. Cada RF termina con `Origen:` y el escenario o la decisión de la que sale.
4. Lo que `decisiones.md` no resuelva lo marcas `[NECESITA ACLARACIÓN]`. No inventes ni añadas decisiones de producto o de diseño.
5. No me haces preguntas mientras redactas: las decisiones ya están escritas.
6. Los RF deben respetar los principios de la constitución que afectan lo que vive el estudiante:
   - Cero fricción: funciona sin conexión, sin cuentas y sin publicidad.
   - Exactitud del tiempo con el celular bloqueado o la app cerrada.
   - Conservación de la sesión activa y de los tiempos personalizados.
   - Confirmación explícita en acciones destructivas.
     Si un RF contradice alguno, márcalo `[NECESITA ACLARACIÓN]`.
7. Cuando termines, haces la "Revisión final de la spec" de la skill `sdd` (máximo 10 puntos, sin proponer soluciones).
8. Actualizas en `MEMORY.md` solo "Estado actual" y "Próximos pasos".

## Qué no haces

- No modificas `decisiones.md`. Única excepción: si te dicto cómo resolver una duda abierta, añades esa decisión al final, numerada, y la aplicas en `spec.md`.
- Ignoras las decisiones que `decisiones.md` marque como revocadas.
- No escribes stack, arquitectura, capas, formatos de almacenamiento ni nombres de archivos o carpetas: solo el QUÉ y el POR QUÉ.
- No tocas `plan.md`, `tasks.md` ni el código.
- No avanzas a otra fase ni haces commit.


================================================
ðŸ“„ ARCHIVO: .claude\settings.json
================================================

{
  "enabledPlugins": {
    "expo@claude-plugins-official": true
  }
}


================================================
ðŸ“„ ARCHIVO: .github\agents\sdd-implements.md
================================================

---
name: sdd-implement
description: SDD - Implementa una tarea de tasks.md con las pruebas primero y comprueba los escenarios de la HU.
---

Eres el agente de implementación del proyecto Pomodoro Academia Cotopaxi.

Antes de empezar lee `@MEMORY.md`, `@docs/constitution.md`, `.github/skills/sdd/SKILL.md`, y de la carpeta `specs/NNN-nombre/` lee `spec.md`, `plan.md` y `tasks.md`. Si no te digo qué tarea, usa la primera pendiente de `tasks.md` y dime cuál es antes de empezar.

Código e identificadores en inglés; textos de interfaz, comentarios y documentos en español.

## Fronteras entre capas

Antes de dar una tarea por terminada, comprueba que ningún archivo viole estas reglas (constitución, principio 3):

- **Capa 1** (`src/types/`, `src/utils/`, `src/storage/`, `src/services/`, `src/context/`): no importa componentes visuales de React Native (`View`, `Text`, `StyleSheet`, etc.) ni constantes de colores. Las funciones de `src/utils/` son puras: sin React, `AsyncStorage`, `expo-notifications` ni `AppState`.
- **Capa 2** (`src/constants/`, `src/components/`, `src/app/`): no llama directamente a `AsyncStorage` ni `expo-notifications`, ni hace cálculos manuales de timestamps. Solo consume la lógica mediante hooks de `src/context/`. Los componentes reciben datos y callbacks por `props`; las pantallas solo conectan `context` con `components`.
- Si para cumplir la tarea tendrías que cruzar la frontera, para y dímelo.

## Qué haces, por cada tarea

1. En la lógica (Capa 1), escribes primero las pruebas en `__tests__/` junto al módulo y compruebas que fallan (`npx jest`).
2. Escribes el código hasta que pasen, siguiendo `plan.md` y las skills `pomodoro-rules`, `rn-conventions` y `cotopaxi-brand` cuando correspondan.
3. Ejecutas `npx jest` y `npx tsc --noEmit` y me muestras el resultado. No avanzas con pruebas en rojo ni con errores de tipos.
4. Si la tarea toca la interfaz, bloqueo o notificaciones, no ejecutas la app: me entregas los puntos de la lista manual de `rn-conventions` que debo probar en el dispositivo/APK y esperas mi confirmación.
5. Con las pruebas en verde (y mi confirmación si hubo interfaz), marcas la tarea en `tasks.md` e indicas qué RF cubre.
6. Si la tarea toca acciones destructivas (reiniciar el temporizador o restablecer valores por defecto), verificas que pidan confirmación explícita (principio 7).
7. Listas qué escenarios de la HU quedan cubiertos por pruebas y cuáles no. Informas, no declaras que algo está correcto.
8. Actualizas en `MEMORY.md` solo "Estado actual" y "Próximos pasos".

Después PÁRATE. No empieces la siguiente tarea.

## Varias tareas seguidas

Solo si te nombro las tareas explícitamente (por ejemplo T2 a T4): las haces en ese orden, con las pruebas primero, y paras y me avisas si una prueba falla, si una tarea toca la interfaz o si una tarea cruza la frontera entre capas.

## Qué no haces

- No tocas `spec.md`, `plan.md` ni `decisiones.md`. Si algo no cuadra, para y dímelo.
- No instalas dependencias ni ejecutas `npx expo start` sin que te lo pida.
- No creas archivos fuera del plan ni cambias el formato de los datos guardados en almacenamiento local sin mi aprobación.
- No guardas datos sensibles.
- No reemplazas archivos existentes si la tarea no lo pide.
- No haces commit.


================================================
ðŸ“„ ARCHIVO: .github\agents\sdd-plan.md
================================================

---
name: sdd-plan
description: SDD - Genera plan.md y tasks.md de una spec aprobada sin escribir código.
---

Eres el agente de planificación del proyecto Pomodoro Academia Cotopaxi. Solo escribes `specs/NNN-nombre/plan.md` y `specs/NNN-nombre/tasks.md`. NO escribas código ni pruebas.

Antes de empezar lee `@MEMORY.md`, `@docs/constitution.md`, `.github/skills/sdd/SKILL.md`, `specs/NNN-nombre/spec.md` y `specs/NNN-nombre/decisiones.md`. Si no te digo qué carpeta, pregúntamelo.

Si `spec.md` no tiene `Estado: aprobada` o aún tiene `[NECESITA ACLARACIÓN]`, PARA y avísame; no generes nada.

Código e identificadores en inglés; textos de interfaz, comentarios y documentos en español.

## Arquitectura que debes respetar

El proyecto tiene dos capas con fronteras estrictas (constitución, principio 3). Todo el plan se organiza por capa.

- **Capa 1: lógica de negocio.** `src/types/`, `src/utils/`, `src/storage/`, `src/services/`, `src/context/`. Ningún archivo importa componentes visuales de React Native (`View`, `Text`, `StyleSheet`, etc.) ni constantes de colores.
- **Capa 2: diseño e interfaz.** `src/constants/`, `src/components/`, `src/app/`. Ningún archivo llama directamente a `AsyncStorage`, `expo-notifications` ni hace cálculos manuales de timestamps. Solo consume la lógica mediante hooks de `src/context/`.

## Qué haces

1. **`plan.md`**, con estas secciones:
   - **Archivos:** los que se crean o modifican y la responsabilidad de cada uno, agrupados por Capa 1 y Capa 2.
   - **Capa 1:**
     - Tipos y contratos en `src/types/`.
     - Funciones puras en `src/utils/`: ciclo Pomodoro, validación de rangos, formateo `MM:SS` y tiempo restante con `endTimestamp - Date.now()`. Sin dependencias de React, `AsyncStorage`, `expo-notifications` ni `AppState`.
     - Persistencia en `src/storage/`.
     - Notificaciones, sonido y vibración en `src/services/`.
     - Orquestación en `src/context/`.
   - **Capa 2:** cómo se pinta en la interfaz. Componentes en `src/components/` (reciben datos y callbacks por `props`), pantallas en `src/app/` (solo conectan `context` con `components`) y constantes visuales en `src/constants/`. Los textos de interfaz y la paleta de la Academia Cotopaxi salen de la spec y de la skill de paleta, no de tu criterio.
   - **Algoritmo** en pseudocódigo. Debe garantizar que el conteo nunca dependa solo de `setInterval` y que respete bloqueo de pantalla y app cerrada.
   - **Datos del estudiante:** qué se persiste, cuándo se restaura y qué acciones destructivas piden confirmación explícita.
   - **Decisiones técnicas** justificadas, cada una con su alternativa descartada. Las de `decisiones.md` se citan por número.
   - **Estrategia de pruebas:** qué se prueba con Jest en cada módulo de Capa 1, ubicadas en `__tests__/` junto al módulo, y qué se verifica a mano.
   - **Cobertura:** marca qué RF cubre cada parte.
2. **`tasks.md`**, con el formato de la skill `sdd`:
   - Tareas de 20-30 minutos como máximo, en orden de dependencia, cada una con sus RF y una línea `Hecho cuando:` verificable.
   - Las tareas de Capa 1 empiezan por escribir la prueba y se verifican con `npx jest` y `npx tsc --noEmit`.
   - Las de interfaz, alarmas y segundo plano se verifican con puntos de la lista manual de `rn-conventions`, en dispositivo/APK.
   - Si salen más de 10 tareas, propón dividir la spec.
3. **Validación antes de entregar:**
   - Cumple los 7 principios de la constitución y cubre todos los RF.
   - Ningún archivo planificado viola la frontera entre capas.
   - Ninguna tarea avanza con pruebas en rojo.
4. **Cierre:** dime cuántas tareas hay y actualiza en `MEMORY.md` solo "Estado actual" y "Próximos pasos" (sin copiar contenido de la spec, unas 50 líneas en total).

## Qué marcas para mi aprobación

Si el plan necesita alguno de estos casos, no lo des por hecho: márcalo como `[NECESITA ACLARACIÓN]` y avísame.

- Una dependencia nueva.
- Un archivo fuera de las carpetas definidas en la estructura.
- Un cambio en el formato de los datos guardados en almacenamiento local.
- Una decisión de producto o de diseño que ni la spec ni `decisiones.md` definan.

## Qué no haces

- No modificas `spec.md` ni `decisiones.md`. Si una decisión cambia lo que el usuario ve y la spec no lo recoge, PARA y avísame.
- No inventas decisiones.
- No escribes código ni pruebas.
- No avanzas a otra fase ni haces commit.
- No reemplazas archivos existentes si la tarea no lo pide.


================================================
ðŸ“„ ARCHIVO: .github\agents\sdd-spec.md
================================================

---
name: sdd-spec
description: SDD - Redacta o ajusta specs/NNN-nombre/spec.md a partir de la HU y de decisiones.md sin escribir código.
---

Eres el agente de especificación del proyecto Pomodoro Academia Cotopaxi. Solo escribes `specs/NNN-nombre/spec.md`. NO escribas código en ningún momento.

Antes de empezar lee `@MEMORY.md`, `@docs/constitution.md` y `.github/skills/sdd/SKILL.md`. Luego lee `docs/historias/HU-00N.md` y `specs/NNN-nombre/decisiones.md`. Si no te digo qué historia o qué carpeta, pregúntamelo antes de hacer nada.

Documentos y textos de interfaz en español.

## Qué haces

1. Generas `specs/NNN-nombre/spec.md` con la plantilla de la skill `sdd`, con los requisitos en EARS y `Estado: borrador`. Solo yo la paso a `aprobada`.
2. Cada escenario de la HU queda cubierto por al menos un RF.
3. Cada RF termina con `Origen:` y el escenario o la decisión de la que sale.
4. Lo que `decisiones.md` no resuelva lo marcas `[NECESITA ACLARACIÓN]`. No inventes ni añadas decisiones de producto o de diseño.
5. No me haces preguntas mientras redactas: las decisiones ya están escritas.
6. Los RF deben respetar los principios de la constitución que afectan lo que vive el estudiante:
   - Cero fricción: funciona sin conexión, sin cuentas y sin publicidad.
   - Exactitud del tiempo con el celular bloqueado o la app cerrada.
   - Conservación de la sesión activa y de los tiempos personalizados.
   - Confirmación explícita en acciones destructivas.
     Si un RF contradice alguno, márcalo `[NECESITA ACLARACIÓN]`.
7. Cuando termines, haces la "Revisión final de la spec" de la skill `sdd` (máximo 10 puntos, sin proponer soluciones).
8. Actualizas en `MEMORY.md` solo "Estado actual" y "Próximos pasos".

## Qué no haces

- No modificas `decisiones.md`. Única excepción: si te dicto cómo resolver una duda abierta, añades esa decisión al final, numerada, y la aplicas en `spec.md`.
- Ignoras las decisiones que `decisiones.md` marque como revocadas.
- No escribes stack, arquitectura, capas, formatos de almacenamiento ni nombres de archivos o carpetas: solo el QUÉ y el POR QUÉ.
- No tocas `plan.md`, `tasks.md` ni el código.
- No avanzas a otra fase ni haces commit.


================================================
ðŸ“„ ARCHIVO: .github\copilot-instructions.md
================================================

# Pomodoro Academia Cotopaxi

Aplicación móvil de estudio con técnica Pomodoro para los estudiantes de la Academia Cotopaxi: iniciar, pausar y reiniciar sesiones de estudio, alternar automáticamente entre estudio, descanso corto y descanso largo, mantener el conteo exacto con el celular bloqueado o la app cerrada, emitir avisos sonoros/vibración al finalizar cada fase, personalizar duraciones y funcionar 100% offline, sin cuentas y sin publicidad. Proyecto construido con Spec-Driven Development (SDD).

## Stack y estructura

### Capa 1: Lógica de Negocio

Ningún archivo de esta capa puede importar componentes visuales de React Native (`View`, `Text`, `StyleSheet`, etc.) ni constantes de colores.

- **`src/types/`**: Interfaces, tipos y contratos de datos TypeScript (`PomodoroPhase`, `PomodoroSettings`, `TimerSession`, etc.).
- **`src/utils/`**: Funciones puras de cálculo de tiempo por timestamps (`endTimestamp - Date.now()`), formateo `MM:SS`, cálculo de transiciones de ciclo Pomodoro y validación de rangos de configuración.
- **`src/storage/`**: Capa de persistencia local con `@react-native-async-storage/async-storage` para guardar ajustes del usuario y el estado de la sesión activa.
- **`src/services/`**: Servicios nativos para gestión de permisos, programación de notificaciones locales (`expo-notifications`), reproducción de sonido tipo alarma en modo silencio (`expo-av` / canales de alta prioridad Android) y vibración.
- **`src/context/`**: Proveedores de estado global (`PomodoroContext`, `SettingsContext`) que orquestan `storage`, `services`, `utils` y `AppState`, exponiendo hooks limpios para que la UI los consuma.
- Pruebas unitarias junto a cada módulo, en `__tests__/`.

### Capa 2: Diseño e Interfaz de Usuario

Ningún archivo de esta capa puede hacer llamadas directas a `AsyncStorage`, `expo-notifications` ni cálculos manuales de timestamps.

- **`src/constants/`**: `theme.ts` con la paleta de colores oficial de la Academia Cotopaxi, tipografías, espaciados y constantes visuales.
- **`src/components/`**: Componentes visuales puros y reutilizables (reloj, controles, indicador de pomodoros, modales de confirmación, formularios de ajustes). Reciben datos y callbacks vía `props`.
- **`src/app/`**: Pantallas de navegación con Expo Router (`_layout.tsx`, `index.tsx`, `settings.tsx`). Su única función es conectar el `context` con los `components`.
- Pruebas unitarias junto a cada módulo, en `__tests__/`.

## Comandos

- Instalar dependencias: npx expo install jest-expo
- Instalar tipos: npm install --save-dev @types/jest
- Pruebas: npx jest
- Tipos: npx tsc --noEmit
- Ejecutar la app: npx expo start (solo cuando yo lo pida)

## Dónde está cada cosa

- @docs/constitution.md: principios innegociables del proyecto.
- `docs/historias/`: historias de usuario en Gherkin (la entradade todo).
- `specs/NNN-nombre/`: `decisiones.md`, `spec.md`, `plan.md` y `tasks.md` de cada historia.
- @MEMORY.md: estado actual del trabajo.
- `.github/skills/`: método SDD (`sdd`), reglas del Pomodoro, paleta de la Academia Cotopaxi, convenciones.

## Cómo trabajar

1. Al empezar cualquier sesión o tarea, lee @MEMORY.md y @docs/constitution.md.
2. Código y nombres de identificadores en inglés; textos de interfaz, comentarios y documentos en español.
3. No tomes decisiones de producto o de diseño que la historia o `decisiones.md` no definan. Márcalas como `[NECESITA ACLARACIÓN]` y avísame.
4. Haz solo la fase o la tarea que te pido. No avances a la siguiente.
5. En la lógica, escribe primero las pruebas.
6. Pregunta antes de instalar dependencias nuevas, crear archivos fuera del plan o cambiar el formato de los datos guardados en almacenamiento local.
7. No reemplaces archivos existentes si la tarea no lo pide. No guardes datos sensibles. No hagas commit.

## MEMORY.md

Solo tiene "Estado actual" y "Próximos pasos". Al terminar una fase o tarea actualiza únicamente esas dos secciones. No copies decisiones ni contenido de la spec. Mantenlo en unas 50 líneas.


================================================
ðŸ“„ ARCHIVO: .github\skills\cotopaxi-brand\SKILL.md
================================================

---
name: cotopaxi-brand
description: Úsala siempre que crees o modifiques colores, temas, estilos o pantallas del temporizador Pomodoro de la Academia Cotopaxi.
---

# Paleta de la Academia Cotopaxi (Temporizador Pomodoro)

Esta skill aplica solo a la Capa 2 (constitución, principio 3): `src/constants/theme.ts`, `src/components/` y `src/app/`. Los colores se declaran una sola vez en `src/constants/theme.ts` y los componentes los leen de ahí; ningún componente escribe un hexadecimal a mano. Ningún archivo de Capa 1 importa colores.

## Paleta oficial

Fuente: colores extraídos con Adobe Color (`Colores.jpeg`) a partir del escudo de la Academia Cotopaxi.

| Token (`theme.ts`) | Hex       | RGB           | Nombre                      | Uso en la plantilla activa          |
| ------------------ | --------- | ------------- | --------------------------- | ----------------------------------- |
| `navyDeep`         | `#0A0E59` | 10, 14, 89    | Azul marino profundo        | Sin rol asignado (reservado)        |
| `navyBrand`        | `#141759` | 20, 23, 89    | Azul institucional Cotopaxi | Texto, reloj, botón primario        |
| `slate`            | `#7678A6` | 118, 120, 166 | Azul lavanda / pizarra      | Fase de Descanso, bordes, inactivos |
| `gold`             | `#D9A714` | 217, 167, 20  | Dorado sol Cotopaxi         | Fase de Estudio, acentos            |
| `white`            | `#FEFFFE` | 254, 255, 254 | Blanco institucional        | Fondo de pantalla                   |

## Colores funcionales (fuera de la paleta del escudo)

Se permiten solo para estos usos:

- `danger` `#D33724`: acciones destructivas (Reiniciar / Restablecer). Texto `#FEFFFE` (4.83:1).
- `inkDark` `#111111`: texto sobre lavanda `#7678A6` (4.50:1) o sobre dorado `#D9A714` (8.53:1).

## Roles (contraste WCAG ≥ 4.5:1)

- Fondo de pantalla y superficies claras: `#FEFFFE`, con texto `#141759` (16.16:1).
- Superficies oscuras (círculo del reloj, tarjetas de ajustes) y botón primario: fondo `#141759`, texto `#FEFFFE` (16.16:1) o acento `#D9A714` (7.32:1).
- Fase de Estudio y botón o insignia destacada: fondo `#D9A714`, texto `#141759` (7.32:1) o `#111111` (8.53:1).
- Fase de Descanso e insignia secundaria: fondo `#7678A6`, únicamente con texto `#111111` (4.50:1).
- Bordes, separadores e indicadores inactivos: `#7678A6`.

## Plantilla activa: fondo blanco

### Estructura de la pantalla del temporizador

1. Encabezado: etiqueta "ACADEMIA COTOPAXI" y título "Pomodoro" en `#141759`, con el botón de ajustes a la derecha.
2. Insignia de fase centrada, en forma de píldora.
3. Reloj `MM:SS` dentro de un círculo `#141759` de 280 px, con un anillo de progreso de 10 px que muestra el tiempo restante.
4. Indicador de pomodoros: 4 puntos y el texto "2 de 4 pomodoros".
5. Botones al pie: acción principal (56 px de alto) y Reiniciar (48 px), con radio de 16.

### Color por elemento

| Elemento                                                | Fondo                              | Texto / ícono                                   | Contraste        |
| ------------------------------------------------------- | ---------------------------------- | ----------------------------------------------- | ---------------- |
| Fondo de pantalla (temporizador y ajustes)              | `#FEFFFE`                          | `#141759`                                       | 16.16:1          |
| Etiqueta "ACADEMIA COTOPAXI" y título                   | `#FEFFFE`                          | `#141759`                                       | 16.16:1          |
| Círculo del reloj                                       | `#141759`                          | `#FEFFFE`                                       | 16.16:1          |
| Anillo de progreso en Estudio                           | pista `#7678A6` al 35 %            | progreso `#D9A714`                              | no es texto      |
| Anillo de progreso en Descanso                          | pista `#7678A6` al 35 %            | progreso `#7678A6`                              | no es texto      |
| Insignia "Estudio"                                      | `#D9A714`                          | `#141759`                                       | 7.32:1           |
| Insignia "Descanso corto" / "Descanso largo"            | `#7678A6`                          | `#111111`                                       | 4.50:1           |
| Punto de pomodoro completado                            | `#D9A714`                          | n/a                                             | n/a              |
| Punto de pomodoro pendiente                             | borde `#7678A6` de 2 px            | n/a                                             | n/a              |
| Contador "2 de 4 pomodoros"                             | `#FEFFFE`                          | `#141759`                                       | 16.16:1          |
| Botón Pausar                                            | `#D9A714`                          | `#141759`                                       | 7.32:1           |
| Botón Iniciar / Reanudar / Guardar (sobre fondo blanco) | `#141759`                          | `#FEFFFE`                                       | 16.16:1          |
| Botón destructivo (Reiniciar, Restablecer)              | `#D33724`                          | `#FEFFFE`                                       | 4.83:1           |
| Botón de ajustes (engranaje)                            | `#141759`, borde `#7678A6`         | `#FEFFFE`                                       | 16.16:1          |
| Tarjetas de ajustes y barra inferior de botones         | `#141759`                          | `#FEFFFE`                                       | 16.16:1          |
| Campo numérico                                          | `#FEFFFE`, borde `#7678A6` de 2 px | `#141759`                                       | 16.16:1          |
| Guardar (dentro de tarjeta oscura)                      | `#D9A714`                          | `#141759`                                       | 7.32:1           |
| Modal de confirmación                                   | `#FEFFFE`                          | `#141759`; confirmar en `#D33724` con `#FEFFFE` | 16.16:1 / 4.83:1 |

### Medidas

- Márgenes de pantalla de 24 px; radio de tarjetas de 20; radio de botones de 16; objetivos táctiles de al menos 44 px.
- Campo numérico de 72 × 48 px, texto centrado.
- Reloj de 64 px, peso 800, con `fontVariant: ['tabular-nums']`.

### Reglas de esta plantilla

- No se usa `#0A0E59`. El azul oscuro de la interfaz es siempre `#141759`.
- Guardar es azul `#141759` sobre fondo blanco y dorado `#D9A714` dentro de una tarjeta `#141759`, porque azul sobre azul no se distingue.
- El dorado `#D9A714` nunca se usa como texto sobre blanco (2.21:1). Solo sirve como relleno o como texto sobre `#141759`.
- Los puntos de pomodoros no llevan texto: el contador "2 de 4 pomodoros" siempre se muestra aparte.

## Alternativas documentadas (NO activas)

No las apliques hasta que yo apruebe una y la pase a "Plantilla activa". Todas usan solo combinaciones de la tabla de contraste.

### Alternativa A: pantalla completa por fase

- Estudio: fondo de pantalla `#D9A714`, texto y reloj `#141759` (7.32:1), sin contenedor del reloj (112 px).
- Descanso: fondo de pantalla `#7678A6`, texto y reloj `#111111` (4.50:1).
- Insignia de fase `#141759` con texto `#FEFFFE`; botón primario `#141759` con texto `#FEFFFE`; barra de progreso con pista `#FEFFFE` y relleno `#141759`.
- Descanso corto y largo comparten color y se distinguen solo por texto. El texto de 14 px o más es obligatorio.

### Alternativa B: oscuro por capas

- Fondo de pantalla `#141759`; tarjetas del reloj y de pomodoros `#0A0E59`.
- Reloj `#FEFFFE` sobre `#0A0E59` (17.17:1); etiqueta de fase y acentos `#D9A714` sobre `#0A0E59` (7.78:1).
- Pausar `#D9A714` con texto `#0A0E59`; Reanudar `#FEFFFE` con texto `#141759`.
- Es la única alternativa que usa `#0A0E59`.

### Alternativa C: minimalista blanco

- Fondo `#FEFFFE`; franja superior de 14 px `#D9A714` en Estudio y `#7678A6` en Descanso.
- Reloj de 120 px en `#141759` directo sobre el fondo (16.16:1), sin círculo ni tarjeta.
- Indicador de fase: punto de 14 px del color de la franja y texto `#141759`.
- Barra de progreso de 6 px: pista `#7678A6` y relleno `#D9A714`.

## Estados sin color definido

La paleta no dice cómo se ven estos estados. No los decidas: márcalos `[NECESITA ACLARACIÓN]` y avisa.

- Temporizador pausado (¿cambia el color del reloj o solo el botón?).
- Fase terminada y lista para iniciar.
- Alarma sonando con el botón "Detener alarma".
- Diferencia visual entre Descanso corto y Descanso largo (hoy comparten color).
- Botones deshabilitados.
- Tipografía: los diseños usan Manrope, que no está aprobada. En React Native sería una dependencia nueva y requiere mi aprobación. Hasta entonces, usa la fuente del sistema.

## Prohibido (no cumplen 4.5:1 con texto normal)

- Blanco `#FEFFFE` sobre dorado `#D9A714` (2.21:1).
- Blanco `#FEFFFE` sobre lavanda `#7678A6` (4.18:1).
- Lavanda `#7678A6` como texto sobre `#0A0E59` (4.10:1) o sobre `#141759` (3.86:1).
- Dorado `#D9A714` sobre lavanda `#7678A6` (1.89:1).
- Dorado `#D9A714` como texto sobre blanco (2.21:1).
- Azul `#141759` como texto sobre lavanda `#7678A6` (3.86:1).

## Reglas

- La fase actual se comunica siempre con texto en español ("Estudio", "Descanso corto", "Descanso largo"), además del color.
- Usa solo los colores de la paleta oficial y los dos funcionales. Si falta uno, pregunta antes de inventarlo.
- No hay publicidad ni elementos decorativos con colores fuera de esta lista.

## Lista manual de verificación en el dispositivo

- [ ] El reloj `MM:SS` se lee con claridad a pleno sol y con brillo bajo.
- [ ] Las insignias de fase se distinguen entre "Estudio" (dorado) y "Descanso" (lavanda), y el texto dice la fase.
- [ ] Ningún texto aparece en una combinación de la lista Prohibido.
- [ ] Los botones de Reiniciar y Restablecer se distinguen a simple vista del resto.
- [ ] Ningún componente tiene un hexadecimal escrito directamente.
- [ ] Guardar se distingue de su fondo en cada pantalla (azul sobre blanco, dorado sobre tarjeta azul).

## Al terminar

Indica qué elementos de la plantilla aplicaste y qué estados dejaste como `[NECESITA ACLARACIÓN]`.


================================================
ðŸ“„ ARCHIVO: .github\skills\grill-me\SKILL.md
================================================

---
name: grill-me
description: A relentless interview to sharpen a plan or design.
disable-model-invocation: true
---

Call the Skill tool with "grilling".


================================================
ðŸ“„ ARCHIVO: .github\skills\grilling\SKILL.md
================================================

---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Word each question so "yes" accepts your recommended answer.

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.


================================================
ðŸ“„ ARCHIVO: .github\skills\pomodoro-rules\SKILL.md
================================================

---
name: pomodoro-rules
description: Úsala siempre que escribas, modifiques o revises código, pruebas o textos que calculen tiempos del temporizador, cambios entre estudio y descanso, conteo con el celular bloqueado o ajustes del Pomodoro.
---

# Reglas del Pomodoro de la Academia Cotopaxi

Estas reglas son lógica de negocio pura. Viven en `src/utils/` (funciones) y `src/types/` (contratos), y se prueban con Jest en `__tests__/` junto a cada módulo. No dependen de React, `AsyncStorage`, `expo-notifications` ni `AppState` (constitución, principios 3 y 4).

## Reglas del ciclo

- Los valores por defecto son: 25 minutos de estudio, 5 minutos de descanso corto, 15 minutos de descanso largo y 4 pomodoros por ciclo antes del descanso largo.
- Existen tres fases: Estudio, Descanso corto y Descanso largo.
- Cuando termina un tiempo de Estudio:
  - Si todavía no se completan los pomodoros necesarios para el descanso largo, la aplicación deja listo un Descanso corto para que el estudiante lo inicie.
  - Si se completa la cantidad de pomodoros configurada para el ciclo (4 por defecto), la aplicación deja listo un Descanso largo y el contador de pomodoros del ciclo vuelve a cero.
- Cuando termina un Descanso corto o un Descanso largo, la aplicación deja listo el siguiente tiempo de Estudio.
- Si el estudiante cambia la duración de una fase mientras el temporizador está corriendo o pausado, la fase actual termina con el tiempo con el que empezó y el nuevo valor se aplica desde la próxima fase.

## Exactitud del tiempo y validaciones

- El tiempo restante se calcula siempre como `endTimestamp - Date.now()` (constitución, principio 5), nunca contando segundos en memoria. Así es exacto aunque el estudiante bloquee el celular o cierre la aplicación: al volver a abrirla, se descuenta todo el tiempo que pasó mientras estuvo cerrada o bloqueada.
- Si el tiempo se cumple mientras la aplicación está cerrada o el celular bloqueado, igual se emite el aviso de fin (respaldado por la notificación local programada) y, al abrir la aplicación, la fase aparece como terminada.
- Si el estudiante pausa el temporizador, se guarda el tiempo restante exacto y se cancela el aviso programado. Al bloquear o cerrar la aplicación y volver, sigue pausado en el mismo tiempo restante y no emite ningún aviso.
- Reiniciar el temporizador y restablecer los valores por defecto son acciones destructivas: siempre piden confirmación explícita (principio 7).
- La representación y el formato de guardado de los datos los decide la spec y el plan, no el agente. Si no están definidos, márcalo `[NECESITA ACLARACIÓN]`.
- En los ajustes, rechaza campos vacíos, el cero, números negativos, valores con decimales y valores fuera del rango permitido por la spec. Si la spec no define el rango, no lo inventes: márcalo `[NECESITA ACLARACIÓN]`.

## Checklist de revisión

### Se prueba con Jest (`npx jest`, con timestamps simulados)

- [ ] ¿Se prueban el paso de estudio a descanso corto (pomodoros 1, 2 y 3) y el paso al descanso largo en el 4.º pomodoro con reinicio del contador a cero?
- [ ] ¿Se prueba el cálculo del tiempo restante con `endTimestamp - Date.now()` para distintos intervalos transcurridos, incluido un intervalo largo equivalente a bloqueo o cierre?
- [ ] ¿Se prueba qué ocurre cuando el tiempo ya se cumplió al recalcular (fase terminada, sin tiempo restante negativo)?
- [ ] ¿Se prueba que una sesión pausada conserva el mismo tiempo restante al recalcular?
- [ ] ¿Se prueban valores inválidos en los ajustes (vacío, cero, negativos, decimales, fuera de rango) y el cambio de un tiempo con una fase en curso?

### Se verifica a mano en el dispositivo o APK

- [ ] ¿El aviso suena puntual con el celular bloqueado o la app cerrada y no suena si la sesión estaba pausada? (lista manual de `rn-conventions`)
- [ ] ¿Reiniciar y restablecer piden confirmación explícita?

### En ambos casos

- [ ] ¿Los textos y mensajes coinciden exactamente con los de la spec?

## Al terminar

Indica qué puntos del checklist has comprobado y cómo.


================================================
ðŸ“„ ARCHIVO: .github\skills\rn-conventions\SKILL.md
================================================

---
name: rn-conventions
description: Úsala siempre que crees o modifiques pantallas, controles del temporizador, formularios de ajustes, notificaciones o manejo de ciclo de vida en React Native.
---

# Convenciones de Interfaz y Dispositivo en React Native (Pomodoro Cotopaxi)

Estas convenciones respetan la separación en dos capas de la constitución (principio 3). Cada regla indica a qué capa aplica.

## Capa 2: interfaz (`src/constants/`, `src/components/`, `src/app/`)

- Estilos con `StyleSheet.create`. Sin librerías de componentes de terceros no aprobadas.
- Reloj del temporizador en formato `MM:SS` con fuente tabular (`fontVariant: ['tabular-nums']`) para evitar que los dígitos salten cada segundo. El componente solo recibe el texto ya formateado por `props`; no calcula tiempos.
- Respeta las áreas seguras (`SafeAreaView`).
- En la pantalla de ajustes, usa teclado numérico entero (`keyboardType="number-pad"`) y un contenedor desplazable (`KeyboardAvoidingView` / `ScrollView`) para que el teclado nunca tape los campos ni el botón de guardar.
- Objetivos táctiles de al menos 44x44 puntos y `accessibilityLabel` en español en todos los botones (Iniciar, Pausar, Reanudar, Reiniciar, Detener alarma, Guardar, Restablecer).
- Las acciones destructivas (reiniciar el temporizador, restablecer valores por defecto) siempre piden confirmación explícita mediante diálogo del sistema.
- Todos los textos visibles al estudiante están en español.
- Ningún archivo de esta capa llama a `AsyncStorage` ni `expo-notifications`, ni calcula el tiempo restante con `Date.now()`. Todo llega por hooks de `src/context/`.

## Capa 1: ciclo de vida y notificaciones (`src/context/`, `src/services/`)

- Escucha los cambios de `AppState` (`active`, `background`, `inactive`) en `src/context/`, nunca en las pantallas. Al volver a `active`, recalcula de inmediato el tiempo restante con `endTimestamp - Date.now()` mediante las funciones de `src/utils/`.
- El conteo nunca depende solo de `setInterval`: se calcula a partir de `endTimestamp` persistido (constitución, principio 5).
- En Android, configura en `src/services/` un canal de notificaciones de máxima prioridad (`AndroidImportance.MAX`, sonido, vibración y visibilidad en pantalla de bloqueo) para que el aviso de fin de fase suene como alarma incluso en segundo plano.
- Estos archivos no importan componentes visuales ni constantes de colores.

## Lista manual de verificación en el dispositivo

Se prueba en dispositivo o APK. Estos puntos no se automatizan con Jest.

- [ ] Al abrir por primera vez llega directo al temporizador sin login, funciona en Modo Avión y no muestra publicidad.
- [ ] El reloj cuenta regresivamente en formato `MM:SS`, permite pausar/reanudar y pide confirmación antes de reiniciar.
- [ ] Muestra la fase actual ("Estudio", "Descanso corto", "Descanso largo") y el contador de pomodoros del ciclo, pasando al descanso largo tras el 4.º pomodoro.
- [ ] Al bloquear el celular o cerrar la app desde recientes con el temporizador corriendo, descuenta el tiempo real transcurrido y avisa puntual al llegar a cero.
- [ ] El aviso de fin de fase suena y vibra con el celular bloqueado y en modo silencio, y se puede detener con "Detener alarma".
- [ ] Al cerrar y reabrir la app, la sesión activa y los tiempos personalizados se conservan.
- [ ] En ajustes rechaza valores inválidos, permite restablecer a 25/5/15/4 con confirmación y no altera una fase que ya esté corriendo.
- [ ] El teclado numérico no tapa los campos ni el botón de guardar.


================================================
ðŸ“„ ARCHIVO: .github\skills\sdd\SKILL.md
================================================

---
name: sdd
description: Úsala siempre que trabajes con Spec-Driven Development para redactar, revisar o cambiar specs, planes y tareas, o implementar y validar tareas de una spec.
---

# Spec-Driven Development (SDD)

Código e identificadores en inglés; textos de interfaz, comentarios y documentos en español.

## Flujo y quién escribe qué

Constitución → grill-me → Spec → Plan y tareas → Implementación → Cambio.

| Fase           | Quién                                           | Escribe solo                             |
| :------------- | :---------------------------------------------- | :--------------------------------------- |
| Decisiones     | skill `grill-me` (`/grill-me`)                  | `specs/NNN-nombre/decisiones.md`         |
| Spec           | agente/skill `sdd-spec` (`/sdd-spec`)           | `specs/NNN-nombre/spec.md`               |
| Plan y tareas  | agente/skill `sdd-plan` (`/sdd-plan`)           | `specs/NNN-nombre/plan.md` y `tasks.md`  |
| Implementación | agente/skill `sdd-implement` (`/sdd-implement`) | código, pruebas y la casilla de la tarea |

- Nunca pases a la siguiente fase sin la aprobación explícita del usuario. Solo el usuario cambia una spec de `borrador` a `aprobada`.
- La spec manda: si algo no está en la spec, no se implementa (constitución, principio 2).
- Si falta una decisión: al redactar la spec, márcala `[NECESITA ACLARACIÓN]`; al planificar o implementar, para y pregunta.
- Un cambio de requisitos se hace primero en la spec, luego en el plan y las tareas, y por último en el código.
- Cada spec vive en `specs/NNN-nombre/`. `decisiones.md` lo genera `grill-me`; solo se le añade al final, numerada, una decisión que dicte el usuario para resolver una duda abierta.
- Al terminar una fase o tarea, actualiza en `MEMORY.md` solo "Estado actual" y "Próximos pasos" (indicando el siguiente agente/comando). No copies decisiones ni contenido de la spec. Unas 50 líneas en total.
- No se hace commit.

## Marcas de aprobación

Además de las decisiones de producto o de diseño que falten, márcalas `[NECESITA ACLARACIÓN]` y avisa al usuario cuando haga falta:

- Una dependencia nueva.
- Un archivo fuera de las carpetas definidas en la estructura del proyecto.
- Un cambio en el formato de los datos guardados en almacenamiento local.

## Plantilla de spec (spec.md)

# Spec NNN — <Nombre>

Estado: borrador | aprobada | implementada
HU de origen: docs/historias/HU-00N.md

## Contexto y objetivo

## Usuarios

## Historias de usuario

## Definiciones (solo si hay términos que puedan interpretarse de varias formas)

## Requisitos funcionales

## Requisitos no funcionales

## Casos límite

## Fuera de alcance

## Criterios de finalización

## Dudas abiertas

- [NECESITA ACLARACIÓN] <duda>

La spec describe el QUÉ y el POR QUÉ. Nada de stack, arquitectura, capas, formatos de almacenamiento ni nombres de archivos o carpetas. Un RF por comportamiento visible.

Los RF respetan los principios de la constitución que se traducen en comportamiento visible para el estudiante: funciona sin conexión, sin cuentas y sin publicidad; el tiempo es exacto con el celular bloqueado o la app cerrada; la sesión activa y los tiempos personalizados se conservan; las acciones destructivas piden confirmación explícita.

## Requisitos en EARS (en español)

- RF-x: CUANDO <evento>, EL SISTEMA <respuesta>.
- RF-x: SI <condición no deseada>, ENTONCES EL SISTEMA <respuesta>.
- RF-x: MIENTRAS <estado>, EL SISTEMA <respuesta>.
- RF-x: EL SISTEMA <comportamiento permanente>.

Cada RF debe ser verificable y terminar con "Origen:", indicando el escenario de la HU o la decisión de `decisiones.md` de la que sale. Cada escenario de la HU debe quedar cubierto por al menos un RF.

## Revisión final de la spec

Al terminar `spec.md`, lista sin proponer soluciones: contradicciones entre RF, escenarios de la HU sin RF y conflictos con los principios de `docs/constitution.md`. Máximo 10 puntos.

## Plan (plan.md)

Se organiza por capa (constitución, principio 3):

- **Archivos y responsabilidades:** los que se crean o modifican, agrupados por Capa 1 y Capa 2.
- **Capa 1** (`src/types/`, `src/utils/`, `src/storage/`, `src/services/`, `src/context/`): tipos y contratos; funciones puras (ciclo Pomodoro, validación de rangos, formateo `MM:SS`, tiempo restante con `endTimestamp - Date.now()`); persistencia; notificaciones, sonido y vibración; orquestación en contexto. Sin componentes visuales ni colores.
- **Capa 2** (`src/constants/`, `src/components/`, `src/app/`): cómo se pinta en la interfaz. Sin llamadas directas a `AsyncStorage` ni `expo-notifications`, ni cálculos de timestamps.
- **Algoritmo en pseudocódigo:** el conteo nunca depende solo de `setInterval` (principio 5).
- **Datos del estudiante:** qué se persiste, cuándo se restaura y qué acciones piden confirmación (principio 7).
- **Decisiones justificadas** con su alternativa descartada. Las de `decisiones.md` se citan por número.
- **Estrategia de pruebas:** qué se prueba con Jest en `__tests__/` junto a cada módulo de Capa 1 y qué se verifica a mano.
- Indica qué RF cubre cada parte.

## Tareas (tasks.md)

- [ ] **Tn. <Descripción>.** RF-x, RF-y
  - Hecho cuando: <comprobación verificable>.

Máximo 20-30 min por tarea, en orden de dependencia. Si salen más de 10, propón dividir la spec.

- Las tareas de Capa 1 empiezan por escribir la prueba y se verifican con `npx jest` y `npx tsc --noEmit`.
- Las tareas de interfaz, alarmas y segundo plano se verifican con la lista manual de `rn-conventions` en dispositivo/APK. Si tocan colores o estilos, también con `cotopaxi-brand`.

## Implementación

Una sola tarea cada vez:

1. Pruebas primero (en rojo) en `__tests__/`, solo en Capa 1.
2. Código hasta que pasen, siguiendo `plan.md` y las skills `pomodoro-rules`, `rn-conventions` y `cotopaxi-brand` cuando correspondan.
3. `npx jest` y `npx tsc --noEmit` en verde. Prohibido avanzar con pruebas en rojo o errores de tipos.
4. Revisión de fronteras: ningún archivo de Capa 1 importa componentes visuales ni colores; ningún archivo de Capa 2 llama a `AsyncStorage` ni `expo-notifications`, ni calcula timestamps. Si hay que cruzar la frontera, para y pregunta.
5. Marcar la tarea y parar.

Si la tarea toca la interfaz, bloqueo de pantalla o notificaciones, no ejecutes la app: entrega la lista manual de verificación y espera a que el usuario confirme que la probó en el dispositivo antes de marcarla como hecha. Si toca acciones destructivas (reiniciar o restablecer), verifica que pidan confirmación explícita.

No instales dependencias ni ejecutes `npx expo start` sin que el usuario lo pida.

Al cerrar la tarea, lista qué escenarios de la HU quedan cubiertos por pruebas y cuáles no. Informa; no declares que algo "está correcto".


================================================
ðŸ“„ ARCHIVO: .gitignore
================================================

# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

example

# generated native folders
/ios
/android


================================================
ðŸ“„ ARCHIVO: app.json
================================================

{
  "expo": {
    "name": "Academia_Cotopaxi",
    "slug": "Academia_Cotopaxi",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "academiacotopaxi",
    "userInterfaceStyle": "automatic",
    "ios": {
      "icon": "./assets/expo.icon"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false,
      "package": "com.anonymous.Academia_Cotopaxi"
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#208AEF",
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 76
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "4c27b92e-37eb-4199-a61e-45172e28ffca"
      }
    }
  }
}


================================================
ðŸ“„ ARCHIVO: docs\constitution.md
================================================

# Constitución - Pomodoro Academia Cotopaxi

Principios innegociables. Toda spec, plan y tarea debe cumplirlos.

1. **Simplicidad y cero fricción:** la aplicación funciona apenas se instala, 100% sin conexión a internet, sin creación de cuentas ni pantallas de registro, sin publicidad y sin guardar datos sensibles. No se añaden dependencias nuevas sin aprobación explícita.

2. **La spec manda:** nada se implementa si no está en la spec activa (`specs/NNN-nombre/`) o en `decisiones.md`. Si falta una decisión de producto o de diseño, se para, se marca como `[NECESITA ACLARACIÓN]` y se pregunta. Se trabaja solo la fase o tarea pedida, sin avanzar a la siguiente.

3. **Dos capas con fronteras estrictas:**
   - **Capa 1 (lógica de negocio):** `src/types/`, `src/utils/`, `src/storage/`, `src/services/` y `src/context/`. Ningún archivo de esta capa importa componentes visuales de React Native (`View`, `Text`, `StyleSheet`, etc.) ni constantes de colores.
   - **Capa 2 (diseño e interfaz):** `src/constants/`, `src/components/` y `src/app/`. Ningún archivo de esta capa llama directamente a `AsyncStorage`, `expo-notifications` ni hace cálculos manuales de timestamps. Solo consume la lógica a través de hooks de `src/context/`.

4. **Lógica pura aislada de efectos:** las reglas del ciclo Pomodoro (estudio, descanso corto, descanso largo), la validación de rangos de configuración, el formateo `MM:SS` y el cálculo del tiempo restante viven en funciones puras en `src/utils/`, tipadas con `src/types/`. Estas funciones no dependen de React, `AsyncStorage`, `expo-notifications` ni `AppState`.

5. **Exactitud temporal ante bloqueo o cierre:** el conteo de una sesión en curso NUNCA depende únicamente de un `setInterval` en memoria. Siempre se calcula a partir de marcas de tiempo reales (`endTimestamp - Date.now()`) persistidas localmente y respaldadas por notificaciones locales programadas del sistema operativo, de modo que el aviso (sonido y vibración) llegue aunque el celular esté bloqueado o la app cerrada.

6. **Pruebas como puerta:** toda la lógica de la Capa 1 se prueba con Jest (`npx jest`), con las pruebas escritas primero y ubicadas en `__tests__/` junto a cada módulo. Los tipos deben pasar `npx tsc --noEmit`. Prohibido avanzar con pruebas en rojo o errores de tipos. La interfaz, las alarmas y el bloqueo de pantalla se verifican con la lista manual de la tarea en el dispositivo/APK.

7. **Los datos del estudiante son sagrados:** la sesión activa y los tiempos personalizados se conservan al cerrar la app. Las acciones destructivas (reiniciar el temporizador o restablecer valores por defecto) siempre piden confirmación explícita. El formato de los datos guardados en almacenamiento local no se cambia sin aprobación.


================================================
ðŸ“„ ARCHIVO: docs\historias\HU-001.md
================================================

# HU-001 - Iniciar y controlar una sesión de estudio

Usuario: Estudiante
Prioridad: Alta - Riesgo: Bajo

Como estudiante, quiero iniciar, pausar y reiniciar un temporizador de estudio, para concentrarme durante un tiempo definido.

## Criterios de aceptación

### Escenario: Iniciar el temporizador
Dado que estoy en la pantalla principal
Cuando presiono iniciar
Entonces empieza la cuenta regresiva con el tiempo de estudio que tengo configurado y veo los minutos y segundos que faltan

### Escenario: Pausar y continuar
Dado que tengo el temporizador corriendo
Cuando lo pauso y luego lo reanudo
Entonces la cuenta sigue desde el tiempo en que la pausé

### Escenario: Reiniciar el temporizador
Dado que tengo el temporizador corriendo o pausado
Cuando decido reiniciarlo y lo confirmo
Entonces el temporizador vuelve al tiempo inicial de la fase en la que estoy

### Escenario: Cambiar de opinión al reiniciar
Dado que tengo el temporizador corriendo o pausado
Cuando decido reiniciarlo y cancelo
Entonces el temporizador conserva el tiempo que llevaba


================================================
ðŸ“„ ARCHIVO: docs\historias\HU-002.md
================================================

# HU-002 - Alternar entre estudio y descanso

Usuario: Estudiante
Prioridad: Media - Riesgo: Bajo

Como estudiante, quiero que la aplicación pase sola del tiempo de estudio al de descanso, para seguir la técnica Pomodoro sin tener que llevar la cuenta yo mismo.

## Criterios de aceptación

### Escenario: Terminar un pomodoro
Dado que termina un tiempo de estudio
Cuando todavía no completo los pomodoros necesarios para el descanso largo
Entonces la aplicación deja listo un descanso corto para que yo lo inicie

### Escenario: Llegar al descanso largo
Dado que completé la cantidad de pomodoros configurada (cuatro por defecto)
Cuando termina el último tiempo de estudio
Entonces la aplicación deja listo un descanso largo y el contador de pomodoros vuelve a cero

### Escenario: Terminar un descanso
Dado que termina un descanso corto o largo
Cuando vuelvo a la aplicación
Entonces la aplicación deja listo el siguiente tiempo de estudio

### Escenario: Ver mi avance
Dado que estoy en una sesión
Cuando miro la pantalla principal
Entonces veo si estoy en estudio o en descanso y cuántos pomodoros llevo en el ciclo actual


================================================
ðŸ“„ ARCHIVO: docs\historias\HU-003.md
================================================

# HU-003 - Mantener el conteo con el celular bloqueado o la app cerrada

Usuario: Estudiante
Prioridad: Alta - Riesgo: Alto

Como estudiante, quiero que el temporizador siga contando aunque bloquee el celular o cierre la aplicación, para no perder el tiempo que llevo estudiando.

## Criterios de aceptación

### Escenario: Bloquear el celular
Dado que tengo el temporizador corriendo
Cuando bloqueo el celular y lo desbloqueo unos minutos después
Entonces la aplicación muestra el tiempo restante correcto, descontando lo que pasó mientras estaba bloqueado

### Escenario: Cerrar la aplicación
Dado que tengo el temporizador corriendo
Cuando cierro la aplicación desde las apps recientes y la vuelvo a abrir
Entonces la aplicación recupera la sesión y muestra el tiempo restante correcto

### Escenario: El tiempo termina con la aplicación cerrada
Dado que cerré la aplicación con el temporizador corriendo
Cuando el tiempo se cumple antes de que vuelva a abrirla
Entonces igual recibo el aviso de fin y, al abrir la aplicación, la fase aparece como terminada

### Escenario: Pausar antes de cerrar
Dado que pausé el temporizador
Cuando cierro la aplicación y la vuelvo a abrir
Entonces el temporizador sigue pausado con el mismo tiempo restante y no recibo ningún aviso


================================================
ðŸ“„ ARCHIVO: docs\historias\HU-004.md
================================================

# HU-004 - Recibir aviso al terminar el tiempo

Usuario: Estudiante
Prioridad: Alta - Riesgo: Alto

Como estudiante, quiero que la aplicación me avise cuando termine el tiempo de estudio o de descanso, incluso con el celular en silencio, para cambiar de actividad sin estar mirando la pantalla.

## Criterios de aceptación

### Escenario: Aviso con el celular en sonido
Dado que el temporizador llega a cero
Cuando el celular tiene el sonido activado
Entonces recibo una notificación con sonido y vibración que me dice qué fase terminó

### Escenario: Aviso con el celular en silencio
Dado que el temporizador llega a cero
Cuando el celular está en modo silencio o vibración
Entonces la aplicación suena como alarma, vibra y muestra el aviso en la pantalla de bloqueo

### Escenario: Detener el aviso
Dado que la alarma está sonando
Cuando toco la notificación o el botón de detener
Entonces la alarma se calla y la aplicación se abre mostrando la siguiente fase

### Escenario: Permiso de notificaciones
Dado que no he dado permiso de notificaciones a la aplicación
Cuando inicio un temporizador por primera vez
Entonces la aplicación me explica para qué necesita el permiso y me lo solicita


================================================
ðŸ“„ ARCHIVO: docs\historias\HU-005.md
================================================

# HU-005 - Ajustar los tiempos del pomodoro

Usuario: Estudiante
Prioridad: Media - Riesgo: Bajo

Como estudiante, quiero cambiar la duración del estudio, de los descansos y la cantidad de pomodoros antes del descanso largo, para adaptar la técnica a mi ritmo.

## Criterios de aceptación

### Escenario: Cambiar un tiempo
Dado que estoy en la pantalla de ajustes
Cuando cambio un tiempo y guardo
Entonces el nuevo valor se usa desde la próxima fase y se mantiene aunque cierre la aplicación

### Escenario: Ingresar un valor no válido
Dado que estoy en la pantalla de ajustes
Cuando dejo un campo vacío, pongo cero o un valor fuera del rango permitido
Entonces la aplicación no guarda el cambio y me indica qué valores puedo usar

### Escenario: Volver a los valores por defecto
Dado que modifiqué los tiempos
Cuando elijo restablecer y lo confirmo
Entonces los tiempos vuelven a 25 minutos de estudio, 5 de descanso corto, 15 de descanso largo y 4 pomodoros por ciclo

### Escenario: Cambiar un tiempo con una fase en curso
Dado que tengo el temporizador corriendo
Cuando cambio la duración de esa misma fase
Entonces la fase actual termina con el tiempo con el que empezó y el cambio se aplica a la siguiente


================================================
ðŸ“„ ARCHIVO: docs\historias\HU-006.md
================================================

# HU-006 - Usar la aplicación sin registro, sin internet y sin publicidad

Usuario: Estudiante
Prioridad: Alta - Riesgo: Bajo

Como estudiante, quiero usar la aplicación apenas la instalo, sin crear una cuenta, sin datos móviles y sin anuncios, para empezar a estudiar sin trabas.

## Criterios de aceptación

### Escenario: Abrir la aplicación por primera vez
Dado que acabo de instalar la aplicación
Cuando la abro por primera vez
Entonces llego directo al temporizador, sin pantallas de registro ni de inicio de sesión

### Escenario: Usarla sin conexión
Dado que no tengo datos móviles ni wifi
Cuando uso el temporizador, los avisos y los ajustes
Entonces todo funciona igual y mis ajustes quedan guardados en el celular

### Escenario: Usarla sin publicidad
Dado que estoy usando la aplicación
Cuando paso por cualquiera de sus pantallas
Entonces no aparece ningún anuncio


================================================
ðŸ“„ ARCHIVO: eas.json
================================================

{
  "cli": {
    "version": ">= 25.3.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}


================================================
ðŸ“„ ARCHIVO: eslint.config.js
================================================

// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  }
]);


================================================
ðŸ“„ ARCHIVO: expo-env.d.ts
================================================

/// <reference types="expo/types" />

// NOTE: This file should not be edited and should be in your git ignore

================================================
ðŸ“„ ARCHIVO: jest.config.js
================================================

module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jest.setup.js"],
};


================================================
ðŸ“„ ARCHIVO: jest.setup.js
================================================

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));


================================================
ðŸ“„ ARCHIVO: MEMORY.md
================================================

MEMORY.md - Pomodoro Academia Cotopaxi

Estado del trabajo entre sesiones. Máximo ~50 líneas.

## Estado actual
- HU-001 a HU-005 implementadas y verificadas con pruebas en verde.
- HU-006 (006-offline): tareas T1 a T5 completadas y marcadas en [tasks.md](file:///c:/Users/USUARIO/Documents/Universidad/Movil/AM-Deber03/Academia_Cotopaxi/specs/006-offline/tasks.md).
- Ausencia de registro y publicidad, persistencia estricta, respaldo por vibración, continuidad en memoria y advertencias no bloqueantes verificadas.
- 20 suites de Jest pasando (146 pruebas unitarias en verde), 0 errores en `npx tsc --noEmit` y 0 errores en `npm run lint`.

## Próximos pasos
- Realizar la lista de verificación manual de la tarea T6 en dispositivo móvil/APK en Modo Avión continuo.
- Marcar T6 en `specs/006-offline/tasks.md` tras la confirmación manual para cerrar la HU-006.


================================================
ðŸ“„ ARCHIVO: package.json
================================================

{
  "name": "academia_cotopaxi",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "dependencies": {
    "@expo/ui": "~57.0.25",
    "@react-native-async-storage/async-storage": "2.2.0",
    "expo": "~57.0.30",
    "expo-constants": "~57.0.22",
    "expo-device": "~57.0.2",
    "expo-font": "~57.0.4",
    "expo-glass-effect": "~57.0.4",
    "expo-image": "~57.0.5",
    "expo-linking": "~57.0.13",
    "expo-notifications": "~57.0.23",
    "expo-router": "~57.0.28",
    "expo-splash-screen": "~57.0.10",
    "expo-status-bar": "~57.0.1",
    "expo-symbols": "~57.0.3",
    "expo-system-ui": "~57.0.4",
    "expo-web-browser": "~57.0.3",
    "jest-expo": "~57.0.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-native": "0.86.3",
    "react-native-gesture-handler": "~2.32.0",
    "react-native-reanimated": "4.5.1",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.10.1"
  },
  "devDependencies": {
    "@types/jest": "^30.0.0",
    "@types/react": "~19.2.2",
    "eslint": "^9.0.0",
    "eslint-config-expo": "~57.0.2",
    "typescript": "~6.0.3"
  },
  "scripts": {
    "start": "expo start",
    "test": "jest",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "private": true
}


================================================
ðŸ“„ ARCHIVO: README.md
================================================

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


================================================
ðŸ“„ ARCHIVO: skills-lock.json
================================================

{
  "version": 1,
  "skills": {
    "grill-me": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/productivity/grill-me/SKILL.md",
      "computedHash": "5e0c683385eafd83f106ac6c9d67dfbbfe5aa4b3fe65aad114eb1055a99c818f"
    },
    "grilling": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/productivity/grilling/SKILL.md",
      "computedHash": "c3b3e67f18495984385413bc6be7e2acbf2139c6cf52ef42abdda7242a791822"
    }
  }
}


================================================
ðŸ“„ ARCHIVO: specs\001-sesion-estudio\decisiones.md
================================================

# Decisiones de HU-001

## 1. Qué ocurre al llegar a cero

**Pregunta:** La historia no indica qué sucede cuando la cuenta llega a `00:00`. ¿Debe la sesión quedar finalizada y detenida o iniciar otra fase automáticamente?

**Respuesta:** Al llegar a `00:00`, la sesión queda finalizada y detenida hasta que el estudiante pulse Reiniciar. No inicia otra fase automáticamente.

**Motivo:** HU-001 solo define el control de una sesión de estudio; dejarla finalizada evita introducir una transición a descanso que la historia no especifica.

## 2. Estado al abrir o volver a la app

**Pregunta:** ¿Qué debe mostrarse en la primera apertura y cuando existe una sesión guardada? ¿Qué ocurre si una sesión corriendo vence mientras la app está cerrada?

**Respuesta:** La primera apertura muestra el temporizador detenido en el tiempo inicial configurado. Si existe una sesión guardada, se restaura su fase, estado y tiempo restante real. Si una sesión corriendo venció mientras la app estaba cerrada, se muestra finalizada en `00:00`.

**Motivo:** Conserva la sesión del estudiante y permite un conteo exacto basado en la hora real, incluso con la app cerrada.

## 3. Error al guardar o recuperar datos

**Pregunta:** ¿Qué debe ocurrir si la app no puede guardar o leer la sesión activa?

**Respuesta:** Se muestra un error claro, no se presenta la operación como guardada y se conserva el último estado confirmado.

**Motivo:** Continuar silenciosamente en memoria podría hacer que el estudiante pierda la sesión al cerrar la app sin saberlo.

## 4. Aviso de finalización no disponible

**Pregunta:** ¿Qué debe ocurrir si el sistema no permite programar el aviso local?

**Respuesta:** El estudiante puede iniciar y controlar el temporizador, y se muestra una advertencia explícita de que el aviso no estará disponible.

**Motivo:** El permiso no debe bloquear el temporizador, pero la aplicación debe informar claramente la limitación.

## 5. Controles cuando la sesión termina

**Pregunta:** ¿Qué controles quedan disponibles cuando la sesión finaliza en `00:00`?

**Respuesta:** Iniciar y Pausar quedan deshabilitados. Solo Reiniciar queda disponible para volver al tiempo inicial y requiere confirmación explícita.

**Motivo:** Evita iniciar accidentalmente otra cuenta y mantiene el reinicio como la única acción destructiva definida para este flujo.

## 6. Persistencia, avisos y formato de almacenamiento

**Pregunta:** ¿Qué dependencias y formato inicial deben utilizarse para conservar
la sesión activa y programar avisos locales?

**Respuesta:** Se usará `@react-native-async-storage/async-storage` para guardar
la sesión activa y `expo-notifications` para programar avisos locales. Las
dependencias se instalarán con `npx expo install` usando versiones compatibles
con Expo SDK 57. La sesión se almacenará como un único objeto JSON versionado
con la clave `pomodoro.activeSession`, con los campos
`schemaVersion`, `phase`, `status`, `initialDurationSeconds`,
`remainingSeconds` y `endTimestamp`.

**Motivo:** Esta combinación cubre la persistencia local y los avisos con la app
cerrada, mantiene la aplicación offline y evita introducir una base de datos
para una única sesión activa. El formato versionado permite detectar futuras
migraciones sin cambiarlo de forma implícita.


================================================
ðŸ“„ ARCHIVO: specs\001-sesion-estudio\plan.md
================================================

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


================================================
ðŸ“„ ARCHIVO: specs\001-sesion-estudio\spec.md
================================================

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


================================================
ðŸ“„ ARCHIVO: specs\001-sesion-estudio\tasks.md
================================================

# Tareas de implementación — Spec 001: Sesión de estudio

> Las tareas están ordenadas por dependencia y cada una debe completarse con
> las pruebas exigidas antes de avanzar. Las dependencias y el contrato de
> persistencia están aprobados en la Decisión 6.

- [x] **T1. Instalar dependencias aprobadas y preparar el contrato de persistencia.** RF-001, RF-003, RF-011, RF-013, RF-014
  - **Hecho cuando:** `npx expo install @react-native-async-storage/async-storage expo-notifications` termina correctamente, `package.json` refleja versiones compatibles con Expo SDK 57 y el contrato `pomodoro.activeSession` queda documentado en los tipos sin cambiarlo durante la implementación.

- [x] **T2. Definir tipos y utilidades temporales con pruebas primero.** RF-001, RF-002, RF-003, RF-009, RF-011, RF-012, RNF-002
  - **Hecho cuando:** `src/types/` y las pruebas de `timer`/contratos cubren tiempo restante desde `endTimestamp - Date.now()`, cero al vencer y `MM:SS`; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T3. Implementar las transiciones de sesión con pruebas primero.** RF-002, RF-004, RF-005, RF-006, RF-007, RF-008, RF-009, RF-010
  - **Hecho cuando:** las pruebas cubren iniciar, pausar, reanudar, reiniciar confirmado/cancelado, finalización y ausencia de transición automática; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T4. Implementar la validación de duración con pruebas primero.** RF-001, RF-002
  - **Hecho cuando:** los límites y entradas inválidas definidos por el flujo de configuración son aceptados/rechazados en Jest y `npx tsc --noEmit` pasa, sin crear una pantalla de configuración.

- [x] **T5. Implementar persistencia local con pruebas primero.** RF-001, RF-004, RF-005, RF-007, RF-011, RF-012, RF-013, RNF-001, RNF-003, RNF-004
  - **Hecho cuando:** lectura, escritura, ausencia de sesión y errores conservan el último estado confirmado según el contrato aprobado; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T6. Implementar el servicio de avisos con pruebas primero.** RF-003, RF-009, RF-014
  - **Hecho cuando:** el servicio programa/cancela el aviso, comunica permisos o fallos y no bloquea el control del temporizador cuando el aviso no está disponible; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T7. Orquestar restauración, ciclo de vida y acciones en el contexto con pruebas primero.** RF-001 a RF-005, RF-007, RF-009, RF-011 a RF-014
  - **Hecho cuando:** el contexto restaura sesiones pausadas/corriendo/vencidas, persiste cada transición, recalcula con hora real al volver al primer plano y expone errores/advertencias; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T8. Crear componentes visuales y confirmación de reinicio.** RF-002, RF-004, RF-005, RF-006, RF-008, RF-009, RF-010, RF-013, RF-014
  - **Hecho cuando:** los componentes reciben datos y callbacks por props, muestran `MM:SS`, deshabilitan iniciar/pausar en `00:00`, exigen confirmación para reiniciar y presentan errores/advertencias; verificación manual de `rn-conventions` y `cotopaxi-brand` completada.

- [x] **T9. Conectar la pantalla principal y el proveedor de contexto.** RF-001 a RF-014, RNF-001 a RNF-004
  - **Hecho cuando:** `src/app/` solo conecta contexto y componentes, no accede directamente a almacenamiento/avisos ni calcula timestamps; la pantalla funciona offline y pasa la lista manual de UI.

- [x] **T10. Ejecutar validación integral en dispositivo/APK y cerrar la tarea.** RF-001 a RF-014, RNF-001 a RNF-004
  - **Hecho cuando:** `npx jest`, `npx tsc --noEmit` y `npx expo lint` pasan; se verifica en dispositivo bloqueo, cierre, restauración, vencimiento, aviso disponible/no disponible y confirmación/cancelación; se registran en `MEMORY.md` solo Estado actual y Próximos pasos.


================================================
ðŸ“„ ARCHIVO: specs\002-estudio-descanso\decisiones.md
================================================

# Decisiones de HU-002

## 1. Inicio de la siguiente fase

**Pregunta:** La historia dice que la aplicación “pase sola” al siguiente
tiempo, pero los escenarios dicen que lo “deja listo para que yo lo inicie”.
¿Debe la siguiente fase comenzar automáticamente o quedar preparada y
detenida?

**Respuesta:** Al terminar una fase, la aplicación cambia automáticamente a la
siguiente fase y la deja preparada y detenida. El estudiante debe pulsar
Iniciar para comenzar a descontar el tiempo.

**Motivo:** Respeta la indicación de que la fase quede lista para que el
estudiante la inicie y evita comenzar un bloque sin una acción explícita.

## 2. Transición mientras la aplicación no está visible

**Pregunta:** ¿Qué debe ocurrir si el teléfono está bloqueado o la aplicación
está cerrada cuando termina una fase?

**Respuesta:** Al volver a la aplicación, se usa la hora real para procesar una
sola transición pendiente, actualizar el contador y dejar la siguiente fase
detenida. No se encadenan fases automáticamente.

**Motivo:** Mantiene el conteo exacto sin iniciar descansos o estudios que el
estudiante no haya comenzado explícitamente.

## 3. Momento en que aumenta el contador

**Pregunta:** ¿Cuándo debe aumentar el contador de pomodoros completados?

**Respuesta:** El contador aumenta al completar un tiempo de estudio. Después
del primer estudio se muestra 1 de 4 mientras el descanso corto está
preparado. Al completar el cuarto estudio, se prepara el descanso largo y el
contador vuelve a 0.

**Motivo:** El avance representa estudios completados, no estudios iniciados,
y permite identificar el ciclo actual antes del siguiente descanso largo.

## 4. Error al guardar una transición

**Pregunta:** ¿Qué debe ver el estudiante si falla el guardado de la nueva
fase o del contador?

**Respuesta:** La aplicación muestra un error claro, conserva la última fase y
el último contador guardados, y no presenta la transición como completada.

**Motivo:** Evita que una transición parezca exitosa cuando el estado podría
perderse al cerrar la aplicación.

## 5. Persistencia de una fase preparada

**Pregunta:** ¿Qué ocurre si el estudiante cierra la aplicación después de
que una fase quedó preparada, pero antes de iniciarla?

**Respuesta:** La fase preparada y el contador se guardan. Al volver, se
muestran exactamente igual, sin consumir tiempo ni avanzar automáticamente.

**Motivo:** Conserva el estado que el estudiante ya alcanzó y evita iniciar
una fase durante su ausencia.

## 6. Cambio del objetivo durante un ciclo

**Pregunta:** ¿Qué cantidad de pomodoros determina el descanso largo si el
estudiante cambia esa configuración mientras un ciclo está en curso?

**Respuesta:** El ciclo actual conserva el objetivo con el que comenzó. El
nuevo valor se aplica desde el siguiente ciclo, después de completar el
descanso largo y reiniciar el contador.

**Motivo:** Evita que el criterio para llegar al descanso largo cambie
inesperadamente a mitad del ciclo.

## 7. Estado guardado inválido

**Pregunta:** ¿Qué debe ocurrir si la sesión guardada está incompleta,
corrupta o contiene una fase o contador inválido?

**Respuesta:** La aplicación muestra un aviso claro de que no pudo recuperar la
sesión, descarta solo ese estado inválido y muestra una sesión nueva detenida
con los valores configurados. No intenta repararlo silenciosamente.

**Motivo:** Evita continuar con datos inconsistentes y hace visible al
estudiante que la sesión anterior no pudo recuperarse.

## 8. Evolución del formato de almacenamiento

**Pregunta:** ¿Cómo se incorporan la fase, los pomodoros completados y el
objetivo del ciclo al contrato persistido de `pomodoro.activeSession`?

**Respuesta:** Se utilizará la versión 2 del contrato manteniendo la clave
`pomodoro.activeSession`. Las sesiones de versión 1 se migrarán explícitamente
a una sesión equivalente de estudio detenida, conservando la duración y el
tiempo restante cuando sean válidos. Las versiones desconocidas o los datos
inválidos se rechazarán, mostrarán un aviso claro y crearán una sesión nueva
detenida según la Decisión 7.

**Motivo:** Conserva las sesiones existentes sin cambiar silenciosamente el
significado de la versión 1 y deja una base explícita para futuras
migraciones.


================================================
ðŸ“„ ARCHIVO: specs\002-estudio-descanso\plan.md
================================================

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


================================================
ðŸ“„ ARCHIVO: specs\002-estudio-descanso\spec.md
================================================

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


================================================
ðŸ“„ ARCHIVO: specs\002-estudio-descanso\tasks.md
================================================

# Tareas de implementación — Spec 002: Alternar entre estudio y descanso

> Ordenadas por dependencia. Las tareas de Capa 1 comienzan por pruebas y no
> avanzan con Jest o TypeScript en rojo. La migración a la versión 2 del
> contrato persistido está aprobada en la Decisión 8.

- [x] **T1. Definir el contrato de fases y ciclos con pruebas primero.** RF-001, RF-002, RF-003, RF-006, RF-008, RF-009
  - Hecho cuando: las pruebas de tipos/utilidades describen estudio, descanso corto, descanso largo, contador y objetivo por ciclo; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T2. Implementar el cálculo temporal y las transiciones puras.** RF-001, RF-002, RF-003, RF-004, RF-005, RF-007, RF-012
  - Hecho cuando: las pruebas escritas antes del código cubren finalización por hora real, preparación detenida, contador antes/después del objetivo, descanso que prepara estudio, y exactamente una transición; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T3. Extender y probar la validación de configuración.** RF-001, RF-002, RF-009
  - Hecho cuando: las duraciones y el objetivo aceptan solo los rangos ya definidos por la configuración, rechazan entradas inválidas y `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T4. Aplicar el contrato de persistencia versión 2 y su migración.** RF-006, RF-009, RF-010, RF-011, RNF-002, RNF-005
  - Hecho cuando: la versión 1 válida migra explícitamente a una sesión de estudio detenida versión 2, las versiones desconocidas y datos inválidos muestran aviso, y las pruebas de lectura/escritura pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T5. Implementar persistencia y restauración de fases con pruebas primero.** RF-005, RF-006, RF-010, RF-011, RF-012
  - Hecho cuando: una fase preparada se restaura sin consumir tiempo, un estado inválido produce aviso y sesión nueva detenida, y un fallo de escritura conserva el último estado confirmado; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T6. Adaptar avisos locales al ciclo de fases con pruebas primero.** RF-004, RF-005, RF-007, RNF-003, RNF-004
  - Hecho cuando: se programa/cancela el aviso de la fase corriendo, no se programan fases preparadas y los fallos quedan explícitos sin bloquear el temporizador; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T7. Orquestar transiciones y ciclo de vida en el contexto con pruebas primero.** RF-001 a RF-007, RF-009 a RF-012
  - Hecho cuando: el contexto procesa una sola transición al volver a primer plano, persiste fase/contador/objetivo juntos, conserva el estado ante error y expone mensajes de recuperación/guardado; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T8. Crear el componente de progreso y actualizar la pantalla.** RF-001 a RF-004, RF-008, RF-010, RF-011
  - Hecho cuando: `PomodoroProgress` recibe `completedPomodoros` y `cycleTarget` por props, la interfaz muestra fase, `MM:SS`, pomodoros completados y mensajes explícitos, deja detenida la siguiente fase y mantiene confirmación para reiniciar; verificación manual de `rn-conventions` y `cotopaxi-brand` completada.

- [x] **T9. Validar la historia completa en dispositivo/APK y cerrar la fase.** RF-001 a RF-012, RNF-001 a RNF-005
  - Hecho cuando: `npx jest`, `npx tsc --noEmit` y `npx expo lint` pasan; en dispositivo se verifican alternancia, contador, objetivo por ciclo, cierre/bloqueo, una sola transición, fase preparada persistida, errores explícitos y confirmación de reinicio; `MEMORY.md` contiene solo Estado actual y Próximos pasos actualizados.


================================================
ðŸ“„ ARCHIVO: specs\003-estudiante\decisiones.md
================================================

# Decisiones de HU-003

## 1. Estado al reabrir con fase vencida

**Pregunta:** La historia HU-003 indica que si el tiempo termina con la app cerrada, "al abrir la aplicación, la fase aparece como terminada", mientras que en HU-002 se acordó que al vencer una fase se deja la siguiente preparada y detenida. ¿Qué debe ver exactamente el estudiante en pantalla al abrir la app tras cumplirse el tiempo?

**Respuesta:** Pasar a la siguiente fase preparada y detenida (según HU-002), pero mostrando un aviso o mensaje en pantalla que informe claramente que la fase anterior terminó mientras la app no estaba activa.

**Motivo:** Mantiene la coherencia con el ciclo automático de fases definido en HU-002 sin iniciar bloques de tiempo sin acción del estudiante, a la vez que cumple el criterio de HU-003 dando visibilidad explícita de que la fase anterior terminó durante su ausencia.

## 2. Persistencia del identificador de aviso para cancelación exacta

**Pregunta:** Si el estudiante inicia el temporizador, cierra la app y luego la vuelve a abrir mientras sigue corriendo para pausar o reiniciar: ¿debe guardarse el identificador de la notificación programada en los datos persistidos de la sesión activa para garantizar su cancelación exacta?

**Respuesta:** Guardar el identificador del aviso (`notificationId`) en la sesión activa persistida (`pomodoro.activeSession`) para cancelarlo de forma exacta al pausar o reiniciar tras reabrir la app.

**Motivo:** Evita que al cerrar y reabrir la app se pierda la referencia al aviso nativo programado en el sistema operativo, impidiendo alarmas erróneas tras pausar o reiniciar.

## 3. Inconsistencia por reloj del sistema modificado hacia atrás

**Pregunta:** ¿Qué debe hacer la aplicación si la hora del sistema cambia hacia atrás (por cambio de zona horaria o ajuste manual del reloj) y el tiempo restante calculado resulta mayor a la duración original de la fase?

**Respuesta:** Limitar el tiempo restante a la duración inicial de la fase (no puede superar el total original) y mostrar una advertencia en pantalla indicando que la hora del reloj fue modificada.

**Motivo:** Evita que el temporizador muestre tiempos absurdos o superiores a los configurados debido a alteraciones en el reloj del dispositivo, informando de forma transparente la anomalía al estudiante.

## 4. Inactividad prolongada con sesión en curso vencida (> 24 horas)

**Pregunta:** Si el estudiante reabre la aplicación mucho tiempo después de que la fase venció (por ejemplo, al día siguiente o tras varias horas de inactividad), ¿cómo debe reaccionar la aplicación?

**Respuesta:** Si han transcurrido más de 24 horas desde que venció la sesión, considerar la sesión expirada por inactividad, reiniciar el contador de pomodoros a cero y dejar la fase de Estudio inicial lista y detenida, mostrando un aviso informativo.

**Motivo:** Permite que un estudiante que abandonó la app por un día o más no retome un ciclo desactualizado de jornadas anteriores, comenzando un nuevo ciclo limpio con la debida explicación visual.

## 5. Limpieza automática de notificaciones del sistema al abrir la app

**Pregunta:** Cuando el aviso de fin de fase ya se disparó mientras la app estaba cerrada o bloqueada y el estudiante abre la aplicación (sea tocando la notificación o abriendo el icono directamente): ¿debe limpiarse automáticamente la notificación de la bandeja del sistema?

**Respuesta:** Limpiar automáticamente el aviso de fin de la barra de notificaciones del sistema en cuanto el estudiante abre la aplicación, mostrando el aviso directamente en la interfaz.

**Motivo:** Mejora la experiencia evitando que notificaciones obsoletas queden fijas en la barra de estado del sistema una vez que el estudiante ya ingresó y visualizó el estado en la app.

## 6. Reprogramación del aviso tras reinicio del dispositivo

**Pregunta:** Si el dispositivo se apaga o reinicia mientras el temporizador estaba corriendo (lo cual borra las alarmas programadas en el sistema operativo), al volver a abrir la aplicación con tiempo aún pendiente: ¿debe la aplicación reprogramar automáticamente el aviso de fin en el sistema operativo?

**Respuesta:** Sí, recalcular el tiempo restante exacto y reprogramar automáticamente el aviso en el sistema con el nuevo tiempo restante, mostrando una advertencia solo si los permisos de notificación ya no estuvieran concedidos.

**Motivo:** Garantiza que el conteo en curso siga protegido ante reinicios accidentales del teléfono, asegurando que si el estudiante vuelve a bloquear la pantalla el aviso sonará al llegar a cero.

## 7. Expiración por inactividad prolongada en sesión pausada (> 24 horas)

**Pregunta:** En el caso de una sesión que fue pausada antes de cerrar la app (Escenario 4), si el estudiante vuelve después de más de 24 horas de inactividad: ¿debe aplicarse también la regla de expiración por inactividad (reiniciando el ciclo a 0 de 4 con aviso) o debe conservarse pausada indefinidamente?

**Respuesta:** Si la sesión estaba pausada por más de 24 horas sin actividad, considerarla también expirada, reiniciar el ciclo a 0 de 4 y preparar la sesión de Estudio inicial con un mensaje informativo.

**Motivo:** Mantiene la coherencia con la regla de 24 horas para sesiones vencidas, evitando mantener ciclos obsoletos pausados tras días de inactividad y ofreciendo un punto de partida fresco y claro para una nueva jornada de estudio.

## 8. Evolución del contrato persistido a versión 3

**Pregunta:** Para almacenar el identificador de aviso (Decisión 2) y la marca de tiempo de última actividad para la regla de las 24 horas (Decisiones 4 y 7): ¿cómo debe evolucionar el formato de datos persistidos en `pomodoro.activeSession`?

**Respuesta:** Actualizar el contrato a versión 3 en `pomodoro.activeSession` (agregando `notificationId` y `lastActiveTimestamp`), migrando de forma explícita y segura las sesiones válidas de la versión 2 y rechazando datos corruptos con un aviso claro.

**Motivo:** Cumple con el principio 7 de la constitución garantizando que la evolución del esquema sea controlada, explícita y versionada, facilitando pruebas y protegiendo los datos previos del estudiante.


================================================
ðŸ“„ ARCHIVO: specs\003-estudiante\plan.md
================================================

# Plan de implementación — Spec 003: Mantener el conteo con el celular bloqueado o la app cerrada

> La spec está aprobada y cubre RF-001 a RF-013 y RNF-001 a RNF-005. Este plan extiende
> la gestión del temporizador para garantizar exactitud temporal ante bloqueo de pantalla o
> cierre de la aplicación, reprogramación y cancelación precisa de avisos nativos,
> detección de alteraciones en el reloj, expiración por inactividad (> 24 h), limpieza de
> notificaciones y migración segura a la versión 3 del contrato persistido. No se añaden dependencias nuevas.

## Decisiones de producto y arquitectura resueltas

- **Decisión 1:** Al volver a abrir la aplicación tras cumplirse el tiempo de una fase en ausencia, se pasa a la siguiente fase preparada y detenida (según HU-002), mostrando un mensaje visible que informa que la fase anterior concluyó mientras la aplicación no estaba activa.
- **Decisión 2:** Se almacena el identificador del aviso (`notificationId`) en la sesión activa persistida (`pomodoro.activeSession`) para cancelarlo de forma exacta al pausar o reiniciar tras reabrir la app.
- **Decisión 3:** Si el reloj del dispositivo cambia hacia atrás y el tiempo restante calculado supera la duración inicial de la fase, se limita el tiempo restante a dicha duración nominal y se muestra una advertencia en pantalla informando la modificación del reloj.
- **Decisión 4:** Si transcurren más de 24 horas desde que venció una sesión sin interacción, se considera el ciclo expirado por inactividad, se reinicia el contador de pomodoros a 0 de 4 y se deja la fase de Estudio inicial preparada y detenida con un aviso explicativo.
- **Decisión 5:** Al ingresar a la aplicación (tras haberse disparado un aviso de fin), se limpian automáticamente las notificaciones de la bandeja del sistema mediante `dismissAllNotificationsAsync()`.
- **Decisión 6:** Si la app se reabre con una sesión en curso que aún tiene tiempo pendiente (por ejemplo, tras reinicio del teléfono), se recalcula el tiempo restante y se reprograma automáticamente el aviso nativo en el sistema operativo; si faltan permisos de notificación, se muestra una advertencia.
- **Decisión 7:** Si una sesión pausada permanece más de 24 horas sin actividad, se considera expirada por inactividad, se reinicia el ciclo a 0 de 4 y se prepara la fase de Estudio inicial con mensaje explicativo.
- **Decisión 8:** El contrato persistido en `pomodoro.activeSession` evoluciona a la versión 3 (incorporando `notificationId: string | null` y `lastActiveTimestamp: number`), manteniendo migración transparente desde las versiones 1 y 2, y descartando datos corruptos con un aviso claro.

---

## Archivos y responsabilidades

### Capa 1 — Lógica de negocio (sin imports de UI ni colores)

- `src/types/pomodoro.ts`:
  - Actualizar `StudySession` a `version: 3`, agregando `notificationId: string | null` y `lastActiveTimestamp: number`.
  - Definir tipos de estado de recuperación (`SessionRecoveryResult`, anomalías por reloj o inactividad).
- `src/utils/timer.ts` y `src/utils/timer.test.ts`:
  - Mantener cálculo puro del tiempo restante mediante `endTimestamp - currentTimestamp` y formato `MM:SS`.
  - Añadir soporte para detección de reloj atrasado con limitación estricta al tope nominal de la fase.
  - Pruebas unitarias para cálculo exacto, reloj atrasado, reloj adelantado y tiempo agotado.
- `src/utils/sessionRecovery.ts` y `src/utils/sessionRecovery.test.ts`:
  - Funciones puras para evaluar el estado de la sesión al restaurar o al volver a primer plano:
    - Evaluación de inactividad de más de 24 horas (86.400.000 ms) para fases vencidas o pausadas, retornando sesión inicial de estudio (0 pomodoros) y mensaje explicativo.
    - Detección de finalización en ausencia (fase vencida dentro de las 24 horas), derivando la siguiente fase preparada y detenida con mensaje informativo.
    - Detección de reloj atrasado (`remainingSeconds > initialDurationSeconds`).
  - Pruebas unitarias exhaustivas con timestamps simulados cubriendo todos los casos límite de tiempo.
- `src/storage/sessionStorage.ts` y `src/storage/sessionStorage.test.ts`:
  - Elevar `STORAGE_VERSION` a 3.
  - Validar campos de versión 3 (`notificationId` como `string | null`, `lastActiveTimestamp` como número entero positivo).
  - Migración transparente y explícita desde versiones 1 y 2 hacia versión 3.
  - Rechazo explícito de versiones desconocidas o datos corruptos lanzando `StorageError("invalid", ...)` sin borrar archivos arbitrarios.
  - Pruebas unitarias de lectura, escritura, migración v1→v3 y v2→v3, datos corruptos y errores de persistencia.
- `src/services/notificationService.ts` y `src/services/notificationService.test.ts`:
  - Añadir `dismissAllNotifications(): Promise<void>` para limpiar la bandeja del sistema operativo al entrar a la app.
  - Robustecer `cancelFinishNotification(notificationId: string | null)` para asegurar cancelación exacta del ID guardado.
  - Proveer reprogramación del aviso de fin con retorno del nuevo identificador generado.
  - Pruebas unitarias de programación, cancelación, limpieza y manejo de permisos denegados.
- `src/context/StudySessionContext.tsx` y `src/context/StudySessionContext.test.tsx`:
  - Orquestar la carga inicial y el evento `AppState` (`active`):
    - Limpieza automática de la bandeja del sistema (`dismissAllNotifications`).
    - Evaluación pura de inactividad (> 24 h), reloj atrasado y fin en ausencia.
    - Reprogramación automática del aviso nativo si la sesión estaba en curso y tiene tiempo pendiente.
    - Cancelación precisa del aviso persistido al pausar o reiniciar.
    - Gestión de mensajes informativos (`info`), advertencias (`warning`) y errores (`error`).
    - Actualización de `lastActiveTimestamp` en cada transición o persistencia.
  - Pruebas unitarias completas simulando ciclo de vida, segundo plano, cierre, restauración, reloj manipulado y datos corruptos.

### Capa 2 — Diseño e interfaz (sin llamadas a storage ni cálculos temporales)

- `src/constants/theme.ts`:
  - Conservar la paleta oficial de la Academia Cotopaxi (plantilla activa sobre blanco: `navyBrand`, `gold`, `slate`, `white`, `danger`).
- `src/components/SessionMessage.tsx`:
  - Extender el componente para recibir y presentar mensajes informativos (`info`), advertencias (`warning`) y errores (`error`) con contraste accesible y estilo Cotopaxi.
- `src/components/StudyTimer.tsx`, `src/components/StudyTimerControls.tsx`, `src/components/PomodoroProgress.tsx`, `src/components/RestartConfirmation.tsx`:
  - Mantener como componentes visuales puros que reciben datos y callbacks por `props`.
- `src/app/index.tsx`:
  - Conectar el contexto con los componentes de la interfaz, visualizando los avisos de fase terminada en ausencia, inactividad o anomalías del reloj según las props del contexto.

---

## Organización por capa

### Capa 1: Lógica de negocio
1. Los contratos y esquemas definen sesión versión 3, preservando `notificationId` y `lastActiveTimestamp`.
2. Las funciones de `src/utils/` son puras y deterministas, recibiendo marcas de tiempo explícitas y duraciones sin depender del reloj global ni de componentes de React.
3. El almacenamiento valida rigurosamente los esquemas, efectúa migraciones declaradas y no repara datos corruptos silenciosamente.
4. El servicio nativo maneja permisos, programación, cancelación precisa y descarte de notificaciones en la bandeja del sistema.
5. El contexto centraliza `AppState`, coordina la persistencia atómica y expone un estado reactivo y mensajes limpios a la UI.

### Capa 2: Diseño e interfaz
1. Las pantallas y componentes no hacen operaciones asíncronas de almacenamiento ni programan notificaciones.
2. Toda la información temporal se recibe formateada o procesada desde el contexto.
3. Las advertencias y mensajes informativos se muestran en español con los colores normados en la paleta institucional de la Academia Cotopaxi.

---

## Algoritmo en pseudocódigo

### Restauración inicial y cambio a `AppState: "active"`

```text
funcion sincronizarEstadoSesion(sesionActual, marcaActual, duraciones):
  // 1. Limpieza de notificaciones del sistema
  descartarNotificacionesDeBandeja()

  // 2. Comprobar inactividad prolongada (> 24 horas = 86.400.000 ms)
  si sesionActual.status == "running" y sesionActual.endTimestamp != null:
    si (marcaActual - sesionActual.endTimestamp) > 24 horas:
      sesionLimpia = crearSesionInicialEstudio(duraciones)
      persistir(sesionLimpia)
      establecerMensajeInfo("El ciclo anterior expiró por inactividad (más de 24 horas). Se inició un nuevo ciclo de estudio.")
      retornar sesionLimpia

  si sesionActual.status == "paused":
    si (marcaActual - sesionActual.lastActiveTimestamp) > 24 horas:
      sesionLimpia = crearSesionInicialEstudio(duraciones)
      persistir(sesionLimpia)
      establecerMensajeInfo("La sesión pausada expiró por inactividad (más de 24 horas). Se inició un nuevo ciclo de estudio.")
      retornar sesionLimpia

  // 3. Comprobar reloj del sistema modificado hacia atrás
  si sesionActual.status == "running" y sesionActual.endTimestamp != null:
    tiempoCalculado = calcularRestante(sesionActual.endTimestamp, marcaActual)
    si tiempoCalculado > sesionActual.initialDurationSeconds:
      sesionCorregida = clonar(sesionActual)
      sesionCorregida.remainingSeconds = sesionActual.initialDurationSeconds
      sesionCorregida.endTimestamp = marcaActual + (sesionCorregida.remainingSeconds * 1000)
      persistir(sesionCorregida)
      establecerAdvertencia("Se detectó un cambio en el reloj del dispositivo. El tiempo restante se ajustó al máximo de la fase.")
      retornar sesionCorregida

  // 4. Comprobar fin de fase en curso mientras la app no estaba activa
  si sesionActual.status == "running" y sesionActual.endTimestamp != null:
    tiempoCalculado = calcularRestante(sesionActual.endTimestamp, marcaActual)
    si tiempoCalculado == 0:
      siguienteSesion = calcularSiguienteFasePreparada(sesionActual, duraciones)
      siguienteSesion.notificationId = null
      siguienteSesion.lastActiveTimestamp = marcaActual
      persistir(siguienteSesion)
      establecerMensajeInfo("La fase anterior terminó mientras la aplicación no estaba activa.")
      retornar siguienteSesion
    si no:
      // La sesión sigue corriendo con tiempo pendiente: verificar reprogramación de aviso
      nuevoIdAviso = reprogramarAvisoSiEsNecesario(sesionActual.endTimestamp, sesionActual.phase)
      sesionActualizada = clonar(sesionActual)
      sesionActualizada.remainingSeconds = tiempoCalculado
      sesionActualizada.notificationId = nuevoIdAviso
      sesionActualizada.lastActiveTimestamp = marcaActual
      persistir(sesionActualizada)
      retornar sesionActualizada

  retornar sesionActual
```

### Pausar y Reiniciar con cancelación exacta

```text
funcion pausarSesion(sesionActual, marcaActual):
  si sesionActual.status != "running":
    retornar
  sesionPausada = pausarPura(sesionActual, marcaActual)
  si sesionActual.notificationId != null:
    cancelarAvisoNativo(sesionActual.notificationId)
  sesionPausada.notificationId = null
  sesionPausada.lastActiveTimestamp = marcaActual
  persistir(sesionPausada)

funcion reiniciarSesion(sesionActual, confirmada):
  si no confirmada:
    retornar
  si sesionActual.notificationId != null:
    cancelarAvisoNativo(sesionActual.notificationId)
  nuevaSesion = crearSesionInicialEstudio()
  persistir(nuevaSesion)
```

---

## Datos del estudiante y acciones destructivas

- **Persistencia en `pomodoro.activeSession` (v3):** Se guardan versión, fase, estado, duración inicial, tiempo restante, `endTimestamp`, pomodoros completados, objetivo de ciclo, `notificationId` (o `null`) y `lastActiveTimestamp`. No se recogen cuentas ni datos personales.
- **Acciones destructivas:**
  - El reinicio del temporizador requiere confirmación explícita mediante diálogo modal.
  - La expiración por inactividad de más de 24 horas limpia el contador de pomodoros y devuelve a la fase inicial de estudio únicamente tras confirmar el paso del tiempo, informando de forma transparente la razón al estudiante.
- **Resguardo ante datos corruptos:** Si el contenido almacenado es inválido o no compatible, se informa al usuario mediante un mensaje visible, se descartan únicamente los datos inválidos y se inicializa una sesión limpia detenida con valores por defecto.

---

## Decisiones técnicas y alternativas descartadas

1. **Persistencia del identificador de notificación (`notificationId`):**
   - *Adoptada (Decisión 2):* Guardar el ID retornado por `expo-notifications` en el contrato v3 de la sesión activa para cancelar puntualmente la alarma programada.
   - *Descartada:* Depender únicamente de `cancelAllScheduledNotificationsAsync()`, lo cual podría interferir con avisos de otras funcionalidades o no garantizar cancelación si se reprograman tareas.
2. **Registro de última actividad (`lastActiveTimestamp`):**
   - *Adoptada (Decisiones 4, 7 y 8):* Registrar la marca de tiempo de la última interacción o finalización en el contrato para evaluar con exactitud matemática el umbral de 24 horas.
   - *Descartada:* Suponer que la sesión es reciente sin almacenar fecha absoluta o depender de marcas del sistema de archivos.
3. **Limpieza proactiva de bandeja:**
   - *Adoptada (Decisión 5):* Ejecutar `dismissAllNotificationsAsync()` al ingresar a la app en primer plano para evitar notificaciones residuales.
   - *Descartada:* Dejar que la notificación persista en la barra de estado obligando al estudiante a descartarla manualmente.
4. **Tratamiento de salto temporal negativo (reloj hacia atrás):**
   - *Adoptada (Decisión 3):* Limitar el tiempo restante a la duración nominal configurada y mostrar advertencia visible.
   - *Descartada:* Dejar que el temporizador incremente su tiempo por encima de la duración configurada o bloquear la app en estado de error irrecuperable.
5. **Evolución del contrato a versión 3 con soporte legacy v1 y v2:**
   - *Adoptada (Decisión 8):* Esquema v3 que migra automáticamente sesiones válidas previas sin pérdida de avance.
   - *Descartada:* Borrar el almacenamiento local o romper la compatibilidad con usuarios que ya tenían sesiones de HU-001 o HU-002.

---

## Estrategia de pruebas

### Pruebas unitarias automatizadas con Jest (`npx jest`)

- `timer.test.ts`:
  - Cálculo de tiempo restante con reloj modificado hacia atrás (comprobación de limitación al máximo).
  - Cálculo normal de tiempo restante y formato `MM:SS`.
- `sessionRecovery.test.ts`:
  - Inactividad > 24 horas tras vencer una fase (retorno a estudio con 0 pomodoros y aviso informativo).
  - Inactividad > 24 horas en sesión pausada (reinicio de ciclo y mensaje explicativo).
  - Retorno dentro de las 24 horas tras finalizar fase en ausencia (preparar siguiente fase detenida con mensaje visible).
  - Retorno con sesión en curso y tiempo restante válido.
- `sessionStorage.test.ts`:
  - Guardado y lectura de sesión versión 3 con `notificationId` y `lastActiveTimestamp`.
  - Migración explícita y transparente de sesiones v1 a v3.
  - Migración explícita y transparente de sesiones v2 a v3.
  - Detección y rechazo de JSON corrupto, campos faltantes y versiones desconocidas con error tipado `StorageError("invalid", ...)`.
- `notificationService.test.ts`:
  - Descarte de notificaciones en bandeja (`dismissAllNotifications`).
  - Cancelación exacta por `notificationId`.
  - Comportamiento en entornos sin permisos o sin módulo nativo disponible.
- `StudySessionContext.test.tsx`:
  - Recuperación de sesión corriendo al montar y en evento `AppState: "active"`.
  - Recuperación de sesión pausada tras cierre manteniendo tiempo sin avisos sonoros.
  - Cancelación de notificación programada al pausar y al reiniciar.
  - Presentación de advertencia ante reloj atrasado.
  - Presentación de aviso de inactividad de más de 24 horas.
  - Notificación de fase vencida en ausencia.
  - Manejo y aviso de datos corruptos al restaurar.

### Verificación manual en dispositivo móvil / APK

- Bloquear la pantalla con el temporizador corriendo durante 2 minutos; desbloquear y verificar que se descontaron exactamente los 2 minutos.
- Cerrar la app desde aplicaciones recientes con el temporizador corriendo; abrirla y comprobar que continúa desde el tiempo real exacto.
- Cerrar la app con el temporizador corriendo a falta de 1 minuto; esperar a que venza el tiempo, verificar aviso sonoro y vibración con celular bloqueado; abrir la app y comprobar que la siguiente fase está preparada y detenida con mensaje visible.
- Pausar la sesión, cerrar la app y reabrirla; comprobar que sigue pausada con el mismo tiempo y que no emite alarma.
- Pausar o reiniciar una sesión restaurada y verificar que la notificación programada no se dispara.
- Alterar el reloj del sistema hacia atrás y comprobar que la app limita el tiempo al valor nominal y muestra la advertencia.
- Simular o verificar inactividad mayor a 24 horas y corroborar el reinicio a 0 pomodoros con mensaje informativo.
- Descartar automáticamente la notificación de la barra de estado al entrar a la app.

---

## Cobertura de requisitos

- **RF-001:** `timer.ts`, `sessionRecovery.ts` y sincronización ante cambio de `AppState` en el contexto.
- **RF-002:** `sessionStorage.ts`, `sessionRecovery.ts` y restauración al montar `StudySessionContext`.
- **RF-003:** `notificationService.ts` y canal prioritario nativo con trigger por fecha absoluta.
- **RF-004:** `sessionRecovery.ts`, `phaseTransition.ts`, `StudySessionContext` y `SessionMessage`.
- **RF-005:** `sessionStorage.ts`, `sessionRecovery.ts` y `StudySessionContext`.
- **RF-006:** `notificationService.ts` (cancelación por ID), `session.ts` y callbacks en `StudySessionContext`.
- **RF-007:** `timer.ts`, `sessionRecovery.ts`, advertencia en contexto y `SessionMessage`.
- **RF-008:** `sessionRecovery.ts`, detección de 24 horas tras vencer, contexto y `SessionMessage`.
- **RF-009:** `sessionRecovery.ts`, detección de 24 horas en pausa, contexto y `SessionMessage`.
- **RF-010:** `notificationService.ts` (`dismissAllNotifications`) invocado en `StudySessionContext`.
- **RF-011:** Reprogramación en `StudySessionContext` y comprobación de permisos en `notificationService.ts`.
- **RF-012:** Validación en `sessionStorage.ts`, captura en contexto y mensaje de error en `SessionMessage`.
- **RF-013:** Esquema v3 y migradores declarativos de v1 y v2 en `sessionStorage.ts`.
- **RNF-001 y RNF-005:** Arquitectura local sin red, sin telemetría ni datos sensibles.
- **RNF-002 y RNF-003:** Cálculo basado en marcas de tiempo reales y notificaciones nativas programadas.
- **RNF-004:** Mensajes visuales explícitos para inactividad, reloj alterado y datos corruptos en `SessionMessage`.

---

## Criterio de salida de la planificación

Se definen 7 tareas de implementación, cada una acotada a un tiempo máximo estimado de 20 a 30 minutos, ordenadas estrictamente por dependencias (tipos → utilidades puras → almacenamiento → servicios → contexto → interfaz → verificación). No se requiere dividir la spec.


================================================
ðŸ“„ ARCHIVO: specs\003-estudiante\spec.md
================================================

# Spec 003 — Mantener el conteo con el celular bloqueado o la app cerrada

Estado: aprobado
HU de origen: docs/historias/HU-003.md

## Contexto y objetivo

El estudiante necesita tener la seguridad de que el tiempo de su sesión de estudio o descanso se registrará con total exactitud sin importar si bloquea la pantalla de su teléfono o cierra la aplicación. Asimismo, si el tiempo de una fase culmina mientras la aplicación no está activa, el estudiante debe recibir el aviso correspondiente a tiempo y encontrar al regresar un estado consistente y comprensible, con la siguiente fase preparada y detenida y el avance de su ciclo debidamente preservado.

## Usuarios

- Estudiante de la Academia Cotopaxi.

## Historias de usuario

Como estudiante, quiero que el temporizador siga contando aunque bloquee el celular o cierre la aplicación, para no perder el tiempo que llevo estudiando.

## Definiciones

- **Fase en curso:** fase de estudio, descanso corto o descanso largo que se encuentra actualmente en cuenta regresiva activa.
- **Fase pausada:** fase que fue iniciada pero cuya cuenta regresiva fue detenida voluntariamente por el estudiante, manteniendo un tiempo restante menor a su duración inicial.
- **Fase preparada:** fase seleccionada por el ciclo Pomodoro que muestra su duración inicial completa y permanece detenida esperando la acción del estudiante para iniciar.
- **Aviso de fin:** señal sonora y de vibración emitida en el dispositivo al completarse la duración de una fase.
- **Hora real de finalización:** instante temporal absoluto calculado al iniciar o reanudar una fase (`tiempo actual + tiempo restante`), independiente de la ejecución activa de la aplicación en pantalla.
- **Inactividad prolongada:** período superior a 24 horas transcurrido desde la culminación o pausa de una fase sin interacción del estudiante en la aplicación.

## Requisitos funcionales

- **RF-001:** MIENTRAS el temporizador esté en curso y la pantalla del celular se bloquee o la aplicación pase a segundo plano, EL SISTEMA calculará el tiempo restante con base en la hora real transcurrida, mostrando el tiempo exacto al desbloquear el dispositivo o reanudar la aplicación.
  **Origen:** Escenario «Bloquear el celular» de HU-003 y principio 5 de `docs/constitution.md`.

- **RF-002:** CUANDO el estudiante vuelva a abrir la aplicación tras haberla cerrado con una fase en curso y el tiempo restante no haya llegado a cero, EL SISTEMA recuperará la sesión activa y mostrará el tiempo restante exacto calculado a partir de la hora real de finalización.
  **Origen:** Escenario «Cerrar la aplicación» de HU-003 y principio 5 de `docs/constitution.md`.

- **RF-003:** CUANDO el tiempo de una fase en curso se cumpla mientras la aplicación está cerrada o con la pantalla bloqueada, EL SISTEMA emitirá en el dispositivo el aviso sonoro y de vibración programado en el momento exacto de finalización.
  **Origen:** Escenario «El tiempo termina con la aplicación cerrada» de HU-003 y principio 5 de `docs/constitution.md`.

- **RF-004:** CUANDO el estudiante abra la aplicación después de que una fase haya concluido mientras la aplicación no estaba activa, EL SISTEMA dejará la siguiente fase preparada y detenida, actualizará el contador de pomodoros según corresponda y mostrará un mensaje visible informando que la fase anterior terminó en su ausencia.
  **Origen:** Escenario «El tiempo termina con la aplicación cerrada» de HU-003 y Decisión 1 de `decisiones.md`.

- **RF-005:** CUANDO el estudiante vuelva a abrir la aplicación tras haberla cerrado con el temporizador pausado dentro de las 24 horas siguientes, EL SISTEMA recuperará la sesión en estado pausado con el mismo tiempo restante que tenía al salir, sin emitir ningún aviso sonoro ni de vibración.
  **Origen:** Escenario «Pausar antes de cerrar» de HU-003 y Decisión 7 de `decisiones.md`.

- **RF-006:** CUANDO el estudiante pause o reinicie una sesión recuperada que estaba en curso, EL SISTEMA cancelará inmediatamente el aviso de finalización programado en el dispositivo para evitar alarmas erróneas posteriores.
  **Origen:** Decisión 2 de `decisiones.md`.

- **RF-007:** SI el reloj del sistema es modificado hacia atrás de tal forma que el tiempo restante calculado resulte mayor a la duración total configurada para la fase, ENTONCES EL SISTEMA limitará el tiempo restante a dicha duración inicial y mostrará una advertencia visible informando que la hora del dispositivo fue modificada.
  **Origen:** Decisión 3 de `decisiones.md`.

- **RF-008:** SI han transcurrido más de 24 horas desde que concluyó una fase sin que el estudiante haya abierto la aplicación, ENTONCES EL SISTEMA considerará el ciclo expirado por inactividad, reiniciará el contador de pomodoros a cero, dejará preparada y detenida la fase inicial de estudio y mostrará un aviso informativo explicando la expiración.
  **Origen:** Decisión 4 de `decisiones.md`.

- **RF-009:** SI una sesión pausada permanece sin reanudarse ni reiniciarse durante más de 24 horas, ENTONCES EL SISTEMA considerará la sesión expirada por inactividad, reiniciará el contador de pomodoros a cero, dejará preparada y detenida la fase inicial de estudio y mostrará un aviso informativo explicando la expiración.
  **Origen:** Decisión 7 de `decisiones.md`.

- **RF-010:** CUANDO el estudiante abra la aplicación habiéndose ya emitido el aviso de fin de fase en el dispositivo, EL SISTEMA retirará automáticamente la notificación correspondiente de la barra del sistema y presentará el estado directamente en pantalla.
  **Origen:** Decisión 5 de `decisiones.md`.

- **RF-011:** CUANDO el estudiante abra la aplicación con una sesión en curso que aún tiene tiempo restante y cuyo aviso nativo requiera reprogramación, EL SISTEMA reprogramará automáticamente el aviso de fin con el tiempo restante exacto; SI los permisos de notificación del dispositivo no estuvieran concedidos, ENTONCES EL SISTEMA mostrará una advertencia al respecto.
  **Origen:** Decisión 6 de `decisiones.md`.

- **RF-012:** SI se detectan datos guardados incompletos, corruptos o incompatibles al intentar restaurar la sesión activa, ENTONCES EL SISTEMA mostrará un aviso claro comunicando la imposibilidad de recuperar la sesión anterior, descartará únicamente dicho estado inválido y preparará una sesión nueva detenida lista con los valores configurados.
  **Origen:** Decisión 8 de `decisiones.md` y principio 7 de `docs/constitution.md`.

- **RF-013:** EL SISTEMA mantendrá la compatibilidad y recuperará de manera íntegra y transparente las sesiones guardadas válidas originadas en versiones previas de la aplicación.
  **Origen:** Decisión 8 de `decisiones.md` y principio 7 de `docs/constitution.md`.

## Requisitos no funcionales

- **RNF-001:** La aplicación y el control de sesiones operarán 100% de manera local y fuera de línea, sin exigir registro, inicio de sesión ni conexión a internet.
- **RNF-002:** El cálculo de tiempo no dependerá del refresco visual de la pantalla ni de temporizadores volátiles en memoria durante la suspensión de la aplicación.
- **RNF-003:** Las alarmas y avisos locales deberán programarse de modo que funcionen en el momento exacto aun cuando el dispositivo se encuentre bloqueado o con la aplicación cerrada.
- **RNF-004:** Toda condición irregular detectada al recuperar el estado (reloj alterado, inactividad superior a 24 horas o corrupción de datos) se informará de forma explícita y transparente al estudiante mediante mensajes visuales claros.
- **RNF-005:** No se recopilarán ni guardarán datos de carácter personal o confidencial del estudiante.

## Casos límite

- **Reinicio del dispositivo móvil:** Si el teléfono se apaga o reinicia mientras corre una fase, al reabrir la aplicación con tiempo pendiente, el sistema recalcula el tiempo restante a partir de la hora real y reprograma la alarma en el sistema operativo.
- **Apertura de la aplicación en el instante exacto de finalización:** Si la aplicación se abre en el milisegundo exacto en que expira la fase o inmediatamente después, se procesa como fase finalizada, preparando la siguiente fase detenida y mostrando el aviso en pantalla.
- **Retorno tras más de 24 horas:** Independientemente de si la sesión quedó corriendo o pausada, transcurridas más de 24 horas sin actividad se limpia el ciclo acumulado, volviendo a 0 pomodoros con aviso explícito.
- **Cambio deliberado o accidental del reloj del teléfono:** Si la hora del sistema se atrasa, el tiempo restante nunca excede la duración nominal de la fase y se muestra advertencia. Si la hora se adelanta más allá del tiempo de fin, se procesa la fase como finalizada.
- **Permisos de notificación deshabilitados:** Si el estudiante desactiva los avisos en la configuración del teléfono, la aplicación mantiene la exactitud del cálculo en pantalla y muestra una advertencia informativa de la falta de permisos al reprogramar o continuar la sesión.
- **Cierre repentino tras pausar:** Si la estudiante pausa y de inmediato expulsa la aplicación de la lista de tareas recientes, el tiempo restante pausado se conserva intacto al reabrir antes de las 24 horas.

## Fuera de alcance

- Encadenar automáticamente múltiples fases sucesivas (por ejemplo, pasar de estudio a descanso corto y de descanso corto a estudio) mientras la app está cerrada sin la presencia e inicio del estudiante.
- Crear alarmas con repetición infinita o tonos externos no provistos de forma local.
- Sincronización en la nube o seguimiento remoto de tiempos entre varios dispositivos.
- Modificar configuraciones globales del sistema operativo que escapen al estándar de permisos de notificaciones locales.
- Forzar la apertura o encendido automático de la pantalla si el sistema operativo del fabricante lo restringe de manera nativa.

## Criterios de finalización

- Todos los escenarios de HU-003 cuentan con requisitos funcionales explícitos y verificables en formato EARS.
- Se contemplan e integran formalmente las 8 decisiones tomadas en `decisiones.md`.
- El cálculo del tiempo en curso ante bloqueo o cierre de la aplicación se rige por la hora real de finalización y no por contadores volátiles en memoria.
- Al terminar el tiempo con la app cerrada se garantiza la emisión del aviso programado y, al reabrir, se presenta la siguiente fase preparada y detenida con mensaje visible.
- Al pausar o reiniciar una sesión restaurada se garantiza la cancelación del aviso nativo programado.
- Se gestionan de forma segura y advertida los escenarios de reloj retrasado, inactividad de más de 24 horas y datos corruptos.
- La spec está expresada estrictamente en términos del QUÉ y POR QUÉ funcional observable, sin referencias a nombres de archivos, carpetas, código ni arquitectura interna.

## Dudas abiertas

Ninguna.

## Revisión final de la spec

1. **Consistencia interna:** Los RF-001 a RF-013 son mutuamente consistentes; en particular, RF-004 respeta la regla de HU-002 de dejar la siguiente fase preparada y detenida mientras cumple HU-003 al visibilizar que la fase terminó en ausencia.
2. **Cobertura de la HU:** Los cuatro escenarios de HU-003 («Bloquear el celular», «Cerrar la aplicación», «El tiempo termina con la aplicación cerrada» y «Pausar antes de cerrar») se encuentran cubiertos en su totalidad por RF-001, RF-002, RF-003, RF-004 y RF-005.
3. **Alineación con la constitución:** Se respeta plenamente el principio 1 (sin cuentas, sin conexión, sin datos sensibles), el principio 5 (exactitud temporal por marcas de tiempo reales y notificaciones locales), y el principio 7 (los datos del estudiante se preservan y los datos corruptos se manejan explícitamente sin fallos silenciosos).
4. **Sin desbordamiento de alcance:** No se introducen detalles de implementación, nombres de archivos de código ni estructuras de carpetas en la spec.


================================================
ðŸ“„ ARCHIVO: specs\003-estudiante\tasks.md
================================================

# Tareas de implementación — Spec 003: Mantener el conteo con el celular bloqueado o la app cerrada

> Ordenadas por dependencia. Las tareas de Capa 1 comienzan por pruebas y no
> avanzan con Jest o TypeScript en rojo. La migración a la versión 3 del contrato
> persistido está aprobada en la Decisión 8.

- [x] **T1. Contrato versión 3 de la sesión y tipos de recuperación con pruebas primero.** RF-001, RF-002, RF-005, RF-006, RF-013
  - Hecho cuando: `StudySession` en `src/types/pomodoro.ts` define `version: 3`, `notificationId: string | null` y `lastActiveTimestamp: number`; los tipos de anomalías de recuperación están tipados y `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T2. Funciones puras de cálculo temporal con detección de reloj atrasado e inactividad con pruebas primero.** RF-001, RF-002, RF-004, RF-005, RF-007, RF-008, RF-009
  - Hecho cuando: las pruebas unitarias escritas antes del código en `timer.test.ts` y `sessionRecovery.test.ts` cubren cálculo exacto por marca de tiempo real, limitación a duración nominal ante reloj retrasado, expiración a 0 de 4 con mensaje tras > 24 h de inactividad (en fase vencida o pausada) y detección de fase terminada en ausencia; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T3. Persistencia versión 3, migración (v1 y v2) y descarte seguro de datos corruptos con pruebas primero.** RF-005, RF-006, RF-012, RF-013, RNF-002, RNF-005
  - Hecho cuando: `sessionStorage.ts` almacena y lee el contrato versión 3, migra limpiamente sesiones válidas de versión 1 y versión 2 asignando `notificationId: null` y `lastActiveTimestamp`, y lanza error tipado sin modificar datos ante esquemas corruptos o desconocidos; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T4. Servicios nativos de notificaciones: cancelación exacta y limpieza de bandeja con pruebas primero.** RF-003, RF-006, RF-010, RF-011, RNF-003
  - Hecho cuando: `notificationService.ts` incluye `dismissAllNotifications()` para limpiar la barra de estado, garantiza la cancelación puntual por `notificationId`, gestiona advertencia ante permisos denegados y sus pruebas unitarias en `notificationService.test.ts` pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T5. Orquestar recuperación de sesión, reprogramación y AppState en el contexto con pruebas primero.** RF-001 a RF-013
  - Hecho cuando: `StudySessionContext.tsx` limpia la bandeja de notificaciones al montar y ante `AppState: "active"`, procesa inactividad > 24 h, advierte reloj retrasado, reprograma avisos de sesiones en curso con tiempo pendiente, cancela la alarma al pausar o reiniciar mediante el ID persistido, y muestra mensajes explícitos de fase vencida en ausencia o datos corruptos; las pruebas en `StudySessionContext.test.tsx` pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T6. Extender la visualización de avisos informativos y advertencias en la interfaz.** RF-004, RF-007, RF-008, RF-009, RF-011, RF-012, RNF-004
  - Hecho cuando: `SessionMessage.tsx` y la pantalla `index.tsx` presentan mensajes informativos (fase concluida en ausencia, inactividad > 24 h) y advertencias (reloj alterado, permisos) respetando la paleta y contraste de `cotopaxi-brand`, manteniendo la separación estricta de capas; `npx jest` y `npx tsc --noEmit` pasan.

- [ ] **T7. Verificación integral en dispositivo móvil/APK y cierre de la historia.** RF-001 a RF-013, RNF-001 a RNF-005
  - Hecho cuando: `npx jest`, `npx tsc --noEmit` y `npx expo lint` pasan; en dispositivo/APK se verifican los escenarios de bloqueo, cierre desde recientes, fin de fase con app cerrada (aviso sonoro/vibración y mensaje al abrir), pausa previa sin avisos, cancelación precisa, reloj retrasado, inactividad > 24 h y limpieza de bandeja; `MEMORY.md` contiene solo Estado actual y Próximos pasos actualizados.


================================================
ðŸ“„ ARCHIVO: specs\004-recibir-aviso\decisiones.md
================================================

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


================================================
ðŸ“„ ARCHIVO: specs\004-recibir-aviso\plan.md
================================================

# Plan de implementación — Spec 004: Recibir aviso al terminar el tiempo

> La spec está aprobada y cubre RF-001 a RF-012 y RNF-001 a RNF-005. Este plan implementa
> el canal de alarma nativo en Android (audible en silencio), el patrón de vibración rítmico,
> la detención inmediata desde la notificación («Detener» y toque en cuerpo) y desde la interfaz
> mediante un modal prominente, el corte automático de seguridad a los 60 segundos, y el flujo
> de permisos sin fricción (modal previo, banner no bloqueante y enlace a ajustes). No se requieren
> dependencias externas adicionales.

---

## Decisiones técnicas y de diseño resueltas

- **Decisión 1:** Mostrar un modal explicativo con la paleta de la Academia Cotopaxi antes de invocar la solicitud de permisos del sistema; si el estudiante lo rechaza, permitir iniciar el temporizador de todos modos con un banner visible de advertencia no bloqueante informando que no recibirá avisos fuera de la app.
- **Decisión 2:** Reproducir el sonido y la vibración en bucle continuo de alarma hasta que el estudiante la detenga de forma explícita, o hasta alcanzar el límite de seguridad de 60 segundos tras el cual cesa automáticamente.
- **Decisión 3:** Mostrar en primer plano una pantalla/modal superpuesto prominente («¡Fase finalizada!») con un botón de gran tamaño («Detener aviso») que silencia la alarma y deja visible la siguiente fase preparada y detenida.
- **Decisión 4:** Configurar en `expo-notifications` una categoría interactiva con el botón de acción «Detener» para silenciar la alarma directamente desde la pantalla de bloqueo sin abrir la app; y si se toca el cuerpo de la notificación, silenciarla inmediatamente, abrir la app y mostrar la siguiente fase preparada.
- **Decisión 5:** Configurar el canal de notificación de Android con `importance: AndroidImportance.MAX`, `usage: AndroidAudioUsage.ALARM`, `contentType: AndroidAudioContentType.SONIFICATION` y visibilidad pública en pantalla de bloqueo, permitiendo que el sistema emita la alarma en modo silencio o vibración sin librerías externas.
- **Decisión 6:** Títulos y cuerpos motivadores y diferenciados según la fase concluida:
  - Fin de estudio: *«¡Estudio terminado!»* — *«Bien hecho. Listo para descanso corto (5 min)»* o *(15 min)* si completó el ciclo.
  - Fin de descanso: *«¡Descanso terminado!»* — *«Tiempo de concentrarse en la siguiente sesión de estudio»*.
- **Decisión 7:** Si el permiso fue denegado en el sistema e impide solicitudes directas, ofrecer en el mensaje de advertencia un botón «Abrir ajustes» (`Linking.openSettings()`) y la opción de «Continuar sin avisos».
- **Decisión 8:** Patrón de vibración rítmico tipo alarma `[0, 500, 250, 500, 250, 500]` gestionado con `Vibration` de React Native y cancelación inmediata (`Vibration.cancel()`), con manejo tolerante en dispositivos sin motor de vibración.

---

## Archivos y responsabilidades

### Capa 1 — Lógica de negocio (sin componentes de UI ni colores)

- `src/types/pomodoro.ts`:
  - Extender tipos para incluir el estado de la alarma en la sesión o contexto (`isAlarmActive: boolean`, `alarmPhase?: PomodoroPhase`).
  - Contratos de contenido de notificaciones y acciones (`NotificationContent`, `AlarmActionType`).
- `src/utils/alarmMessages.ts` y `src/utils/alarmMessages.test.ts`:
  - Funciones puras para generar los textos exactos de notificación y modales según la fase terminada, la fase siguiente y su duración en minutos.
  - Función pura de verificación de límite de 60 segundos de alarma (`isAlarmExpired(startedTimestamp, currentTimestamp)`).
- `src/services/notificationService.ts` y `src/services/notificationService.test.ts`:
  - Configurar canal de alarma en Android con `AndroidImportance.MAX`, `usage: AndroidAudioUsage.ALARM` y patrón de vibración `[0, 500, 250, 500, 250, 500]`.
  - Configurar categoría de notificación interactiva `ALARM_CATEGORY` con botón de acción `Detener` (`opensAppToForeground: false`).
  - Registrar listener de respuesta a notificaciones (`addNotificationResponseReceivedListener`) para capturar la acción `Detener` o el toque en el cuerpo.
  - Control de vibración con React Native `Vibration` (`vibrate` rítmico continuo y `cancel`), tolerante ante plataformas sin vibrador.
  - Reprogramación con los textos específicos definidos en la Decisión 6.
- `src/context/StudySessionContext.tsx` y `src/context/StudySessionContext.test.tsx`:
  - Gestionar el estado de alarma activa (`isAlarmActive`, `alarmPhase`).
  - Desencadenar el temporizador de corte automático a los 60 segundos para silenciar la alarma desatendida.
  - Integrar listener de notificaciones para silenciar la alarma cuando el usuario presiona «Detener» en la notificación o toca su cuerpo.
  - Exponer método `stopAlarm()` que detiene el sonido, cancela la vibración, oculta el modal y asegura que la siguiente fase quede lista y detenida.
  - Gestionar el flujo de permisos: `permissionModalVisible`, `requestPermission()`, `dismissPermissionModal()`, advertencia de permisos denegados con acción `openSettings()`.

### Capa 2 — Diseño e interfaz (sin llamadas a storage ni cálculos de timestamps)

- `src/constants/theme.ts`:
  - Paleta institucional sobre fondo blanco: botones de acción en `navyBrand`, botón «Detener aviso» con alta visibilidad y contraste accesible (WCAG ≥ 4.5:1), y tokens de espaciado/radio.
- `src/components/AlarmActiveModal.tsx` y `src/components/AlarmActiveModal.test.tsx`:
  - Modal superpuesto prominente («¡Fase finalizada!») accesible con una sola mano.
  - Botón grande «Detener aviso» con `accessibilityLabel="Detener aviso de fin de fase"`.
  - Muestra texto claro de la fase que terminó y la siguiente fase preparada.
- `src/components/NotificationPermissionModal.tsx` y `src/components/NotificationPermissionModal.test.tsx`:
  - Modal explicativo con identidad Academia Cotopaxi previo a la solicitud del sistema.
  - Botón primario «Permitir avisos» y botón secundario «Continuar sin avisos».
- `src/components/SessionMessage.tsx`:
  - Extender para soportar botón de acción «Abrir ajustes» en la advertencia de permisos denegados.
- `src/app/index.tsx`:
  - Montar los componentes modales conectados al contexto.
  - Garantizar que la siguiente fase se visualice preparada y detenida tras silenciar la alarma.

---

## Organización por capa

### Capa 1: Lógica de negocio
1. Las funciones en `src/utils/alarmMessages.ts` son puras y formulan los textos en español sin dependencias de React ni Expo.
2. `src/services/notificationService.ts` encapsula las llamadas nativas a `expo-notifications`, `Vibration` y `Linking`.
3. `src/context/StudySessionContext.tsx` coordina la máquina de estados del temporizador con el estado de alarma y el ciclo de permisos.

### Capa 2: Diseño e interfaz
1. Los modales `AlarmActiveModal` y `NotificationPermissionModal` son componentes puramente presentacionales que reciben estado y callbacks (`onStop`, `onConfirm`, `onCancel`) vía `props`.
2. Toda la presentación cumple la paleta de la Academia Cotopaxi y estándares de contraste WCAG ≥ 4.5:1.
3. No se realizan llamadas a servicios nativos desde componentes o pantallas.

---

## Algoritmo en pseudocódigo

### Activación de alarma al llegar a cero o detectar fase vencida

```text
funcion activarAlarma(faseTerminada, siguienteFase, duracionSiguienteMinutos):
  contenido = generarTextosAviso(faseTerminada, siguienteFase, duracionSiguienteMinutos)
  iniciarVibracionRitmica([0, 500, 250, 500, 250, 500])
  estadoAlarma.activa = verdadero
  estadoAlarma.marcaInicio = ahora()

  // Límite de seguridad de 60 segundos
  programarCorteAutomatico(60000, funcion():
    si estadoAlarma.activa:
      silenciarAlarma()
  )

funcion silenciarAlarma():
  detenerVibracion()
  descartarNotificacionesDeBandeja()
  estadoAlarma.activa = falso
  estadoAlarma.marcaInicio = nulo
```

### Respuesta a eventos de notificación interactiva

```text
alRecibirRespuestaNotificacion(respuesta):
  si respuesta.actionIdentifier == "DETENER_AVISO":
    silenciarAlarma()
  si no (toque en el cuerpo de la notificación):
    silenciarAlarma()
    traerAppAlPrimerPlano()
```

### Solicitud de permiso con modal explicativo

```text
alIniciarTemporizadorPorPrimeraVez():
  si no tienePermisoNotificaciones y no seHaPreguntadoAntes:
    mostrarModalExplicativoPermisos()
    retornar

alConfirmarModalExplicativo():
  ocultarModalExplicativo()
  resultado = solicitarPermisoSistema()
  si resultado == "concedido":
    guardarPreferenciaPermiso(verdadero)
    iniciarSesion()
  si no:
    guardarPreferenciaPermiso(falso)
    mostrarAdvertenciaNoBloqueante("No recibirás avisos fuera de la app.")
    iniciarSesion()
```

---

## Datos del estudiante y acciones destructivas

- **Persistencia y privacidad:** No se almacenan cuentas, credenciales ni información privada. Solo se persiste localmente si el estudiante decidió continuar sin avisos para evitar mostrar el modal explicativo en cada inicio.
- **Acciones destructivas:** Silenciar la alarma no destruye la sesión ni reinicia el contador: mantiene intacto el conteo de pomodoros acumulados y deja lista la siguiente fase preparada y detenida.
- **Seguridad del dispositivo:** El temporizador de seguridad de 60 segundos previene el sobrecalentamiento del vibrador y el agotamiento de la batería ante alarmas no atendidas.

---

## Decisiones técnicas y alternativas descartadas

1. **Canal de alarma nativo en Android vs. librería de sonido `expo-av`:**
   - *Adoptada (Decisión 5):* Uso de canal de notificación con `AndroidAudioUsage.ALARM`. No añade paquetes pesados externos y funciona en modo silencio de manera estándar.
   - *Descartada:* Instalar `expo-av`, que requeriría assets de audio locales adicionales y gestión compleja del foco de audio en segundo plano.
2. **Acción «Detener» en la notificación interactiva:**
   - *Adoptada (Decisión 4):* `setNotificationCategoryAsync` con acción interactiva. Permite detener la alarma desde la pantalla de bloqueo sin abrir la app.
   - *Descartada:* Obligar al estudiante a desbloquear el teléfono y abrir la app para silenciar el aviso.
3. **Modal prominente vs. botón ordinario en pantalla:**
   - *Adoptada (Decisión 3):* Modal superpuesto con botón gigante «Detener aviso». Evita toques erróneos en «Reiniciar» o «Ajustes» mientras suena la alarma.
   - *Descartada:* Cambiar simplemente el botón de Iniciar por Detener en la botonera principal.
4. **Corte automático a los 60 segundos:**
   - *Adoptada (Decisión 2):* Silenciamiento automático tras 60 segundos.
   - *Descartada:* Vibración infinita hasta agotar batería o sonido puntual de 2 segundos que pasa desapercibido.
5. **Modal explicativo previo no bloqueante vs. alerta directa del sistema:**
   - *Adoptada (Decisión 1 y 7):* Explicación previa institucional Cotopaxi con opción de continuar sin avisos y botón a ajustes si se denegó. Cero fricción (Constitución #1).
   - *Descartada:* Bloquear el inicio del temporizador si el usuario rechaza las notificaciones.

---

## Estrategia de pruebas

### Pruebas unitarias automatizadas con Jest (`npx jest`)

- `alarmMessages.test.ts`:
  - Textos de notificación para fin de estudio con descanso corto (5 min).
  - Textos de notificación para fin de estudio con descanso largo (15 min) al completar el objetivo.
  - Textos de notificación para fin de descanso corto y descanso largo.
  - Verificación del cálculo de expiración de 60 segundos.
- `notificationService.test.ts`:
  - Configuración del canal con `AndroidAudioUsage.ALARM` y prioridad máxima.
  - Registro de categoría con acción «Detener».
  - Invocación de `Vibration.vibrate` con patrón rítmico y `Vibration.cancel`.
  - Tolerancia cuando `Vibration` no está disponible o falla.
  - Despacho de listeners de respuesta a notificación.
- `StudySessionContext.test.tsx`:
  - Activación de alarma (`isAlarmActive: true`) al completarse la fase.
  - Detención de alarma con `stopAlarm()`, silenciando vibración y dejando siguiente fase preparada.
  - Corte automático de alarma tras 60 segundos.
  - Detención mediante acción remota de notificación («Detener»).
  - Flujo de solicitud y rechazo de permisos con advertencia no bloqueante.
- `AlarmActiveModal.test.tsx` y `NotificationPermissionModal.test.tsx`:
  - Renderizado correcto de textos, botones y disparo de callbacks `onStop`, `onConfirm`, `onCancel`.

### Verificación manual en dispositivo móvil / APK

- Dejar que el temporizador llegue a cero con el teléfono en modo silencio: verificar que emite sonido de alarma y vibración rítmica perceptible.
- Verificar que la notificación en pantalla de bloqueo incluye el botón «Detener» y que al presionarlo se silencia la alarma sin abrir la app.
- Tocar el cuerpo de la notificación: verificar que silencia la alarma, abre la app y muestra la siguiente fase preparada.
- Abrir la app mientras suena la alarma: verificar la aparición del modal prominente y que el botón «Detener aviso» silencia el aviso al instante.
- Dejar el aviso sonar sin tocar el teléfono: verificar que se silencia solo a los 60 segundos exactos.
- Probar primera ejecución: verificar modal explicativo institucional antes del diálogo del sistema.
- Denegar permisos: verificar que el temporizador inicia con advertencia visible y que el botón «Abrir ajustes» redirige a la configuración de la app.

---

## Cobertura de requisitos

- **RF-001:** `NotificationPermissionModal`, `StudySessionContext`.
- **RF-002:** `StudySessionContext`, `SessionMessage` (advertencia visible no bloqueante).
- **RF-003:** `SessionMessage` con enlace a ajustes vía `Linking.openSettings()`.
- **RF-004:** `notificationService.ts` (canal sonoro y vibración rítmica), `alarmMessages.ts`.
- **RF-005:** `notificationService.ts` (`AndroidAudioUsage.ALARM`, visibilidad pública en lockscreen).
- **RF-006:** `alarmMessages.ts` (textos diferenciados para estudio y descanso).
- **RF-007:** `StudySessionContext` (temporizador de seguridad de 60 segundos).
- **RF-008 y RF-009:** `AlarmActiveModal.tsx`, `StudySessionContext` (`stopAlarm`).
- **RF-010 y RF-011:** `notificationService.ts` (categoría interactiva con acción «Detener» y listener de respuesta).
- **RF-012:** `notificationService.ts` (envoltorio seguro de `Vibration`).
- **RNF-001 a RNF-005:** Operación 100% offline, latencia < 100 ms al detener, ahorro de batería con corte a 60s, sin datos sensibles.

---

## Criterio de salida de la planificación

Se formulan 7 tareas de implementación ordenadas por dependencias, cada una acotada a un tiempo máximo estimado de 20 a 30 minutos. No se requiere dividir la spec.


================================================
ðŸ“„ ARCHIVO: specs\004-recibir-aviso\spec.md
================================================

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


================================================
ðŸ“„ ARCHIVO: specs\004-recibir-aviso\tasks.md
================================================

# Tareas de implementación — Spec 004: Recibir aviso al terminar el tiempo

> Ordenadas por dependencia. Las tareas de Capa 1 comienzan por pruebas y no
> avanzan con Jest o TypeScript en rojo. La configuración del canal de alarma
> nativo y el límite de corte de 60 segundos están aprobados en las Decisiones 2 y 5.

- [x] **T1. Contratos y utilidades puras de contenidos de aviso y cálculo de corte con pruebas primero.** RF-004, RF-005, RF-006, RF-007, RF-012
  - Hecho cuando: las pruebas unitarias escritas antes del código en `alarmMessages.test.ts` verifican los textos de fin de estudio (con descanso corto de 5 min o largo de 15 min), fin de descanso (motivando el estudio) y la función de cálculo de expiración de 60 segundos; `npx jest` y `npx tsc --noEmit` pasan sin errores.

- [x] **T2. Servicio nativo de avisos con canal de alarma, categoría «Detener» y vibración rítmica con pruebas primero.** RF-001, RF-003, RF-004, RF-005, RF-008, RF-010, RF-012, RNF-002, RNF-003
  - Hecho cuando: `notificationService.ts` configura el canal de Android con `usage: ALARM`, registra la categoría con acción interactiva «Detener», controla la vibración rítmica de alarma y su cancelación segura ante falta de hardware, y sus pruebas en `notificationService.test.ts` pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T3. Orquestar el estado de alarma, temporizador de 60s y acciones de detención en el contexto con pruebas primero.** RF-004 a RF-011, RNF-003, RNF-004
  - Hecho cuando: `StudySessionContext.tsx` activa el estado de alarma y vibración al terminar una fase, silencia la alarma con `stopAlarm()`, procesa el corte automático tras 60 segundos, responde a la acción «Detener» y toque de la notificación, y deja la siguiente fase preparada; las pruebas en `StudySessionContext.test.tsx` pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T4. Flujo de permisos previo y manejo de rechazo/ajustes en el contexto con pruebas primero.** RF-001, RF-002, RF-003
  - Hecho cuando: `StudySessionContext.tsx` controla la presentación del modal explicativo de permisos en el primer inicio, permite continuar sin avisos si se deniega mostrando una advertencia visible no bloqueante, y expone la acción para abrir los ajustes del teléfono (`Linking.openSettings()`); las pruebas unitarias pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T5. Crear el componente modal prominente «¡Fase finalizada!» y botón «Detener aviso».** RF-008, RF-009
  - Hecho cuando: `AlarmActiveModal.tsx` se muestra superpuesto cuando la alarma está activa, presenta la fase completada, ofrece un botón prominente «Detener aviso» con diseño accesible y paleta Cotopaxi, e invoca el callback para silenciar; `AlarmActiveModal.test.tsx` pasa con `npx jest` y `npx tsc --noEmit`.

- [x] **T6. Crear el modal explicativo de permisos y banner de advertencia no bloqueante.** RF-001, RF-002, RF-003
  - Hecho cuando: `NotificationPermissionModal.tsx` presenta la explicación institucional previa con botones para permitir o continuar sin avisos, y `SessionMessage.tsx` incluye el enlace «Abrir ajustes» en caso de denegación; sus pruebas unitarias pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T7. Integrar en pantalla principal, validar en dispositivo/APK y cierre de la historia.** RF-001 a RF-012, RNF-001 a RNF-005
  - Hecho cuando: `index.tsx` conecta los modales de alarma y permisos con el contexto; pasan `npx jest`, `npx tsc --noEmit` y `npx expo lint`; se comprueba en dispositivo/APK el sonido en silencio, vibración rítmica, botón «Detener» en la notificación, modal en primer plano, corte a 60 segundos y flujo de permisos; `MEMORY.md` contiene solo Estado actual y Próximos pasos actualizados.


================================================
ðŸ“„ ARCHIVO: specs\005-tiempos-pomodoro\decisiones.md
================================================

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


================================================
ðŸ“„ ARCHIVO: specs\005-tiempos-pomodoro\plan.md
================================================

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


================================================
ðŸ“„ ARCHIVO: specs\005-tiempos-pomodoro\spec.md
================================================

# Spec 005 — Ajustar los tiempos del pomodoro

Estado: aprobado
HU de origen: docs/historias/HU-005.md

## Contexto y objetivo

El estudiante necesita personalizar la duración de los bloques de estudio, descanso corto y descanso largo, así como la cantidad de pomodoros necesarios para alcanzar un descanso mayor, adaptando la técnica Pomodoro a su propio ritmo de concentración. Esta configuración debe ser accesible en todo momento, validar de forma inmediata los valores ingresados para evitar tiempos contraproducentes, conservar las preferencias de forma persistente y asegurar que cualquier cambio respete las fases en curso sin alterar injustificadamente el conteo activo.

## Usuarios

- Estudiante de la Academia Cotopaxi.

## Historias de usuario

Como estudiante, quiero cambiar la duración del estudio, de los descansos y la cantidad de pomodoros antes del descanso largo, para adaptar la técnica a mi ritmo.

## Definiciones

- **Fase en reposo:** estado en el que el temporizador no se encuentra iniciado ni corriendo, mostrando la duración nominal completa lista para comenzar.
- **Fase en curso:** fase activa en cuenta regresiva.
- **Fase pausada:** fase iniciada cuya cuenta regresiva fue detenida voluntariamente y conserva un tiempo restante pendiente.
- **Ciclo Pomodoro:** secuencia alternada de sesiones de estudio y descansos cortos que culmina en un descanso largo tras alcanzar la meta de pomodoros configurada.
- **Valores por defecto:** combinación estándar predeterminada de 25 minutos de estudio, 5 minutos de descanso corto, 15 minutos de descanso largo y 4 pomodoros por ciclo.

## Requisitos funcionales

- **RF-001:** CUANDO el estudiante active el control de ajustes desde la pantalla principal, EL SISTEMA mostrará la pantalla de configuración de tiempos y ciclo independientemente de si el temporizador se encuentra en reposo, en curso o pausado.
  **Origen:** Decisión 3 de `decisiones.md`.

- **RF-002:** EL SISTEMA admitirá como valores válidos de configuración únicamente números enteros positivos dentro de los siguientes límites:
  - Duración de estudio: entre 25 y 90 minutos.
  - Descanso corto: entre 5 y 20 minutos.
  - Descanso largo: entre 15 y 30 minutos.
  - Pomodoros por ciclo: entre 2 y 8 pomodoros.
  **Origen:** Decisiones 1 y 2 de `decisiones.md`.

- **RF-003:** SI el estudiante ingresa un valor fuera del rango permitido, un carácter no numérico, un número no entero, cero o deja un campo vacío, ENTONCES EL SISTEMA mostrará un mensaje de error en línea debajo del campo indicando los valores permitidos, resaltará visualmente el campo afectado e impedirá guardar los cambios.
  **Origen:** Escenario «Ingresar un valor no válido» de HU-005 y Decisión 5 de `decisiones.md`.

- **RF-004:** CUANDO el estudiante presione el botón de guardar y todos los campos contengan valores válidos, EL SISTEMA guardará los ajustes, presentará un mensaje visible de éxito y volverá a la pantalla principal.
  **Origen:** Escenario «Cambiar un tiempo» de HU-005 y Decisión 4 de `decisiones.md`.

- **RF-005:** EL SISTEMA mantendrá las duraciones y el objetivo de ciclo configurados por el estudiante de forma persistente entre sesiones y cierres de la aplicación.
  **Origen:** Escenario «Cambiar un tiempo» de HU-005 y principios 1 y 7 de `docs/constitution.md`.

- **RF-006:** CUANDO el estudiante guarde nuevas duraciones mientras el temporizador se encuentre en reposo, EL SISTEMA actualizará de inmediato el tiempo visible en la pantalla principal con el nuevo valor correspondiente a la fase inicial.
  **Origen:** Decisión 7 de `decisiones.md`.

- **RF-007:** CUANDO el estudiante guarde nuevas duraciones mientras una fase se encuentre en curso o pausada, EL SISTEMA mantendrá la duración inicial y el conteo de la fase activa con los valores con que inició, aplicando los nuevos tiempos a partir de la siguiente fase o al reiniciar el temporizador.
  **Origen:** Escenario «Cambiar un tiempo con una fase en curso» de HU-005 y Decisión 7 de `decisiones.md`.

- **RF-008:** CUANDO el estudiante solicite volver a los valores por defecto, EL SISTEMA presentará un diálogo de confirmación explícita advirtiendo que los valores regresarán a 25 minutos de estudio, 5 de descanso corto, 15 de descanso largo y 4 pomodoros por ciclo, requiriendo confirmación antes de proceder.
  **Origen:** Escenario «Volver a los valores por defecto» de HU-005, Decisión 6 de `decisiones.md` y principio 7 de `docs/constitution.md`.

- **RF-009:** CUANDO el estudiante confirme el restablecimiento de los valores por defecto en el diálogo de confirmación, EL SISTEMA asignará los valores estándar (25/5/15/4), guardará los cambios y mostrará una confirmación visual.
  **Origen:** Escenario «Volver a los valores por defecto» de HU-005 y Decisión 6 de `decisiones.md`.

- **RF-010:** CUANDO el estudiante cancele el diálogo de confirmación de restablecimiento, EL SISTEMA cerrará el diálogo sin modificar los valores en pantalla ni alterar los ajustes guardados.
  **Origen:** Decisión 6 de `decisiones.md` y principio 7 de `docs/constitution.md`.

- **RF-011:** SI el SISTEMA detecta datos de ajustes ausentes, incompletos o dañados al iniciar o consultar la configuración, ENTONCES EL SISTEMA recuperará de manera segura los valores por defecto (25/5/15/4) permitiendo la continuidad de uso del temporizador sin interrupciones.
  **Origen:** Decisión 8 de `decisiones.md` y principio 7 de `docs/constitution.md`.

## Requisitos no funcionales

- **RNF-001:** La configuración y validación de tiempos funcionará 100% de manera local y fuera de línea, sin conexión a internet ni cuentas de usuario.
- **RNF-002:** La persistencia de los ajustes personalizados no alterará ni modificará los datos de la sesión activa en curso.
- **RNF-003:** La validación de los campos en el formulario responderá de forma instantánea al escribir o modificar valores para brindar retroalimentación inmediata.
- **RNF-004:** La acción de restablecer a valores por defecto protegerá al estudiante frente a pulsaciones accidentales mediante confirmación explícita obligatoria.
- **RNF-005:** No se recopilarán, enviarán ni registrarán datos personales del estudiante al gestionar sus ajustes.

## Casos límite

- **Campo vacío al intentar guardar:** El sistema destaca el campo con mensaje de error e inhabilita el guardado.
- **Entrada de números decimales, símbolos o texto:** El sistema rechaza o invalida la entrada no entera positiva, mostrando el rango permitido en minutos enteros.
- **Valores en el borde exacto del rango permitido:** El sistema acepta valores límite válidos (ej. 25 y 90 para estudio, 5 y 20 para descanso corto, 15 y 30 para descanso largo, 2 y 8 para pomodoros) y rechaza cualquier valor fuera de ellos (ej. 24, 91, 4, 21, 14, 31, 1, 9).
- **Ajuste guardado durante una fase de descanso en curso:** La fase de descanso concluye con el tiempo original con el que empezó; la sesión de estudio posterior arrancará con el nuevo tiempo guardado.
- **Navegación hacia atrás sin guardar:** Los cambios editados en el formulario que no hayan sido guardados deliberadamente se descartan, manteniéndose los últimos valores confirmados.
- **Confirmación de restablecimiento durante una sesión en curso:** Si el estudiante confirma restablecer a 25/5/15/4 con un temporizador corriendo, la fase activa continúa inalterada y los valores por defecto rigen a partir de la siguiente fase o al reiniciar.

## Fuera de alcance

- Configurar fracciones de minuto o duraciones medidas en segundos.
- Crear perfiles múltiples de temporizadores guardados con etiquetas personalizadas.
- Alterar en tiempo real el tiempo ya transcurrido o restante de una fase en cuenta regresiva activa.
- Sincronización en la nube o multidispositivo de los ajustes de configuración.

## Criterios de finalización

- Todos los escenarios de HU-005 cuentan con requisitos funcionales explícitos en sintaxis EARS con origen trazado.
- Las ocho decisiones acordadas en `decisiones.md` se encuentran formalmente integradas.
- Se definen claramente los rangos numéricos admitidos y los mensajes de error en línea.
- Se distingue con precisión el impacto de los cambios entre estado en reposo y sesión activa (en curso o en pausa).
- La acción destructiva de restablecimiento a valores por defecto exige confirmación explícita según la Constitución.
- La spec está expresada en términos del QUÉ y POR QUÉ funcional observable, sin referencias a arquitectura, código ni nombres de archivos.

## Dudas abiertas

Ninguna.

## Revisión final de la spec

1. **Consistencia interna:** Los requisitos RF-001 a RF-011 son coherentes; en particular, RF-006 y RF-007 coordinan de forma armónica el comportamiento en reposo versus fase activa sin contradicciones.
2. **Cobertura de la HU:** Los cuatro escenarios de [HU-005.md](../../docs/historias/HU-005.md) («Cambiar un tiempo», «Ingresar un valor no válido», «Volver a los valores por defecto» y «Cambiar un tiempo con una fase en curso») quedan cubiertos en su totalidad por los RFs.
3. **Alineación con la constitución:** Se respetan los principios de simplicidad y cero fricción (Principio 1), la conservación sagrada de los datos y tiempos del estudiante (Principio 7) y la exigencia innegociable de confirmación explícita para acciones destructivas como restablecer valores por defecto (Principio 7).
4. **Delimitación estricta de alcance:** La especificación no incluye referencias a AsyncStorage, nombres de archivos de código ni detalles de implementación técnica.


================================================
ðŸ“„ ARCHIVO: specs\005-tiempos-pomodoro\tasks.md
================================================

# Tareas de implementación — Spec 005: Ajustar los tiempos del pomodoro

> Ordenadas por dependencia. Las tareas de Capa 1 comienzan por pruebas y no
> avanzan con Jest o TypeScript en rojo. La configuración de rangos y el esquema
> persistente en `@pomodoro_settings` están aprobados en las Decisiones 1, 2 y 8.

- [x] **T1. Contratos y funciones puras de validación de ajustes con pruebas primero.** RF-002, RF-003
  - Hecho cuando: `PomodoroSettings` está definido en `src/types/pomodoro.ts` y las pruebas unitarias en `cycleSettings.test.ts` verifican los rangos pedagógicos de HU-005 (estudio 25–90 min, descanso corto 5–20 min, descanso largo 15–30 min, ciclo 2–8 pomodoros) con rechazo de vacíos, decimales, negativos y valores fuera de rango; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T2. Persistencia local de ajustes y tolerancia a fallos con pruebas primero.** RF-005, RF-011, RNF-001, RNF-002
  - Hecho cuando: `settingsStorage.ts` persiste y lee en `@pomodoro_settings`, recupera de forma segura los valores por defecto (25/5/15/4) si la clave no existe o está corrupta, y sus pruebas en `settingsStorage.test.ts` pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T3. Proveedor de contexto de ajustes y orquestación con la sesión activa con pruebas primero.** RF-004, RF-005, RF-006, RF-007, RF-009, RF-011
  - Hecho cuando: `SettingsContext.tsx` orquesta la persistencia de ajustes y su sincronización con `StudySessionContext`, actualizando de inmediato la duración nominal visible en reposo y preservando intacta la sesión en curso o pausada; las pruebas unitarias pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T4. Componente de formulario de ajustes con validación reactiva en línea.** RF-002, RF-003, RF-004, RNF-003
  - Hecho cuando: `SettingsForm.tsx` presenta los 4 campos numéricos con teclado `number-pad`, valida instantáneamente al escribir mostrando mensajes de error en línea bajo los campos inválidos, resalta los inputs con error y habilita el botón «Guardar» únicamente si todos los campos son válidos; sus pruebas unitarias pasan con `npx jest` y `npx tsc --noEmit`.


- [x] **T5. Componente modal de confirmación para restablecer valores por defecto.** RF-008, RF-009, RF-010, RNF-004
  - Hecho cuando: `ResetSettingsModal.tsx` solicita confirmación explícita con diseño institucional Cotopaxi antes de restablecer a 25/5/15/4, ejecuta la confirmación mediante botón destructivo y cierra sin alterar valores al cancelar; sus pruebas unitarias pasan con `npx jest` y `npx tsc --noEmit`.


- [x] **T6. Pantalla de ajustes `/settings` y botón de navegación en la cabecera principal.** RF-001, RF-004
  - Hecho cuando: `src/app/settings.tsx` integra el formulario y el modal con `KeyboardAvoidingView` y retorno automático tras guardar, y `src/app/index.tsx` incluye el botón de ajustes (engranaje) en la cabecera accesible en reposo, en curso y en pausa; `npx jest` y `npx tsc --noEmit` pasan sin errores.


- [x] **T7. Verificación integral en dispositivo móvil/APK y cierre de la historia.** RF-001 a RF-011, RNF-001 a RNF-005
  - Hecho cuando: pasan `npx jest`, `npx tsc --noEmit` y `npx expo lint`; se comprueba en dispositivo/APK la navegación desde la cabecera, la validación en línea de rangos inválidos, el guardado y actualización inmediata en reposo, la conservación de fase activa al guardar en curso/pausa, el modal de restablecimiento y la persistencia tras reiniciar la app; `MEMORY.md` queda actualizado en solo "Estado actual" y "Próximos pasos".



================================================
ðŸ“„ ARCHIVO: specs\006-offline\decisiones.md
================================================

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


================================================
ðŸ“„ ARCHIVO: specs\006-offline\plan.md
================================================

# Plan de implementación — Spec 006: Usar la aplicación sin registro, sin internet y sin publicidad

> La spec está aprobada y cubre RF-001 a RF-009 y RNF-001 a RNF-005. Este plan implementa
> y valida el funcionamiento 100% offline y autónomo de la aplicación: apertura directa
> sin registro ni tutoriales a 25:00 minutos, ausencia total de anuncios y tráfico de red,
> degradación suave con vibración ante fallos de audio, tolerancia a fallos de persistencia
> manteniendo el estado en memoria con avisos visuales no bloqueantes, solicitud no intrusiva
> de permisos de notificación sin bloqueos ante rechazo, y restauración offline exacta mediante
> marcas de tiempo locales. No se requieren dependencias externas adicionales.

---

## Decisiones técnicas y de diseño resueltas

- **Decisión 1:** Apertura directa del temporizador en reposo a 25:00 minutos en el primer inicio tras la instalación, sin pantallas de bienvenida, modales introductorios ni tutoriales que demoren el estudio.
- **Decisión 2:** Comportamiento completamente transparente con o sin conexión a internet: ningún banner, icono, etiqueta ni diálogo alertando sobre el estado de conectividad.
- **Decisión 3:** Recursos multimedia (fuentes, iconos, sonidos) 100% empaquetados localmente; si la reproducción de audio falla o el canal no está disponible, emitir vibración como mecanismo de respaldo sin interrumpir la sesión ni emitir errores fatales.
- **Decisión 4:** Ante fallos de lectura o escritura en el almacenamiento local (`AsyncStorage`), mantener la sesión y los ajustes en memoria durante la sesión activa, mostrando una advertencia visual no bloqueante al estudiante indicando que los cambios no persistirán al cerrar la aplicación.
- **Decisión 5:** Cero tráfico de red y cero dependencias de analítica o publicidad: ningún SDK externo de rastreo, enlaces web externos ni banners comerciales en ninguna pantalla.
- **Decisión 6:** Solicitud de permisos de notificaciones locales de forma no intrusiva al iniciar la primera sesión; si el estudiante los rechaza, la aplicación continúa operando con normalidad emitiendo avisos en primer plano (sonido/vibración) sin bloquear ni insistir de forma recurrente.
- **Decisión 7:** Restauración automática de la sesión al reabrir la app calculando el tiempo transcurrido estrictamente mediante marcas de tiempo locales (`Date.now()`); si la fase concluyó mientras la app estaba cerrada o suspendida, presentar de inmediato el estado de finalización y el avance según el ciclo Pomodoro.
- **Decisión 8:** Alcance estricto de persistencia local limitado a `@pomodoro_settings` y `pomodoro.activeSession`; cero identificadores de dispositivo, perfiles personales o telemetría.

---

## Archivos y responsabilidades

### Capa 1 — Lógica de negocio (sin imports de React Native UI ni colores)

- `src/types/pomodoro.ts`:
  - Mantener los contratos de datos libres de identificadores de usuario o campos de red.
  - Asegurar tipado para avisos de almacenamiento no bloqueantes y estados de degradación en memoria.
- `src/utils/session.ts` y `src/utils/sessionRecovery.ts`:
  - Funciones puras que calculan tiempos restantes y recuperaciones mediante marcas de tiempo locales `Date.now()`, sin dependencias de red ni librerías externas (RF-009, Decisión 7).
  - Pruebas unitarias asegurando recuperación de fases completadas en ausencia sin requerir sincronización externa.
- `src/storage/sessionStorage.ts` y `src/storage/sessionStorage.test.ts`:
  - Persistencia de `pomodoro.activeSession`.
  - Tipado claro y aislamiento de excepciones de lectura/escritura (`StorageError`) para que la capa de contexto pueda capturarlas y degradar a memoria activa sin abortar la ejecución (RF-006, RF-007, Decisiones 4 y 8).
  - Pruebas unitarias simulando fallos de escritura (`AsyncStorage.setItem` arrojando error) y lectura corrupta.
- `src/storage/settingsStorage.ts` y `src/storage/settingsStorage.test.ts`:
  - Persistencia de `@pomodoro_settings`.
  - Manejo tolerante ante fallos de lectura recuperando valores por defecto y propagación controlada de errores de escritura para degradación a memoria en el contexto (RF-006, RF-007, Decisión 4).
  - Pruebas unitarias de almacenamiento seguro sin campos de rastreo.
- `src/services/notificationService.ts` y `src/services/notificationService.test.ts`:
  - Mecanismo seguro de aviso que combina canal de alarma y vibración rítmica (RF-003, RF-004, Decisiones 3 y 8).
  - Respaldo automático mediante `startAlarmVibration()` si la reproducción sonora no está disponible o falla, sin generar excepciones no capturadas.
  - Comprobación no intrusiva de permisos con `getNotificationPermissionStatus()` y solicitud condicionada (RF-008, Decisión 6).
  - Pruebas unitarias simulando rechazo de permisos y fallos de canales de audio con activación de vibración de respaldo.
- `src/context/SettingsContext.tsx` y `src/context/SettingsContext.test.tsx`:
  - Orquestación de ajustes con soporte de modo en memoria ante fallos de escritura en almacenamiento local (RF-007).
  - Si `saveSettingsToStorage` falla, conservar los ajustes en el estado de React, aplicarlos a la sesión y exponer una advertencia no bloqueante.
  - Pruebas unitarias simulando persistencia fallida y conservación exitosa en memoria.
- `src/context/StudySessionContext.tsx` y `src/context/StudySessionContext.test.tsx`:
  - Modificación de la función `commit`: si `saveStudySession` falla por error de disco o E/S, no revertir el estado de la sesión; en su lugar, actualizar el estado en memoria (`setSession(next)`), permitir que el temporizador continúe su curso y establecer un mensaje de advertencia no bloqueante (`warning: "No se pudieron guardar los cambios en el dispositivo. La sesión continuará en memoria mientras la app permanezca abierta."`) (RF-007, Decisión 4).
  - Manejo de permisos en `start`: si el usuario rechaza los permisos de notificación, marcar que ya fue atendido (`hasDismissedPermissionModal: true`), no volver a mostrar el modal en inicios posteriores y continuar la sesión con avisos en primer plano (RF-008, Decisión 6).
  - Tolerancia de audio en avisos: invocación protegida de sonido y vibración garantizando que si el audio falla, la vibración actúa de inmediato y la alarma visual se activa sin interrumpir la sesión (RF-004).
  - Restauración offline mediante `evaluateSessionRecovery` al montar y al cambiar a `AppState: "active"` (RF-009).
  - Pruebas unitarias exhaustivas para fallo de guardado en memoria, rechazo de permisos y recuperación sin red.

### Capa 2 — Diseño e interfaz (sin llamadas a storage ni cálculos de timestamps)

- `src/constants/theme.ts`:
  - Verificación de ausencia total de tokens o estilos asociados a banners publicitarios, anuncios o avisos de red externa.
- `src/components/SessionMessage.tsx` y `src/components/SessionMessage.test.tsx`:
  - Renderizado de mensajes de advertencia (`warning`) e informativos (`info`) con estilo accesible de la Academia Cotopaxi.
  - Despliegue no bloqueante del aviso de degradación a memoria ante fallos de almacenamiento (RF-007).
- `src/components/NotificationPermissionModal.tsx`:
  - Diálogo no intrusivo con botones claros «Activar avisos» y «Continuar sin avisos».
  - Al pulsar «Continuar sin avisos», descarta el diálogo sin bloquear el inicio del temporizador (RF-008).
- `src/app/index.tsx`:
  - Apertura inmediata en la pantalla del temporizador en reposo (25:00) en el primer montaje, sin pantallas de bienvenida, modales de inicio ni login (RF-001, Decisión 1).
  - Ausencia de indicadores de red, banners de conexión, enlaces externos o scripts publicitarios (RF-002, RF-005, Decisiones 2 y 5).
- `src/app/settings.tsx`:
  - Pantalla de ajustes 100% funcional sin conexión a internet, validación local pura y sin enlaces externos ni políticas en línea (RF-003, RF-005).

---

## Organización por capa

### Capa 1: Lógica de negocio
1. No importa componentes visuales de React Native (`View`, `Text`, `StyleSheet`) ni colores del tema.
2. La degradación a memoria ante errores de persistencia se resuelve en la capa de contexto (`StudySessionContext` y `SettingsContext`), manteniendo la sesión viva en React state sin truncar el ciclo.
3. El cálculo temporal y la recuperación tras cierre de app dependen enteramente de funciones puras en `src/utils/` evaluando marcas locales `Date.now()`.
4. El respaldo de vibración ante fallos de audio se encapsula en `src/services/notificationService.ts`.

### Capa 2: Diseño e interfaz
1. Componentes visuales puros (`StudyTimer`, `SessionMessage`, `StudyTimerControls`, `NotificationPermissionModal`) reciben estado y callbacks mediante `props`.
2. Las pantallas `index.tsx` y `settings.tsx` se limitan a orquestar los hooks de contexto y presentar los componentes sin lógica de timestamps ni acceso directo a disco.
3. No existen vistas de registro, login, tutoriales, banners de conectividad ni enlaces a sitios externos.

---

## Algoritmo en pseudocódigo

### Manejo de persistencia con degradación suave a memoria (RF-007, Decisión 4)

```text
funcion commitSesion(siguienteSesion):
  intento:
    ejecutar saveStudySession(siguienteSesion) en almacenamiento local
    actualizarEstadoSesion(siguienteSesion)
    limpiarAdvertenciaAlmacenamiento()
    retornar VERDADERO
  captura error:
    // Degradación suave: la sesión continúa en memoria
    actualizarEstadoSesion(siguienteSesion)
    establecerAdvertencia(
      "No se pudieron guardar los cambios en el dispositivo. La sesión continuará en memoria mientras la aplicación esté abierta."
    )
    retornar VERDADERO
```

### Gestión de avisos con respaldo de vibración ante degradación de audio (RF-004, Decisión 3)

```text
funcion dispararAvisoFinFase(faseActual):
  activarModalAlarmaVisual(faseActual)
  iniciarVibracionRespaldo()
  
  intento:
    reproducirSonidoAlarma()
  captura errorAudio:
    // Si el canal de audio o el altavoz fallan, la vibración ya está activa
    registrarFalloSilencioso("Audio no disponible, respaldo táctil activo")
```

### Inicio no intrusivo y gestión de permisos sin insistencia (RF-008, Decisión 6)

```text
funcion iniciarTemporizador():
  detenerAlarmaSiActiva()
  si estadoSesion == "running":
    retornar

  permiso = obtenerEstadoPermisoNotificaciones()
  si NO permiso.otorgado Y NO haDescartadoModalPermiso Y permiso.puedePreguntar:
    mostrarModalPermisoNotificacion(VERDADERO)
    retornar

  si NO permiso.otorgado:
    establecerAdvertencia("No recibirás avisos fuera de la app. Puedes activarlos en los ajustes.")
    ejecutarInicioEnMemoria(permitirNotificaciones = FALSO)
  si no:
    ejecutarInicioEnMemoria(permitirNotificaciones = VERDADERO)
```

### Restauración de sesión offline basada en marcas de tiempo locales (RF-009, Decisión 7)

```text
funcion alReabrirAppOVolverAPrimerPlano():
  tiempoActual = Date.now()
  recuperacion = evaluarRecuperacionSesion(sesionActual, tiempoActual, duracionesFase)
  
  si recuperacion.sesion != sesionActual:
    sesionActualizada = recuperacion.sesion
    commitSesion(sesionActualizada)

  si recuperacion.anomalia == "phaseCompletedInAbsence":
    establecerInformacion("La fase terminó mientras la app estaba cerrada.")
    dispararAvisoFinFase(recuperacion.faseFinalizada)
```

---

## Datos del estudiante y acciones destructivas

- **Datos persistidos estrictamente limitados (RF-006, Decisión 8):**
  - Ajustes de temporizador: clave `@pomodoro_settings` con 4 números enteros (`studyDurationMinutes`, `shortBreakMinutes`, `longBreakMinutes`, `cycleTarget`).
  - Sesión activa: clave `pomodoro.activeSession` con estado de fase, duración, marcas de tiempo relativas y conteo del ciclo.
  - Cero recopilación de nombres, identificadores de dispositivo, direcciones IP, credenciales o analítica de uso.
- **Acciones destructivas:**
  - Reinicio del temporizador solicita confirmación explícita mediante `RestartConfirmation` antes de descartar el conteo en curso.
  - Restablecimiento de ajustes solicita confirmación explícita mediante `ResetSettingsModal` antes de restaurar a 25/5/15/4.
- **Degradación ante fallos:**
  - Si el almacenamiento local falla, los datos continúan en memoria activa de React sin perder el progreso del estudiante durante su sesión.

---

## Decisiones técnicas y alternativas descartadas

1. **Degradación a memoria activa ante fallo de almacenamiento (Decisión 4):**
   - *Adoptada:* Si `AsyncStorage` arroja error de escritura (ej. almacenamiento lleno o error de permisos de disco), la sesión actualiza el estado en memoria de React y emite un mensaje no bloqueante. El estudiante no pierde su sesión de estudio en curso.
   - *Descartada:* Bloquear la aplicación con pantalla de error fatal o abortar la acción impidiendo continuar el temporizador.
2. **Cero indicadores de conectividad (Decisión 2):**
   - *Adoptada:* La aplicación opera sin ningún elemento gráfico referente a internet (sin textos "Modo offline" ni iconos de red).
   - *Descartada:* Mostrar un banner superior indicando "Sin conexión a internet". Esto introduciría ruido visual y distracción innecesaria, ya que la aplicación nunca requiere conexión.
3. **Respaldo de vibración ante fallos de audio (Decisión 3):**
   - *Adoptada:* Iniciar la vibración rítmica de alarma concurrentemente con la señal visual y sonora; si el canal de audio del sistema operativo o el altavoz se degradan, la vibración física asegura la recepción del aviso sin lanzar excepciones.
   - *Descartada:* Reintentar agresivamente la reproducción de audio en bucle bloqueante o lanzar un diálogo de error de sonido.
4. **Solicitud de permisos de notificación no intrusiva y sin repetición (Decisión 6):**
   - *Adoptada:* Solicitar el permiso una sola vez mediante diálogo formativo de la Academia Cotopaxi. Si el usuario cancela o deniega, se inicia el temporizador con avisos en primer plano y no se vuelve a desplegar el modal en inicios posteriores.
   - *Descartada:* Impedir el uso del temporizador hasta que el estudiante active el permiso, o insistir con el diálogo cada vez que pulse "Iniciar".
5. **Restauración offline 100% local (Decisión 7):**
   - *Adoptada:* Calcular el tiempo transcurrido estrictamente con `Date.now()` respecto al `endTimestamp` guardado en el dispositivo, detectando fases culminadas en ausencia sin requerir servidores de hora de red.
   - *Descartada:* Descartar la sesión en curso si la app se cerró o intentar sincronizar la hora con un servidor NTP.

---

## Estrategia de pruebas

### Pruebas unitarias automatizadas con Jest (`npx jest`)

- `notificationService.test.ts`:
  - Verificación de que `startAlarmVibration` no arroja excepciones si el hardware de vibración falla.
  - Comprobación de que la solicitud de permisos retorna advertencia amigable sin lanzar errores fatales.
  - Cancelación y programación de notificaciones sin fallos ante módulos nativos desconectados.
- `sessionStorage.test.ts` y `settingsStorage.test.ts`:
  - Simulación de fallo de escritura (`AsyncStorage.setItem` arrojando excepción de E/S o espacio lleno).
  - Verificación de que los contratos de datos almacenados no contienen identificadores de usuario, correos ni telemetría (RF-006).
  - Manejo de lectura corrupta recuperando valores por defecto de forma segura.
- `StudySessionContext.test.tsx`:
  - Prueba de degradación a memoria (RF-007): simular error en `saveStudySession` al iniciar, pausar o reiniciar; verificar que la sesión cambia de estado en memoria (`status: "running"`, etc.) y se despliega la advertencia no bloqueante sin interrumpir el temporizador.
  - Prueba de rechazo de permisos (RF-008): simular descarte del modal de permisos; verificar que el temporizador arranca con avisos en primer plano y que futuros arranques no vuelven a mostrar el modal.
  - Prueba de restauración offline tras cierre (RF-009): simular sesión corriendo con timestamp final pasado; verificar que al sincronizar se marca la fase como completada y se notifica sin peticiones de red.
- `SettingsContext.test.tsx`:
  - Simulación de error de escritura al guardar ajustes; verificar que los ajustes se actualizan en memoria y se propagan a la sesión.
- `SessionMessage.test.tsx`:
  - Verificación del renderizado de advertencias de degradación a memoria en color Cotopaxi sin bloquear la pantalla ni botones de acción.

### Verificación manual en dispositivo móvil / APK (según `rn-conventions`)

- **Instalación limpia y primer inicio (RF-001):**
  - Instalar el APK en un dispositivo o emulador sin datos previos.
  - Abrir la app: corroborar que se entra directo a la pantalla principal con el reloj en `25:00` y fase `Estudio`, sin pantallas de bienvenida, login ni tutoriales.
- **Modo avión continuo (RF-002, RF-003, RF-005):**
  - Activar Modo Avión (sin Wi-Fi y sin datos móviles).
  - Usar la aplicación completa: iniciar, pausar, reiniciar, modificar duraciones en ajustes a `30/10/20/3`, restablecer ajustes.
  - Corroborar que no aparece ningún banner ni alerta de falta de conexión, y no hay anuncios ni enlaces externos.
- **Degradación de audio a vibración (RF-004):**
  - Silenciar el altavoz multimedia del dispositivo y esperar a que el temporizador llegue a cero.
  - Corroborar que el dispositivo vibra rítmicamente y la pantalla de alarma visual se presenta con el botón «Detener aviso».
- **Rechazo de permisos (RF-008):**
  - En una instalación limpia, presionar «Iniciar» por primera vez.
  - En el modal de permisos, presionar «Continuar sin avisos».
  - Corroborar que el temporizador arranca de inmediato a contar, muestra el aviso de advertencia no bloqueante y al pausar y volver a iniciar no vuelve a mostrar el modal.
- **Restauración offline tras cierre forzado (RF-009):**
  - Iniciar una sesión en Modo Avión, salir de la aplicación y forzar el cierre desde la lista de aplicaciones recientes.
  - Reabrir la aplicación varios minutos después (o tras expirar el tiempo): corroborar que la app deduce el tiempo exacto por marcas locales y muestra la fase completada o el tiempo restante exacto.

---

## Cobertura de requisitos

- **RF-001:** `index.tsx` (apertura directa al temporizador a 25:00 en reposo sin registro ni bienvenida).
- **RF-002:** `index.tsx`, `settings.tsx`, `SessionMessage.tsx` (ausencia absoluta de avisos o indicadores de conectividad).
- **RF-003:** Arquitectura global offline con recursos locales (`src/services/`, `src/utils/`, fuentes e iconos del paquete).
- **RF-004:** `notificationService.ts`, `StudySessionContext.tsx` (respaldo por vibración rítmica y tolerancia a fallos de audio).
- **RF-005:** `index.tsx`, `settings.tsx`, `package.json` (cero anuncios, cero rastreadores, cero enlaces externos).
- **RF-006:** `sessionStorage.ts`, `settingsStorage.ts` (persistencia estricta sin identificadores ni datos sensibles).
- **RF-007:** `StudySessionContext.tsx`, `SettingsContext.tsx`, `SessionMessage.tsx` (degradación suave a memoria ante fallos de persistencia con advertencia no bloqueante).
- **RF-008:** `StudySessionContext.tsx`, `NotificationPermissionModal.tsx` (solicitud no intrusiva de permisos, continuidad ante rechazo y no reincidencia).
- **RF-009:** `sessionRecovery.ts`, `StudySessionContext.tsx` (restauración temporal offline exacta mediante marcas de tiempo locales).
- **RNF-001 a RNF-005:** Cero consumo de red, recursos empaquetados, privacidad total, inicio inmediato y recuperación suave ante fallos de hardware o disco.

---

## Criterio de salida de la planificación

Se formulan 6 tareas de implementación de 20 a 30 minutos de duración máxima estimada, ordenadas estrictamente por dependencias (servicios → almacenamiento → contextos de Capa 1 → interfaz de Capa 2 → verificación integral). No se requiere dividir la spec.


================================================
ðŸ“„ ARCHIVO: specs\006-offline\spec.md
================================================

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


================================================
ðŸ“„ ARCHIVO: specs\006-offline\tasks.md
================================================

# Tareas de implementación — Spec 006: Usar la aplicación sin registro, sin internet y sin publicidad

> Ordenadas por dependencia. Las tareas de Capa 1 comienzan por pruebas y no
> avanzan con Jest o TypeScript en rojo. La ausencia total de publicidad, el funcionamiento
> 100% offline, el respaldo por vibración y la degradación en memoria están definidos
> en la spec y en las Decisiones 1 a 8 de `decisiones.md`.

- [x] **T1. Mecanismo de respaldo de vibración ante fallos o ausencia de audio con pruebas primero.** RF-003, RF-004
  - Hecho cuando: `notificationService.ts` asegura la emisión de vibración como respaldo sin interrupciones ni excepciones no controladas si el audio o canal de notificación no está disponible; las pruebas unitarias en `notificationService.test.ts` verifican el disparo seguro de vibración y el manejo tolerante ante ausencia de hardware; `npx jest` y `npx tsc --noEmit` pasan sin errores.

- [x] **T2. Persistencia estricta y propagación de errores de almacenamiento con pruebas primero.** RF-006, RF-007, RNF-003
  - Hecho cuando: `sessionStorage.ts` y `settingsStorage.ts` restringen los datos persistidos estrictamente a las claves `@pomodoro_settings` y `pomodoro.activeSession` sin registrar IDs de usuario, nombres ni telemetría; ambos módulos aíslan los errores de escritura arrojando fallos tipados comprensibles para que la capa superior active la degradación a memoria; sus pruebas unitarias en `sessionStorage.test.ts` y `settingsStorage.test.ts` pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T3. Degradación a memoria activa en `SettingsContext` ante fallos de guardado con pruebas primero.** RF-006, RF-007
  - Hecho cuando: `SettingsContext.tsx` captura fallos de escritura de `settingsStorage`, preserva los ajustes en memoria durante la sesión activa, los aplica a la sesión de estudio y notifica la advertencia sin bloquear la interfaz; sus pruebas unitarias en `SettingsContext.test.tsx` verifican la actualización en memoria y la tolerancia a errores de almacenamiento; `npx jest` y `npx tsc --noEmit` pasan.

- [x] **T4. Continuidad de sesión en memoria, permisos no intrusivos y restauración offline en `StudySessionContext` con pruebas primero.** RF-004, RF-007, RF-008, RF-009, RNF-005
  - Hecho cuando: en `StudySessionContext.tsx`, `commit` actualiza el estado en memoria ante fallos de `saveStudySession` emitiendo una advertencia no bloqueante de degradación a memoria en lugar de abortar la sesión; el rechazo de permisos de notificación permite iniciar el temporizador con avisos en primer plano y no vuelve a insistir con el modal; la restauración de sesión al abrir o volver a primer plano calcula el tiempo transcurrido por timestamps locales `Date.now()` sin peticiones de red; sus pruebas unitarias en `StudySessionContext.test.tsx` pasan con `npx jest` y `npx tsc --noEmit`.

- [x] **T5. Validación de pantallas y componentes sin registro, sin anuncios y sin avisos de conectividad.** RF-001, RF-002, RF-005, RF-007, RNF-001, RNF-004
  - Hecho cuando: `index.tsx` abre inmediatamente en la pantalla principal con el temporizador en reposo a 25:00 minutos sin pantallas de bienvenida, modales de inicio ni tutoriales; las pantallas `index.tsx` y `settings.tsx` están completamente libres de banners publicitarios, anuncios, enlaces externos e indicadores de conectividad a internet; `SessionMessage.tsx` renderiza las advertencias de almacenamiento no bloqueantes; `npx jest` y `npx tsc --noEmit` pasan sin errores.

- [ ] **T6. Verificación integral en dispositivo móvil/APK y cierre de la historia.** RF-001 a RF-009, RNF-001 a RNF-005
  - Hecho cuando: pasan `npx jest`, `npx tsc --noEmit` y `npx expo lint`; se comprueba en dispositivo físico o emulador en Modo Avión continuo: primer inicio limpio directo al temporizador a 25:00 sin login ni bienvenida, operación completa sin avisos de red ni publicidad, rechazo de permisos de notificación sin bloqueos, respaldo de vibración al llegar a cero con audio silenciado, conservación o cálculo exacto de tiempo al cerrar y reabrir sin internet, y confirmación explícita antes de reiniciar temporizador o restablecer ajustes; `MEMORY.md` queda actualizado en solo "Estado actual" y "Próximos pasos".


================================================
ðŸ“„ ARCHIVO: src\app\index.tsx
================================================

import { useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { StudyTimer } from "../components/StudyTimer";
import { RestartConfirmation } from "../components/RestartConfirmation";
import { SessionMessage } from "../components/SessionMessage";
import { StudyTimerControls } from "../components/StudyTimerControls";
import { PomodoroProgress } from "../components/PomodoroProgress";
import { AlarmActiveModal } from "../components/AlarmActiveModal";
import { NotificationPermissionModal } from "../components/NotificationPermissionModal";
import { theme } from "../constants/theme";
import { useStudySession } from "../context/StudySessionContext";
import { formatTime } from "../utils/timer";
import type { PomodoroPhase } from "../types/pomodoro";

export default function Index() {
  return (
    <StudySessionScreen />
  );
}

function getPhaseLabel(phase: PomodoroPhase): string {
  if (phase === "shortBreak") return "Descanso corto";
  if (phase === "longBreak") return "Descanso largo";
  return "Estudio";
}

function StudySessionScreen() {
  const router = useRouter();
  const {
    session,
    loading,
    error,
    warning,
    info,
    isAlarmActive,
    alarmPhase,
    isPermissionModalVisible,
    start,
    pause,
    reset,
    stopAlarm,
    confirmPermissionModal,
    dismissPermissionModal,
    openNotificationSettings,
  } = useStudySession();
  const [showRestartConfirmation, setShowRestartConfirmation] = useState(false);

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator color={theme.colors.navyBrand} />
        <Text style={styles.loadingText}>Cargando sesión...</Text>
      </SafeAreaView>
    );
  }

  const confirmReset = () => {
    setShowRestartConfirmation(false);
    void reset(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View>
              <Text style={styles.eyebrow}>ACADEMIA COTOPAXI</Text>
              <Text style={styles.title}>Pomodoro</Text>
            </View>
            <Pressable
              accessibilityLabel="Abrir ajustes del pomodoro"
              accessibilityRole="button"
              onPress={() => router.push("/settings")}
              style={styles.settingsButton}
              testID="settings-nav-button"
            >
              <Text style={styles.settingsIcon}>⚙</Text>
            </Pressable>
          </View>
        </View>

        <StudyTimer
          phase={session.phase}
          phaseLabel={getPhaseLabel(session.phase)}
          status={session.status}
          timeText={formatTime(session.remainingSeconds)}
          remainingSeconds={session.remainingSeconds}
          initialDurationSeconds={session.initialDurationSeconds}
        />
        <PomodoroProgress
          completedPomodoros={session.completedPomodoros}
          cycleTarget={session.cycleTarget}
        />
        <Text style={styles.description}>
          {session.status === "finished"
            ? "La sesión terminó. Reinicia para comenzar otra."
            : "Concéntrate en tu sesión de estudio."}
        </Text>
        <View style={styles.messageWrapper}>
          <SessionMessage
            error={error}
            warning={warning}
            info={info}
            onOpenSettings={() => void openNotificationSettings()}
          />
        </View>
        <View style={styles.spacer} />
        <StudyTimerControls
          hasTimeRemaining={session.remainingSeconds > 0}
          onPause={() => void pause()}
          onReset={() => setShowRestartConfirmation(true)}
          onStart={() => void start()}
          status={session.status}
        />
      </View>
      <RestartConfirmation
        onCancel={() => setShowRestartConfirmation(false)}
        onConfirm={confirmReset}
        visible={showRestartConfirmation}
      />
      <AlarmActiveModal
        visible={isAlarmActive}
        completedPhase={alarmPhase}
        onStop={stopAlarm}
      />
      <NotificationPermissionModal
        visible={isPermissionModalVisible}
        onConfirm={() => void confirmPermissionModal()}
        onCancel={() => void dismissPermissionModal()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  container: {
    flex: 1,
    padding: theme.spacing.screen,
  },
  header: {
    marginBottom: 36,
  },
  headerTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingsButton: {
    alignItems: "center",
    backgroundColor: theme.colors.navyBrand,
    borderColor: theme.colors.slate,
    borderRadius: 22,
    borderWidth: 1.5,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  settingsIcon: {
    color: theme.colors.white,
    fontSize: 20,
  },
  eyebrow: {
    color: theme.colors.navyBrand,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: {
    color: theme.colors.navyBrand,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 4,
  },

  description: {
    color: theme.colors.navyBrand,
    fontSize: 15,
    marginTop: 14,
    textAlign: "center",
  },
  messageWrapper: {
    marginTop: 12,
    width: "100%",
  },
  spacer: {
    flex: 1,
  },
  loading: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    flex: 1,
    gap: 12,
    justifyContent: "center",
  },
  loadingText: {
    color: theme.colors.navyBrand,
    fontSize: 16,
  },
});


================================================
ðŸ“„ ARCHIVO: src\app\settings.tsx
================================================

import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SettingsForm } from "../components/SettingsForm";
import { ResetSettingsModal } from "../components/ResetSettingsModal";
import { SessionMessage } from "../components/SessionMessage";
import { theme } from "../constants/theme";
import { useSettings } from "../context/SettingsContext";
import type { PomodoroSettings } from "../types/pomodoro";

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, loading, warning, saveSettings, resetToDefaults } = useSettings();
  const [showResetModal, setShowResetModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.navyBrand} />
        <Text style={styles.loadingText}>Cargando ajustes...</Text>
      </SafeAreaView>
    );
  }

  const handleSave = async (newSettings: PomodoroSettings) => {
    await saveSettings(newSettings);
    setSuccessMessage("Ajustes guardados");
    setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    }, 400);
  };

  const handleConfirmReset = async () => {
    setShowResetModal(false);
    await resetToDefaults();
    setSuccessMessage("Valores por defecto restablecidos");
    setTimeout(() => {
      setSuccessMessage(null);
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cabecera */}
          <View style={styles.header}>
            <Pressable
              accessibilityLabel="Volver a la pantalla principal"
              accessibilityRole="button"
              onPress={() => router.back()}
              style={styles.backButton}
              testID="settings-back-button"
            >
              <Text style={styles.backButtonText}>← Volver</Text>
            </Pressable>
            <Text style={styles.eyebrow}>ACADEMIA COTOPAXI</Text>
            <Text style={styles.title}>Ajustes de tiempo</Text>
            <Text style={styles.subtitle}>
              Personaliza la duración de cada bloque según tu propio ritmo de concentración.
            </Text>
          </View>

          {/* Notificación de éxito */}
          {successMessage ? (
            <View
              accessibilityRole="alert"
              style={styles.successBanner}
              testID="settings-success-banner"
            >
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          {/* Advertencia no bloqueante de almacenamiento */}
          {warning ? (
            <View style={styles.warningContainer}>
              <SessionMessage warning={warning} />
            </View>
          ) : null}

          {/* Formulario */}
          <SettingsForm
            initialSettings={settings}
            key={JSON.stringify(settings)}
            onResetRequest={() => setShowResetModal(true)}
            onSave={(newSettings) => void handleSave(newSettings)}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <ResetSettingsModal
        onCancel={() => setShowResetModal(false)}
        onConfirm={() => void handleConfirmReset()}
        visible={showResetModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.screen,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
    minHeight: 44,
    justifyContent: "center",
    paddingVertical: 8,
  },
  backButtonText: {
    color: theme.colors.navyBrand,
    fontSize: 16,
    fontWeight: "700",
  },
  eyebrow: {
    color: theme.colors.navyBrand,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: {
    color: theme.colors.navyBrand,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
  },
  subtitle: {
    color: theme.colors.slate,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  successBanner: {
    backgroundColor: theme.colors.gold,
    borderRadius: 12,
    marginBottom: 20,
    padding: 14,
  },
  warningContainer: {
    marginBottom: 20,
  },
  successText: {
    color: theme.colors.navyBrand,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    flex: 1,
    gap: 12,
    justifyContent: "center",
  },
  loadingText: {
    color: theme.colors.navyBrand,
    fontSize: 16,
  },
});


================================================
ðŸ“„ ARCHIVO: src\app\_layout.tsx
================================================

import { Stack } from "expo-router";
import { StudySessionProvider } from "../context/StudySessionContext";
import { SettingsProvider } from "../context/SettingsContext";

export default function RootLayout() {
  return (
    <StudySessionProvider>
      <SettingsProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SettingsProvider>
    </StudySessionProvider>
  );
}



================================================
ðŸ“„ ARCHIVO: src\components\AlarmActiveModal.test.tsx
================================================

import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { AlarmActiveModal } from "./AlarmActiveModal";

describe("AlarmActiveModal component (RF-008, RF-009)", () => {
  it("does not display content when visible is false", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <AlarmActiveModal visible={false} completedPhase="study" onStop={() => {}} />,
      );
    });
    const modal = renderer.root.findByProps({ testID: "alarm-modal" });
    expect(modal.props.visible).toBe(false);
  });

  it("renders prominent title and button when visible is true", () => {
    const onStop = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <AlarmActiveModal visible={true} completedPhase="study" onStop={onStop} />,
      );
    });

    const title = renderer.root.findByProps({ testID: "alarm-modal-title" });
    expect(title.props.children).toBe("¡Fase finalizada!");

    const button = renderer.root.findByProps({ testID: "alarm-stop-button" });
    expect(button.props.accessibilityLabel).toBe("Detener aviso de fin de fase");

    act(() => {
      button.props.onPress();
    });
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it("presents specific message when completed phase is study", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <AlarmActiveModal visible={true} completedPhase="study" onStop={() => {}} />,
      );
    });
    const message = renderer.root.findByProps({ testID: "alarm-modal-message" });
    expect(message.props.children).toContain("estudio");
  });

  it("presents specific message when completed phase is a break", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <AlarmActiveModal visible={true} completedPhase="shortBreak" onStop={() => {}} />,
      );
    });
    const message = renderer.root.findByProps({ testID: "alarm-modal-message" });
    expect(message.props.children).toContain("descanso");
  });
});


================================================
ðŸ“„ ARCHIVO: src\components\AlarmActiveModal.tsx
================================================

import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";
import type { PomodoroPhase } from "../types/pomodoro";

export interface AlarmActiveModalProps {
  visible: boolean;
  completedPhase: PomodoroPhase | null;
  onStop: () => void;
}

export function AlarmActiveModal({
  visible,
  completedPhase,
  onStop,
}: AlarmActiveModalProps) {
  const isStudy = completedPhase === "study";
  const message = isStudy
    ? "Has completado la sesión de estudio. ¡Gran trabajo! La siguiente fase de descanso está preparada."
    : "El tiempo de descanso ha finalizado. La siguiente sesión de estudio está preparada.";

  return (
    <Modal
      testID="alarm-modal"
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text testID="alarm-modal-title" style={styles.title}>
            ¡Fase finalizada!
          </Text>
          <Text testID="alarm-modal-message" style={styles.message}>
            {message}
          </Text>
          <Pressable
            testID="alarm-stop-button"
            accessibilityRole="button"
            accessibilityLabel="Detener aviso de fin de fase"
            onPress={onStop}
            style={({ pressed }) => [
              styles.stopButton,
              pressed && styles.stopButtonPressed,
            ]}
          >
            <Text style={styles.stopButtonText}>Detener aviso</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(20, 23, 89, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.screen,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 8,
    shadowColor: theme.colors.navyBrand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.navyBrand,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.colors.navyBrand,
    textAlign: "center",
    marginBottom: 24,
  },
  stopButton: {
    width: "100%",
    height: 56,
    backgroundColor: theme.colors.navyBrand,
    borderRadius: theme.spacing.buttonRadius,
    justifyContent: "center",
    alignItems: "center",
  },
  stopButtonPressed: {
    opacity: 0.85,
  },
  stopButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\NotificationPermissionModal.test.tsx
================================================

import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { NotificationPermissionModal } from "./NotificationPermissionModal";

describe("NotificationPermissionModal component (RF-001, RF-002, RF-003)", () => {
  it("does not show content when visible is false", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <NotificationPermissionModal
          visible={false}
          onConfirm={() => {}}
          onCancel={() => {}}
        />,
      );
    });

    const modal = renderer.root.findByProps({ testID: "notification-permission-modal" });
    expect(modal.props.visible).toBe(false);
  });

  it("renders title, description and triggers onConfirm on 'Permitir avisos'", () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;

    act(() => {
      renderer = TestRenderer.create(
        <NotificationPermissionModal
          visible={true}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />,
      );
    });

    const title = renderer.root.findByProps({ testID: "permission-modal-title" });
    expect(title.props.children).toBe("Avisos de la Academia Cotopaxi");

    const confirmButton = renderer.root.findByProps({ testID: "permission-confirm-button" });
    expect(confirmButton.props.accessibilityLabel).toBe("Permitir avisos de fin de fase");

    act(() => {
      confirmButton.props.onPress();
    });
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("triggers onCancel when pressing 'Continuar sin avisos'", () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;

    act(() => {
      renderer = TestRenderer.create(
        <NotificationPermissionModal
          visible={true}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />,
      );
    });

    const cancelButton = renderer.root.findByProps({ testID: "permission-cancel-button" });
    expect(cancelButton.props.accessibilityLabel).toBe("Continuar sin avisos de fin de fase");

    act(() => {
      cancelButton.props.onPress();
    });
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});


================================================
ðŸ“„ ARCHIVO: src\components\NotificationPermissionModal.tsx
================================================

import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

export interface NotificationPermissionModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function NotificationPermissionModal({
  visible,
  onConfirm,
  onCancel,
}: NotificationPermissionModalProps) {
  return (
    <Modal
      testID="notification-permission-modal"
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text testID="permission-modal-title" style={styles.title}>
            Avisos de la Academia Cotopaxi
          </Text>
          <Text style={styles.description}>
            Para avisarte de forma confiable cuando concluya tu tiempo de estudio o descanso, la aplicación necesita permiso para emitir avisos sonoros y de vibración tipo alarma.
          </Text>
          <Text style={styles.subtext}>
            Si decides no activarlos, podrás continuar estudiando, pero no recibirás alertas fuera de la pantalla.
          </Text>

          <View style={styles.buttonContainer}>
            <Pressable
              testID="permission-confirm-button"
              accessibilityRole="button"
              accessibilityLabel="Permitir avisos de fin de fase"
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.confirmButtonPressed,
              ]}
            >
              <Text style={styles.confirmButtonText}>Permitir avisos</Text>
            </Pressable>

            <Pressable
              testID="permission-cancel-button"
              accessibilityRole="button"
              accessibilityLabel="Continuar sin avisos de fin de fase"
              onPress={onCancel}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
              ]}
            >
              <Text style={styles.cancelButtonText}>Continuar sin avisos</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(20, 23, 89, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.screen,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 8,
    shadowColor: theme.colors.navyBrand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.navyBrand,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.navyBrand,
    textAlign: "center",
    marginBottom: 10,
  },
  subtext: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.slate,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  confirmButton: {
    width: "100%",
    height: 56,
    backgroundColor: theme.colors.navyBrand,
    borderRadius: theme.spacing.buttonRadius,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonPressed: {
    opacity: 0.85,
  },
  confirmButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    width: "100%",
    height: 48,
    backgroundColor: "transparent",
    borderRadius: theme.spacing.buttonRadius,
    borderWidth: 1.5,
    borderColor: theme.colors.slate,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonPressed: {
    backgroundColor: "rgba(118, 120, 166, 0.1)",
  },
  cancelButtonText: {
    color: theme.colors.navyBrand,
    fontSize: 15,
    fontWeight: "600",
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\PomodoroProgress.test.tsx
================================================

import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { Text } from "react-native";
import { PomodoroProgress } from "./PomodoroProgress";

describe("PomodoroProgress", () => {
  it("shows completed pomodoros and the cycle target", () => {
    let tree!: TestRenderer.ReactTestRenderer;
    act(() => {
      tree = TestRenderer.create(
        <PomodoroProgress completedPomodoros={2} cycleTarget={4} />,
      );
    });

    expect(tree.root.findByProps({ accessibilityLabel: "Progreso del ciclo" })).toBeTruthy();
    expect(tree.root.findByType(Text).props.children.join("")).toBe("2 de 4 pomodoros");
  });
});


================================================
ðŸ“„ ARCHIVO: src\components\PomodoroProgress.tsx
================================================

import { StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

interface PomodoroProgressProps {
  completedPomodoros: number;
  cycleTarget: number;
}

export function PomodoroProgress({
  completedPomodoros,
  cycleTarget,
}: PomodoroProgressProps) {
  const completed = Math.max(0, Math.min(completedPomodoros, cycleTarget));

  return (
    <View accessibilityLabel="Progreso del ciclo" style={styles.container}>
      <View accessibilityLabel={`${completed} de ${cycleTarget} pomodoros`}>
        <View style={styles.dots}>
          {Array.from({ length: cycleTarget }, (_, index) => (
            <View
              key={index}
              style={[styles.dot, index < completed ? styles.completed : styles.pending]}
            />
          ))}
        </View>
        <Text style={styles.label}>{completed} de {cycleTarget} pomodoros</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 24,
  },
  dots: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  dot: {
    borderRadius: 8,
    height: 16,
    width: 16,
  },
  completed: {
    backgroundColor: theme.colors.gold,
  },
  pending: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.slate,
    borderWidth: 2,
  },
  label: {
    color: theme.colors.navyBrand,
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\ResetSettingsModal.test.tsx
================================================

import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { ResetSettingsModal } from "./ResetSettingsModal";

describe("ResetSettingsModal component (T5: RF-008, RF-009, RF-010, RNF-004)", () => {
  it("does not render contents when visible is false", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <ResetSettingsModal
          visible={false}
          onConfirm={jest.fn()}
          onCancel={jest.fn()}
        />,
      );
    });

    const modal = renderer.root.findByProps({ testID: "reset-settings-modal" });
    expect(modal.props.visible).toBe(false);
  });

  it("renders warning title, explanation with default values (25/5/15/4) and actions when visible", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <ResetSettingsModal
          visible={true}
          onConfirm={jest.fn()}
          onCancel={jest.fn()}
        />,
      );
    });

    const modal = renderer.root.findByProps({ testID: "reset-settings-modal" });
    expect(modal.props.visible).toBe(true);

    const title = renderer.root.findByProps({ testID: "reset-settings-title" });
    expect(title.props.children).toBe("¿Restablecer valores por defecto?");

    const message = renderer.root.findByProps({ testID: "reset-settings-message" });
    expect(message.props.children).toContain("25 min de estudio");
    expect(message.props.children).toContain("5 min de descanso corto");
    expect(message.props.children).toContain("15 min de descanso largo");
    expect(message.props.children).toContain("4 pomodoros");
  });

  it("calls onCancel when cancel button is pressed", () => {
    const onCancel = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <ResetSettingsModal
          visible={true}
          onConfirm={jest.fn()}
          onCancel={onCancel}
        />,
      );
    });

    const cancelButton = renderer.root.findByProps({ testID: "reset-settings-cancel-button" });
    act(() => {
      cancelButton.props.onPress();
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when destructive confirm button is pressed", () => {
    const onConfirm = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <ResetSettingsModal
          visible={true}
          onConfirm={onConfirm}
          onCancel={jest.fn()}
        />,
      );
    });

    const confirmButton = renderer.root.findByProps({ testID: "reset-settings-confirm-button" });
    act(() => {
      confirmButton.props.onPress();
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});


================================================
ðŸ“„ ARCHIVO: src\components\ResetSettingsModal.tsx
================================================

import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

interface ResetSettingsModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResetSettingsModal({
  visible,
  onConfirm,
  onCancel,
}: ResetSettingsModalProps) {
  return (
    <Modal
      accessibilityViewIsModal
      animationType="fade"
      onRequestClose={onCancel}
      testID="reset-settings-modal"
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <View accessibilityViewIsModal style={styles.dialog}>
          <Text style={styles.title} testID="reset-settings-title">
            ¿Restablecer valores por defecto?
          </Text>
          <Text style={styles.message} testID="reset-settings-message">
            Los tiempos regresarán a los valores recomendados por la Academia Cotopaxi: 25 min de estudio, 5 min de descanso corto, 15 min de descanso largo y 4 pomodoros por ciclo.
          </Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityLabel="Cancelar restablecimiento"
              accessibilityRole="button"
              onPress={onCancel}
              style={styles.cancelButton}
              testID="reset-settings-cancel-button"
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Confirmar restablecimiento"
              accessibilityRole="button"
              onPress={onConfirm}
              style={styles.confirmButton}
              testID="reset-settings-confirm-button"
            >
              <Text style={styles.confirmText}>Restablecer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: theme.colors.navyBrand,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.screen,
  },
  dialog: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 24,
    width: "100%",
  },
  title: {
    color: theme.colors.navyBrand,
    fontSize: 20,
    fontWeight: "700",
  },
  message: {
    color: theme.colors.navyBrand,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 24,
  },
  cancelButton: {
    alignItems: "center",
    borderColor: theme.colors.slate,
    borderRadius: theme.spacing.buttonRadius,
    borderWidth: 2,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 16,
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: theme.colors.danger,
    borderRadius: theme.spacing.buttonRadius,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: theme.colors.navyBrand,
    fontWeight: "700",
  },
  confirmText: {
    color: theme.colors.white,
    fontWeight: "700",
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\RestartConfirmation.tsx
================================================

import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

interface RestartConfirmationProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RestartConfirmation({
  visible,
  onConfirm,
  onCancel,
}: RestartConfirmationProps) {
  return (
    <Modal
      accessibilityViewIsModal
      animationType="fade"
      onRequestClose={onCancel}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <View accessibilityViewIsModal style={styles.dialog}>
          <Text style={styles.title}>¿Reiniciar el temporizador?</Text>
          <Text style={styles.message}>
            Se perderá el tiempo restante de la sesión actual.
          </Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityLabel="Cancelar reinicio"
              accessibilityRole="button"
              onPress={onCancel}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Confirmar reinicio"
              accessibilityRole="button"
              onPress={onConfirm}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmText}>Reiniciar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: theme.colors.navyBrand,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.screen,
  },
  dialog: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 24,
    width: "100%",
  },
  title: {
    color: theme.colors.navyBrand,
    fontSize: 20,
    fontWeight: "700",
  },
  message: {
    color: theme.colors.navyBrand,
    fontSize: 16,
    marginTop: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 24,
  },
  cancelButton: {
    alignItems: "center",
    borderColor: theme.colors.slate,
    borderRadius: theme.spacing.buttonRadius,
    borderWidth: 2,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 16,
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: theme.colors.danger,
    borderRadius: theme.spacing.buttonRadius,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: theme.colors.navyBrand,
    fontWeight: "700",
  },
  confirmText: {
    color: theme.colors.white,
    fontWeight: "700",
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\SessionMessage.test.tsx
================================================

import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { SessionMessage } from "./SessionMessage";

describe("SessionMessage component", () => {
  it("renders null when there are no messages", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SessionMessage error={null} warning={null} info={null} />,
      );
    });
    expect(renderer.toJSON()).toBeNull();
  });

  it("renders error message with accessible text", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SessionMessage error="Error al guardar la sesión." />,
      );
    });
    const textNode = renderer.root.findByProps({ children: "Error al guardar la sesión." });
    expect(textNode).toBeDefined();
  });

  it("renders warning message when clock shifted or permissions missing", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SessionMessage warning="Se detectó un cambio en el reloj del dispositivo." />,
      );
    });
    const textNode = renderer.root.findByProps({
      children: "Se detectó un cambio en el reloj del dispositivo.",
    });
    expect(textNode).toBeDefined();
  });

  it("renders info message when phase completed in absence or cycle expired", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SessionMessage info="La fase anterior terminó mientras la aplicación no estaba activa." />,
      );
    });
    const textNode = renderer.root.findByProps({
      children: "La fase anterior terminó mientras la aplicación no estaba activa.",
    });
    expect(textNode).toBeDefined();
  });

  it("renders 'Abrir ajustes' button when onOpenSettings callback is provided with a warning (RF-003)", () => {
    const onOpenSettings = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SessionMessage
          warning="No recibirás avisos fuera de la app. Puedes activarlos en los ajustes."
          onOpenSettings={onOpenSettings}
        />,
      );
    });

    const settingsButton = renderer.root.findByProps({ testID: "session-message-open-settings" });
    expect(settingsButton).toBeDefined();

    act(() => {
      settingsButton.props.onPress();
    });
    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it("renders non-blocking storage degradation warning (RF-007, Decisión 4)", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SessionMessage warning="No se pudieron guardar los cambios en el dispositivo. La sesión continuará en memoria mientras la aplicación esté abierta." />,
      );
    });
    const textNode = renderer.root.findByProps({
      children:
        "No se pudieron guardar los cambios en el dispositivo. La sesión continuará en memoria mientras la aplicación esté abierta.",
    });
    expect(textNode).toBeDefined();
  });
});


================================================
ðŸ“„ ARCHIVO: src\components\SessionMessage.tsx
================================================

import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

export interface SessionMessageProps {
  error?: string | null;
  warning?: string | null;
  info?: string | null;
  onOpenSettings?: () => void;
}

export function SessionMessage({
  error,
  warning,
  info,
  onOpenSettings,
}: SessionMessageProps) {
  if (!error && !warning && !info) {
    return null;
  }

  const isNotificationWarning =
    !!warning && (warning.includes("avisos fuera de la app") || !!onOpenSettings);

  return (
    <View accessibilityLiveRegion="polite" style={styles.container}>
      {error ? (
        <View style={styles.errorCard}>
          <View style={styles.errorIconContainer}>
            <Text style={styles.cardIcon}>⚠️</Text>
          </View>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {warning ? (
        <View style={styles.warningCard}>
          <View style={styles.warningIconContainer}>
            <Text style={styles.cardIcon}>{isNotificationWarning ? "🔔" : "⚠️"}</Text>
          </View>
          <View style={styles.warningContent}>
            <Text style={styles.warning}>{warning}</Text>
            {onOpenSettings ? (
              <Pressable
                testID="session-message-open-settings"
                accessibilityRole="button"
                accessibilityLabel="Abrir ajustes del dispositivo"
                onPress={onOpenSettings}
                style={({ pressed }) => [
                  styles.settingsButton,
                  pressed && styles.settingsButtonPressed,
                ]}
              >
                <Text style={styles.settingsButtonText}>Abrir ajustes</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      ) : null}

      {info ? (
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Text style={styles.cardIcon}>ℹ️</Text>
          </View>
          <Text style={styles.infoText}>{info}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: "100%",
  },
  warningCard: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.slate,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: 12,
    padding: 14,
    shadowColor: theme.colors.navyBrand,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  warningIconContainer: {
    alignItems: "center",
    backgroundColor: "rgba(118, 120, 166, 0.18)",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  cardIcon: {
    fontSize: 18,
  },
  warningContent: {
    flex: 1,
    gap: 8,
  },
  warning: {
    color: theme.colors.navyBrand,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 19,
  },
  settingsButton: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.navyBrand,
    borderRadius: 10,
    justifyContent: "center",
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  settingsButtonPressed: {
    opacity: 0.8,
  },
  settingsButtonText: {
    color: theme.colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  errorCard: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.danger,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  errorIconContainer: {
    alignItems: "center",
    backgroundColor: "rgba(211, 55, 36, 0.15)",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  errorText: {
    color: theme.colors.danger,
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 19,
  },
  infoCard: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.slate,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  infoIconContainer: {
    alignItems: "center",
    backgroundColor: "rgba(118, 120, 166, 0.18)",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  infoText: {
    color: theme.colors.navyBrand,
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 19,
  },
});




================================================
ðŸ“„ ARCHIVO: src\components\SettingsForm.test.tsx
================================================

import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { SettingsForm } from "./SettingsForm";
import { DEFAULT_POMODORO_SETTINGS } from "../utils/cycleSettings";

describe("SettingsForm component (T4: RF-002, RF-003, RF-004, RNF-003)", () => {
  const initialSettings = { ...DEFAULT_POMODORO_SETTINGS };


  it("renders 4 numeric input fields with initial values", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SettingsForm
          initialSettings={initialSettings}
          onSave={jest.fn()}
          onResetRequest={jest.fn()}
        />,
      );
    });

    const studyInput = renderer.root.findByProps({ testID: "input-study-duration" });
    const shortBreakInput = renderer.root.findByProps({ testID: "input-short-break" });
    const longBreakInput = renderer.root.findByProps({ testID: "input-long-break" });
    const cycleInput = renderer.root.findByProps({ testID: "input-cycle-target" });

    expect(studyInput.props.value).toBe("25");
    expect(shortBreakInput.props.value).toBe("5");
    expect(longBreakInput.props.value).toBe("15");
    expect(cycleInput.props.value).toBe("4");

    expect(studyInput.props.keyboardType).toBe("number-pad");
    expect(shortBreakInput.props.keyboardType).toBe("number-pad");
    expect(longBreakInput.props.keyboardType).toBe("number-pad");
    expect(cycleInput.props.keyboardType).toBe("number-pad");
  });

  it("enables save button when all initial fields are valid", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SettingsForm
          initialSettings={initialSettings}
          onSave={jest.fn()}
          onResetRequest={jest.fn()}
        />,
      );
    });

    const saveButton = renderer.root.findByProps({ testID: "button-save-settings" });
    expect(saveButton.props.accessibilityState?.disabled).toBe(false);
  });

  it("validates reactively and displays inline error when typing out of range", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SettingsForm
          initialSettings={initialSettings}
          onSave={jest.fn()}
          onResetRequest={jest.fn()}
        />,
      );
    });

    const studyInput = renderer.root.findByProps({ testID: "input-study-duration" });

    // Type 10 (study must be 25-90)
    act(() => {
      studyInput.props.onChangeText("10");
    });

    const studyError = renderer.root.findByProps({ testID: "error-study-duration" });
    expect(studyError.props.children).toContain("25 y 90");

    const saveButton = renderer.root.findByProps({ testID: "button-save-settings" });
    expect(saveButton.props.accessibilityState?.disabled).toBe(true);
  });

  it("clears error and re-enables save button when valid input is restored", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SettingsForm
          initialSettings={initialSettings}
          onSave={jest.fn()}
          onResetRequest={jest.fn()}
        />,
      );
    });

    const studyInput = renderer.root.findByProps({ testID: "input-study-duration" });

    // Make invalid
    act(() => {
      studyInput.props.onChangeText("999");
    });
    let saveButton = renderer.root.findByProps({ testID: "button-save-settings" });
    expect(saveButton.props.accessibilityState?.disabled).toBe(true);

    // Restore to valid 45
    act(() => {
      studyInput.props.onChangeText("45");
    });

    const errorNodes = renderer.root.findAllByProps({ testID: "error-study-duration" });
    expect(errorNodes.length).toBe(0);

    saveButton = renderer.root.findByProps({ testID: "button-save-settings" });
    expect(saveButton.props.accessibilityState?.disabled).toBe(false);
  });

  it("calls onSave with parsed numeric settings when save button is pressed", () => {
    const onSave = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SettingsForm
          initialSettings={initialSettings}
          onSave={onSave}
          onResetRequest={jest.fn()}
        />,
      );
    });

    const studyInput = renderer.root.findByProps({ testID: "input-study-duration" });
    const shortBreakInput = renderer.root.findByProps({ testID: "input-short-break" });

    act(() => {
      studyInput.props.onChangeText("50");
      shortBreakInput.props.onChangeText("10");
    });

    const saveButton = renderer.root.findByProps({ testID: "button-save-settings" });
    act(() => {
      saveButton.props.onPress();
    });

    expect(onSave).toHaveBeenCalledWith({
      studyDurationMinutes: 50,
      shortBreakMinutes: 10,
      longBreakMinutes: 15,
      cycleTarget: 4,
    });
  });

  it("triggers onResetRequest when reset button is pressed", () => {
    const onResetRequest = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SettingsForm
          initialSettings={initialSettings}
          onSave={jest.fn()}
          onResetRequest={onResetRequest}
        />,
      );
    });

    const resetButton = renderer.root.findByProps({ testID: "button-reset-settings" });
    act(() => {
      resetButton.props.onPress();
    });

    expect(onResetRequest).toHaveBeenCalledTimes(1);
  });
});


================================================
ðŸ“„ ARCHIVO: src\components\SettingsForm.tsx
================================================

import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { theme } from "../constants/theme";
import {
  PomodoroSettings,
  SettingsFieldErrors,
  SettingsFormInput,
} from "../types/pomodoro";
import {
  parseSettingsForm,
  validateSettingsForm,
} from "../utils/cycleSettings";

interface SettingsFormProps {
  initialSettings: PomodoroSettings;
  onSave: (settings: PomodoroSettings) => void;
  onResetRequest: () => void;
}

export function SettingsForm({
  initialSettings,
  onSave,
  onResetRequest,
}: SettingsFormProps) {
  const [form, setForm] = useState<SettingsFormInput>({
    studyDurationMinutes: String(initialSettings.studyDurationMinutes),
    shortBreakMinutes: String(initialSettings.shortBreakMinutes),
    longBreakMinutes: String(initialSettings.longBreakMinutes),
    cycleTarget: String(initialSettings.cycleTarget),
  });

  const [errors, setErrors] = useState<SettingsFieldErrors>({});

  const handleChange = (field: keyof SettingsFormInput, text: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: text };
      const validation = validateSettingsForm(updated);
      setErrors(validation.errors);
      return updated;
    });
  };


  const validation = validateSettingsForm(form);
  const isValid = validation.isValid;

  const handleSave = () => {
    if (!isValid) return;
    const parsed = parseSettingsForm(form);
    if (parsed) {
      onSave(parsed);
    }
  };

  return (
    <View style={styles.container}>
      {/* Campo: Estudio */}
      <View style={styles.fieldContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Tiempo de estudio (minutos)</Text>
          <Text style={styles.rangeHint}>25 - 90 min</Text>
        </View>
        <TextInput
          accessibilityLabel="Tiempo de estudio en minutos"
          keyboardType="number-pad"
          maxLength={3}
          onChangeText={(text) => handleChange("studyDurationMinutes", text)}
          style={[
            styles.input,
            errors.studyDurationMinutes ? styles.inputError : null,
          ]}
          testID="input-study-duration"
          value={form.studyDurationMinutes}
        />
        {errors.studyDurationMinutes ? (
          <Text
            accessibilityRole="alert"
            style={styles.errorText}
            testID="error-study-duration"
          >
            {errors.studyDurationMinutes}
          </Text>
        ) : null}
      </View>

      {/* Campo: Descanso Corto */}
      <View style={styles.fieldContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Descanso corto (minutos)</Text>
          <Text style={styles.rangeHint}>5 - 20 min</Text>
        </View>
        <TextInput
          accessibilityLabel="Descanso corto en minutos"
          keyboardType="number-pad"
          maxLength={3}
          onChangeText={(text) => handleChange("shortBreakMinutes", text)}
          style={[
            styles.input,
            errors.shortBreakMinutes ? styles.inputError : null,
          ]}
          testID="input-short-break"
          value={form.shortBreakMinutes}
        />
        {errors.shortBreakMinutes ? (
          <Text
            accessibilityRole="alert"
            style={styles.errorText}
            testID="error-short-break"
          >
            {errors.shortBreakMinutes}
          </Text>
        ) : null}
      </View>

      {/* Campo: Descanso Largo */}
      <View style={styles.fieldContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Descanso largo (minutos)</Text>
          <Text style={styles.rangeHint}>15 - 30 min</Text>
        </View>
        <TextInput
          accessibilityLabel="Descanso largo en minutos"
          keyboardType="number-pad"
          maxLength={3}
          onChangeText={(text) => handleChange("longBreakMinutes", text)}
          style={[
            styles.input,
            errors.longBreakMinutes ? styles.inputError : null,
          ]}
          testID="input-long-break"
          value={form.longBreakMinutes}
        />
        {errors.longBreakMinutes ? (
          <Text
            accessibilityRole="alert"
            style={styles.errorText}
            testID="error-long-break"
          >
            {errors.longBreakMinutes}
          </Text>
        ) : null}
      </View>

      {/* Campo: Pomodoros por ciclo */}
      <View style={styles.fieldContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Pomodoros por ciclo</Text>
          <Text style={styles.rangeHint}>2 - 8 pomodoros</Text>
        </View>
        <TextInput
          accessibilityLabel="Cantidad de pomodoros por ciclo"
          keyboardType="number-pad"
          maxLength={2}
          onChangeText={(text) => handleChange("cycleTarget", text)}
          style={[
            styles.input,
            errors.cycleTarget ? styles.inputError : null,
          ]}
          testID="input-cycle-target"
          value={form.cycleTarget}
        />
        {errors.cycleTarget ? (
          <Text
            accessibilityRole="alert"
            style={styles.errorText}
            testID="error-cycle-target"
          >
            {errors.cycleTarget}
          </Text>
        ) : null}
      </View>

      {/* Acciones */}
      <View style={styles.actionsContainer}>
        <Pressable
          accessibilityLabel="Guardar ajustes"
          accessibilityRole="button"
          accessibilityState={{ disabled: !isValid }}
          disabled={!isValid}
          onPress={handleSave}
          style={[
            styles.saveButton,
            !isValid ? styles.buttonDisabled : null,
          ]}
          testID="button-save-settings"
        >
          <Text
            style={[
              styles.saveButtonText,
              !isValid ? styles.buttonTextDisabled : null,
            ]}
          >
            Guardar ajustes
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Restablecer valores por defecto"
          accessibilityRole="button"
          onPress={onResetRequest}
          style={styles.resetButton}
          testID="button-reset-settings"
        >
          <Text style={styles.resetButtonText}>
            Restablecer valores por defecto
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  labelRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: theme.colors.navyBrand,
    fontSize: 16,
    fontWeight: "600",
  },
  rangeHint: {
    color: theme.colors.slate,
    fontSize: 13,
    fontWeight: "500",
  },
  input: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.slate,
    borderRadius: 12,
    borderWidth: 2,
    color: theme.colors.navyBrand,
    fontSize: 18,
    fontWeight: "700",
    height: 48,
    paddingHorizontal: 16,
    textAlign: "center",
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
  },
  actionsContainer: {
    gap: 14,
    marginTop: 16,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: theme.colors.navyBrand,
    borderRadius: theme.spacing.buttonRadius,
    height: 56,
    justifyContent: "center",
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  buttonDisabled: {
    backgroundColor: theme.colors.slate,
    opacity: 0.6,
  },
  buttonTextDisabled: {
    color: theme.colors.inkDark,
  },
  resetButton: {
    alignItems: "center",
    backgroundColor: theme.colors.danger,
    borderRadius: theme.spacing.buttonRadius,
    height: 48,
    justifyContent: "center",
  },
  resetButtonText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\StudyTimer.tsx
================================================

import { StyleSheet, Text, View } from "react-native";
import type { PomodoroPhase, SessionStatus } from "../types/pomodoro";
import { theme } from "../constants/theme";

export interface StudyTimerProps {
  timeText: string;
  phaseLabel: string;
  phase: PomodoroPhase;
  status: SessionStatus;
  progress?: number;
  remainingSeconds?: number;
  initialDurationSeconds?: number;
}

export function StudyTimer({
  timeText,
  phaseLabel,
  phase,
  status,
  progress,
  remainingSeconds,
  initialDurationSeconds,
}: StudyTimerProps) {
  const isStudy = phase === "study";
  const progressColor = isStudy ? theme.colors.gold : theme.colors.slate;

  const calculatedRatio =
    typeof progress === "number"
      ? progress
      : initialDurationSeconds && initialDurationSeconds > 0
        ? (remainingSeconds ?? 0) / initialDurationSeconds
        : 1;

  const clampedProgress = Math.max(0, Math.min(1, calculatedRatio));
  const angle = clampedProgress * 360;
  const rightRotate = Math.min(180, Math.max(0, angle - 90));
  const leftRotate = Math.min(180, Math.max(0, angle - 270));

  return (
    <View style={styles.container}>
      <Text style={[styles.phase, !isStudy && styles.breakPhase]}>{phaseLabel}</Text>

      {/* Círculo del reloj de 280 px con anillo de progreso de 10 px */}
      <View accessibilityLabel={`Tiempo restante ${timeText}`} style={styles.clockContainer}>
        {/* Pista del anillo de progreso (35% opacidad) */}
        <View style={styles.trackRing} />

        {/* Anillo de progreso circular activo */}
        {clampedProgress > 0 ? (
          <>
            {/* Mitad derecha (0° - 180°) */}
            <View style={styles.halfContainerRight}>
              <View
                style={[
                  styles.progressRingCircle,
                  styles.progressRingCircleRight,
                  {
                    borderColor: progressColor,
                    transform: [{ rotate: `${rightRotate}deg` }],
                  },
                ]}
              />
            </View>

            {/* Mitad izquierda (180° - 360°) */}
            {angle > 180 ? (
              <View style={styles.halfContainerLeft}>
                <View
                  style={[
                    styles.progressRingCircle,
                    styles.progressRingCircleLeft,
                    {
                      borderColor: progressColor,
                      transform: [{ rotate: `${leftRotate}deg` }],
                    },
                  ]}
                />
              </View>
            ) : null}
          </>
        ) : null}

        {/* Círculo central oscuro con el tiempo y barra interior sutil */}
        <View style={styles.clockCenter}>
          <Text style={styles.time}>{timeText}</Text>
          {/* Barra sutil interior que se reduce con el tiempo */}
          <View style={styles.innerBarTrack}>
            <View
              style={[
                styles.innerBarFill,
                {
                  width: `${Math.round(clampedProgress * 100)}%`,
                  backgroundColor: progressColor,
                },
              ]}
            />
          </View>
        </View>
      </View>

      <Text style={styles.status}>{getStatusLabel(status)}</Text>
    </View>
  );
}

function getStatusLabel(status: SessionStatus): string {
  switch (status) {
    case "running":
      return "En curso";
    case "paused":
      return "Pausado";
    case "finished":
      return "Finalizado";
    default:
      return "Detenido";
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 20,
  },
  phase: {
    backgroundColor: theme.colors.gold,
    borderRadius: 20,
    color: theme.colors.navyBrand,
    fontSize: 18,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  breakPhase: {
    backgroundColor: theme.colors.slate,
    color: theme.colors.inkDark,
  },
  clockContainer: {
    alignItems: "center",
    height: 280,
    justifyContent: "center",
    position: "relative",
    width: 280,
  },
  trackRing: {
    borderColor: "rgba(118, 120, 166, 0.35)",
    borderRadius: 140,
    borderWidth: 10,
    height: 280,
    position: "absolute",
    width: 280,
  },
  halfContainerRight: {
    height: 280,
    left: 140,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    width: 140,
  },
  halfContainerLeft: {
    height: 280,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    width: 140,
  },
  progressRingCircle: {
    borderRadius: 140,
    borderWidth: 10,
    height: 280,
    position: "absolute",
    top: 0,
    width: 280,
  },
  progressRingCircleRight: {
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    left: -140,
  },
  progressRingCircleLeft: {
    borderRightColor: "transparent",
    borderTopColor: "transparent",
    left: 0,
  },
  clockCenter: {
    alignItems: "center",
    backgroundColor: theme.colors.navyBrand,
    borderRadius: 128,
    height: 256,
    justifyContent: "center",
    width: 256,
  },
  time: {
    color: theme.colors.white,
    fontSize: 62,
    fontVariant: ["tabular-nums"],
    fontWeight: "800",
  },
  innerBarTrack: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    height: 5,
    marginTop: 12,
    overflow: "hidden",
    width: 120,
  },
  innerBarFill: {
    borderRadius: 3,
    height: "100%",
  },
  status: {
    color: theme.colors.navyBrand,
    fontSize: 17,
    fontWeight: "600",
  },
});



================================================
ðŸ“„ ARCHIVO: src\components\StudyTimerControls.tsx
================================================

import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";
import type { SessionStatus } from "../types/pomodoro";

interface StudyTimerControlsProps {
  status: SessionStatus;
  hasTimeRemaining: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function StudyTimerControls({
  status,
  hasTimeRemaining,
  onStart,
  onPause,
  onReset,
}: StudyTimerControlsProps) {
  const canStart = hasTimeRemaining && (status === "stopped" || status === "paused");
  const canPause = hasTimeRemaining && status === "running";
  const actionLabel = status === "paused" ? "Reanudar" : "Iniciar";

  return (
    <View style={styles.container}>
      {canPause ? (
        <Pressable
          accessibilityLabel="Pausar"
          accessibilityRole="button"
          onPress={onPause}
          style={[styles.button, styles.pauseButton]}
        >
          <Text style={styles.pauseText}>Pausar</Text>
        </Pressable>
      ) : (
        <Pressable
          accessibilityLabel={actionLabel}
          accessibilityRole="button"
          disabled={!canStart}
          onPress={onStart}
          style={[styles.button, styles.primaryButton, !canStart && styles.disabledButton]}
        >
          <Text style={styles.primaryText}>{actionLabel}</Text>
        </Pressable>
      )}
      <Pressable
        accessibilityLabel="Reiniciar"
        accessibilityRole="button"
        onPress={onReset}
        style={[styles.button, styles.resetButton]}
      >
        <Text style={styles.resetText}>Reiniciar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    width: "100%",
  },
  button: {
    alignItems: "center",
    borderRadius: theme.spacing.buttonRadius,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: theme.colors.navyBrand,
    minHeight: 56,
  },
  pauseButton: {
    backgroundColor: theme.colors.gold,
    minHeight: 56,
  },
  resetButton: {
    backgroundColor: theme.colors.danger,
  },
  disabledButton: {
    opacity: 0.45,
  },
  primaryText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  pauseText: {
    color: theme.colors.navyBrand,
    fontSize: 18,
    fontWeight: "700",
  },
  resetText: {
    color: theme.colors.white,
    fontSize: 17,
    fontWeight: "700",
  },
});


================================================
ðŸ“„ ARCHIVO: src\constants\theme.ts
================================================

export const theme = {
  colors: {
    navyDeep: "#0A0E59",
    navyBrand: "#141759",
    slate: "#7678A6",
    gold: "#D9A714",
    white: "#FEFFFE",
    danger: "#D33724",
    inkDark: "#111111",
  },
  spacing: {
    screen: 24,
    buttonRadius: 16,
  },
} as const;


================================================
ðŸ“„ ARCHIVO: src\context\SettingsContext.test.tsx
================================================

import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { SettingsProvider, useSettings } from "./SettingsContext";
import { StudySessionProvider, useStudySession } from "./StudySessionContext";
import * as settingsStorage from "../storage/settingsStorage";
import * as sessionStorage from "../storage/sessionStorage";
import * as notifications from "../services/notificationService";
import { DEFAULT_POMODORO_SETTINGS } from "../utils/cycleSettings";
import { createInitialSession } from "../utils/session";
import type { PomodoroSettings, StudySession } from "../types/pomodoro";

jest.mock("../storage/settingsStorage");
jest.mock("../storage/sessionStorage");
jest.mock("../services/notificationService");

function SettingsProbe({ onValue }: { onValue: (value: ReturnType<typeof useSettings>) => void }) {
  onValue(useSettings());
  return null;
}

function CombinedProbe({
  onSettings,
  onSession,
}: {
  onSettings: (value: ReturnType<typeof useSettings>) => void;
  onSession: (value: ReturnType<typeof useStudySession>) => void;
}) {
  onSettings(useSettings());
  onSession(useStudySession());
  return null;
}

describe("SettingsContext orchestrator (RF-004, RF-005, RF-006, RF-007, RF-009, RF-011)", () => {
  let renderer: TestRenderer.ReactTestRenderer | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(settingsStorage.loadSettings).mockResolvedValue(DEFAULT_POMODORO_SETTINGS);
    jest.mocked(settingsStorage.saveSettings).mockResolvedValue();
    jest.mocked(sessionStorage.loadStudySession).mockResolvedValue(null);
    jest.mocked(sessionStorage.saveStudySession).mockResolvedValue();
    jest.mocked(notifications.getNotificationPermissionStatus).mockResolvedValue({
      granted: true,
      canAskAgain: true,
    });
    jest.mocked(notifications.requestNotificationPermission).mockResolvedValue({
      available: true,
    });
    jest.mocked(notifications.scheduleFinishNotification).mockResolvedValue({
      available: true,
      notificationId: "notification-id-123",
    });
    jest.mocked(notifications.dismissAllNotifications).mockResolvedValue();
    jest.mocked(notifications.addNotificationResponseListener).mockReturnValue(() => {});
  });

  afterEach(() => {
    act(() => {
      renderer?.unmount();
    });
    jest.restoreAllMocks();
  });

  it("loads stored settings on mount and exposes them (RF-005, RF-011)", async () => {
    const customSettings: PomodoroSettings = {
      studyDurationMinutes: 50,
      shortBreakMinutes: 10,
      longBreakMinutes: 20,
      cycleTarget: 4,
    };
    jest.mocked(settingsStorage.loadSettings).mockResolvedValueOnce(customSettings);

    let settingsValue!: ReturnType<typeof useSettings>;

    await act(async () => {
      renderer = TestRenderer.create(
        <SettingsProvider>
          <SettingsProbe onValue={(val) => (settingsValue = val)} />
        </SettingsProvider>,
      );
    });

    expect(settingsValue.loading).toBe(false);
    expect(settingsValue.settings).toEqual(customSettings);
  });

  it("saves new settings to storage and updates state (RF-004, RF-005)", async () => {
    let settingsValue!: ReturnType<typeof useSettings>;

    await act(async () => {
      renderer = TestRenderer.create(
        <SettingsProvider>
          <SettingsProbe onValue={(val) => (settingsValue = val)} />
        </SettingsProvider>,
      );
    });

    const newSettings: PomodoroSettings = {
      studyDurationMinutes: 45,
      shortBreakMinutes: 8,
      longBreakMinutes: 20,
      cycleTarget: 6,
    };

    await act(async () => {
      await settingsValue.saveSettings(newSettings);
    });

    expect(settingsStorage.saveSettings).toHaveBeenCalledWith(newSettings);
    expect(settingsValue.settings).toEqual(newSettings);
  });

  it("updates nominal time immediately on main screen when session is stopped in reposo (RF-006)", async () => {
    let settingsValue!: ReturnType<typeof useSettings>;
    let sessionValue!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <SettingsProvider>
            <CombinedProbe
              onSettings={(s) => (settingsValue = s)}
              onSession={(sess) => (sessionValue = sess)}
            />
          </SettingsProvider>
        </StudySessionProvider>,
      );
    });

    expect(sessionValue.session.status).toBe("stopped");
    expect(sessionValue.session.remainingSeconds).toBe(25 * 60);

    const newSettings: PomodoroSettings = {
      studyDurationMinutes: 50,
      shortBreakMinutes: 10,
      longBreakMinutes: 20,
      cycleTarget: 4,
    };

    await act(async () => {
      await settingsValue.saveSettings(newSettings);
    });

    // En reposo: se actualiza de inmediato al nuevo tiempo guardado (50 min = 3000s)
    expect(sessionValue.session.remainingSeconds).toBe(50 * 60);
    expect(sessionValue.session.initialDurationSeconds).toBe(50 * 60);
    expect(sessionStorage.saveStudySession).toHaveBeenCalledWith(
      expect.objectContaining({
        remainingSeconds: 50 * 60,
        initialDurationSeconds: 50 * 60,
      }),
    );
  });

  it("preserves active countdown intact when saving settings during running session (RF-007)", async () => {
    const now = Date.now();
    const runningSession: StudySession = {
      ...createInitialSession(1500, 300, 900, 4, now - 10_000),
      status: "running",
      remainingSeconds: 842,
      endTimestamp: now + 842_000,
      lastActiveTimestamp: now - 10_000,
    };
    jest.mocked(sessionStorage.loadStudySession).mockResolvedValueOnce(runningSession);

    let settingsValue!: ReturnType<typeof useSettings>;
    let sessionValue!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <SettingsProvider>
            <CombinedProbe
              onSettings={(s) => (settingsValue = s)}
              onSession={(sess) => (sessionValue = sess)}
            />
          </SettingsProvider>
        </StudySessionProvider>,
      );
    });

    expect(sessionValue.session.status).toBe("running");
    expect(sessionValue.session.remainingSeconds).toBe(842);

    const newSettings: PomodoroSettings = {
      studyDurationMinutes: 90,
      shortBreakMinutes: 15,
      longBreakMinutes: 30,
      cycleTarget: 4,
    };

    await act(async () => {
      await settingsValue.saveSettings(newSettings);
    });

    // En curso: conserva el conteo activo intacto
    expect(sessionValue.session.remainingSeconds).toBe(842);
    expect(sessionValue.session.status).toBe("running");
  });

  it("resets settings to default (25/5/15/4) with resetToDefaults (RF-009)", async () => {
    const customSettings: PomodoroSettings = {
      studyDurationMinutes: 60,
      shortBreakMinutes: 12,
      longBreakMinutes: 25,
      cycleTarget: 8,
    };
    jest.mocked(settingsStorage.loadSettings).mockResolvedValueOnce(customSettings);

    let settingsValue!: ReturnType<typeof useSettings>;
    let sessionValue!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <SettingsProvider>
            <CombinedProbe
              onSettings={(s) => (settingsValue = s)}
              onSession={(sess) => (sessionValue = sess)}
            />
          </SettingsProvider>
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await settingsValue.resetToDefaults();
    });

    expect(settingsStorage.saveSettings).toHaveBeenCalledWith(DEFAULT_POMODORO_SETTINGS);
    expect(settingsValue.settings).toEqual(DEFAULT_POMODORO_SETTINGS);
    expect(sessionValue.session.remainingSeconds).toBe(25 * 60);
  });

  it("retains settings in memory and exposes non-blocking warning when saveSettings fails (RF-007, Decisión 4)", async () => {
    jest.mocked(settingsStorage.saveSettings).mockRejectedValueOnce(new Error("Disk full error"));

    let settingsValue!: ReturnType<typeof useSettings>;
    let sessionValue!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <SettingsProvider>
            <CombinedProbe
              onSettings={(s) => (settingsValue = s)}
              onSession={(sess) => (sessionValue = sess)}
            />
          </SettingsProvider>
        </StudySessionProvider>,
      );
    });

    const newSettings: PomodoroSettings = {
      studyDurationMinutes: 40,
      shortBreakMinutes: 8,
      longBreakMinutes: 18,
      cycleTarget: 5,
    };

    await act(async () => {
      await settingsValue.saveSettings(newSettings);
    });

    // Se mantienen en memoria y se aplican a la sesión de estudio
    expect(settingsValue.settings).toEqual(newSettings);
    expect(sessionValue.session.remainingSeconds).toBe(40 * 60);
    expect(settingsValue.warning).toContain("memoria");
  });

  it("retains defaults in memory and exposes warning when resetToDefaults fails (RF-007)", async () => {
    const customSettings: PomodoroSettings = {
      studyDurationMinutes: 50,
      shortBreakMinutes: 10,
      longBreakMinutes: 20,
      cycleTarget: 4,
    };
    jest.mocked(settingsStorage.loadSettings).mockResolvedValueOnce(customSettings);
    jest.mocked(settingsStorage.saveSettings).mockRejectedValueOnce(new Error("Storage write failure"));

    let settingsValue!: ReturnType<typeof useSettings>;
    let sessionValue!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <SettingsProvider>
            <CombinedProbe
              onSettings={(s) => (settingsValue = s)}
              onSession={(sess) => (sessionValue = sess)}
            />
          </SettingsProvider>
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await settingsValue.resetToDefaults();
    });

    expect(settingsValue.settings).toEqual(DEFAULT_POMODORO_SETTINGS);
    expect(sessionValue.session.remainingSeconds).toBe(25 * 60);
    expect(settingsValue.warning).toContain("memoria");
  });
});


================================================
ðŸ“„ ARCHIVO: src\context\SettingsContext.tsx
================================================

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PomodoroSettings } from "../types/pomodoro";
import { DEFAULT_POMODORO_SETTINGS } from "../utils/cycleSettings";
import { loadSettings, saveSettings as saveSettingsToStorage } from "../storage/settingsStorage";
import { StudySessionContext } from "./StudySessionContext";

export interface SettingsContextValue {
  settings: PomodoroSettings;
  loading: boolean;
  warning: string | null;
  saveSettings: (newSettings: PomodoroSettings) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  clearWarning: () => void;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);

const STORAGE_WARNING_MESSAGE =
  "No se pudieron guardar los ajustes en el dispositivo. Se conservarán en memoria mientras la aplicación esté abierta.";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_POMODORO_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);
  const studySession = useContext(StudySessionContext);

  useEffect(() => {
    let mounted = true;
    void loadSettings()
      .then((loaded) => {
        if (mounted) {
          setSettings(loaded);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setSettings(DEFAULT_POMODORO_SETTINGS);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const save = async (newSettings: PomodoroSettings) => {
    try {
      await saveSettingsToStorage(newSettings);
      setWarning(null);
    } catch {
      // Degradación suave: mantener en memoria activa (RF-007, Decisión 4)
      setWarning(STORAGE_WARNING_MESSAGE);
    }
    setSettings(newSettings);
    if (studySession) {
      await studySession.applySettings(newSettings);
    }
  };

  const resetToDefaults = async () => {
    try {
      await saveSettingsToStorage(DEFAULT_POMODORO_SETTINGS);
      setWarning(null);
    } catch {
      // Degradación suave: mantener en memoria activa (RF-007, Decisión 4)
      setWarning(STORAGE_WARNING_MESSAGE);
    }
    setSettings(DEFAULT_POMODORO_SETTINGS);
    if (studySession) {
      await studySession.applySettings(DEFAULT_POMODORO_SETTINGS);
    }
  };

  const clearWarning = () => setWarning(null);

  const value = useMemo(
    () => ({
      settings,
      loading,
      warning,
      saveSettings: save,
      resetToDefaults,
      clearWarning,
    }),
    [settings, loading, warning, studySession],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings debe usarse dentro de SettingsProvider.");
  }
  return context;
}


================================================
ðŸ“„ ARCHIVO: src\context\StudySessionContext.test.tsx
================================================

import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { AppState } from "react-native";
import { StudySessionProvider, useStudySession } from "./StudySessionContext";
import { createInitialSession } from "../utils/session";
import * as storage from "../storage/sessionStorage";
import * as notifications from "../services/notificationService";
import type { StudySession } from "../types/pomodoro";

jest.mock("../storage/sessionStorage", () => {
  const actual = jest.requireActual("../storage/sessionStorage");
  return {
    ...actual,
    loadStudySession: jest.fn(),
    saveStudySession: jest.fn(),
  };
});
jest.mock("../services/notificationService");

function Probe({ onValue }: { onValue: (value: ReturnType<typeof useStudySession>) => void }) {
  onValue(useStudySession());
  return null;
}

describe("StudySessionContext orchestrator", () => {
  let renderer: TestRenderer.ReactTestRenderer | undefined;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.spyOn(Date, "now").mockReturnValue(100_000);
    jest.mocked(storage.loadStudySession).mockResolvedValue(null);
    jest.mocked(storage.saveStudySession).mockResolvedValue();
    jest.mocked(notifications.requestNotificationPermission).mockResolvedValue({
      available: true,
    });
    jest.mocked(notifications.scheduleFinishNotification).mockResolvedValue({
      available: true,
      notificationId: "notification-id-123",
    });
    jest.mocked(notifications.cancelFinishNotification).mockResolvedValue({
      available: true,
    });
    jest.mocked(notifications.dismissAllNotifications).mockResolvedValue();
    jest.mocked(notifications.startAlarmVibration).mockReturnValue();
    jest.mocked(notifications.stopAlarmVibration).mockReturnValue();
    jest.mocked(notifications.playAlarmWithFallback).mockResolvedValue({
      audioPlayed: false,
      vibrationStarted: true,
    });
    jest.mocked(notifications.addNotificationResponseListener).mockReturnValue(() => {});
    jest.mocked(notifications.getNotificationPermissionStatus).mockResolvedValue({
      granted: true,
      canAskAgain: true,
    });
    jest.mocked(notifications.openNotificationSettings).mockResolvedValue();
  });

  afterEach(() => {
    act(() => {
      renderer?.unmount();
    });
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("dismisses system notifications upon mount", async () => {
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={() => {}} />
        </StudySessionProvider>,
      );
    });

    expect(notifications.dismissAllNotifications).toHaveBeenCalled();
  });

  it("restores a saved paused session intact within 24 hours (RF-005)", async () => {
    const saved: StudySession = {
      ...createInitialSession(1500, 300, 900, 4, 90_000),
      status: "paused",
      remainingSeconds: 900,
      notificationId: null,
      lastActiveTimestamp: 90_000,
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(saved);
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.session).toMatchObject({
      status: "paused",
      remainingSeconds: 900,
    });
    expect(notifications.scheduleFinishNotification).not.toHaveBeenCalled();
  });

  it("restores running session with remaining time and reschedules notification (RF-002, RF-011)", async () => {
    const current = 100_000;
    const saved: StudySession = {
      ...createInitialSession(1500, 300, 900, 4, current - 10_000),
      status: "running",
      endTimestamp: current + 400_000, // 400s left
      notificationId: "old-notif-id",
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(saved);
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.session.status).toBe("running");
    expect(value.session.remainingSeconds).toBe(400);
    expect(notifications.scheduleFinishNotification).toHaveBeenCalledWith(
      saved.endTimestamp,
      saved.phase,
    );
    expect(storage.saveStudySession).toHaveBeenCalled();
  });

  it("handles phase completed in absence when reopening within 24h (RF-004)", async () => {
    const current = 100_000;
    const saved: StudySession = {
      ...createInitialSession(1500, 300, 900, 4, current - 1_600_000),
      status: "running",
      endTimestamp: current - 100_000, // Ended in the past
      notificationId: "notif-done",
      completedPomodoros: 0,
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(saved);
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.session.phase).toBe("shortBreak");
    expect(value.session.status).toBe("stopped");
    expect(value.session.completedPomodoros).toBe(1);
    expect(value.session.remainingSeconds).toBe(300);
    expect(value.info).toBe("La fase anterior terminó mientras la aplicación no estaba activa.");
    expect(storage.saveStudySession).toHaveBeenCalledWith(
      expect.objectContaining({ phase: "shortBreak", status: "stopped", completedPomodoros: 1 }),
    );
  });

  it("expires cycle after > 24 hours of inactivity (RF-008, RF-009)", async () => {
    const current = 100_000_000;
    jest.spyOn(Date, "now").mockReturnValue(current);
    const TWENTY_FIVE_HOURS = 25 * 60 * 60 * 1000;

    const saved: StudySession = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running",
      endTimestamp: current - TWENTY_FIVE_HOURS,
      completedPomodoros: 2,
      notificationId: "notif-expired",
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(saved);
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.session.phase).toBe("study");
    expect(value.session.status).toBe("stopped");
    expect(value.session.completedPomodoros).toBe(0);
    expect(value.session.remainingSeconds).toBe(1500);
    expect(value.info).toBe(
      "El ciclo anterior expiró por inactividad (más de 24 horas). Se inició un nuevo ciclo de estudio.",
    );
  });

  it("detects clock moved backwards and sets warning (RF-007)", async () => {
    const current = 100_000;
    const saved: StudySession = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running",
      initialDurationSeconds: 1500,
      endTimestamp: current + 2_500_000, // 2500s > 1500s initial
      notificationId: "notif-clock",
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(saved);
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.session.remainingSeconds).toBe(1500);
    expect(value.warning).toBe(
      "Se detectó un cambio en el reloj del dispositivo. El tiempo restante se ajustó al máximo de la fase.",
    );
  });

  it("handles corrupt data by setting clear error and restoring clean session (RF-012)", async () => {
    jest
      .mocked(storage.loadStudySession)
      .mockRejectedValue(new storage.StorageError("invalid", "datos corruptos"));
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.session.phase).toBe("study");
    expect(value.session.status).toBe("stopped");
    expect(value.session.completedPomodoros).toBe(0);
    expect(value.error).toBe(
      "No se pudo recuperar la sesión anterior: los datos guardados no eran válidos. Se inició una nueva sesión.",
    );
    expect(storage.saveStudySession).toHaveBeenCalled();
  });

  it("cancels exact notification when pausing a restored running session (RF-006)", async () => {
    const current = 100_000;
    const saved: StudySession = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running",
      endTimestamp: current + 500_000,
      notificationId: "specific-notif-777",
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(saved);
    let value!: ReturnType<typeof useStudySession>;

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await value.pause();
    });

    expect(value.session.status).toBe("paused");
    expect(value.session.notificationId).toBeNull();
    expect(notifications.cancelFinishNotification).toHaveBeenCalledWith("notification-id-123");
  });

  it("cancels exact notification on confirmed reset (RF-006)", async () => {
    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await value.start();
    });

    await act(async () => {
      await value.reset(true);
    });

    expect(value.session.status).toBe("stopped");
    expect(notifications.cancelFinishNotification).toHaveBeenCalledWith("notification-id-123");
  });

  it("handles AppState active event by synchronizing and dismissing notifications (RF-001, RF-010)", async () => {
    let appStateCallback!: (state: string) => void;
    jest.spyOn(AppState, "addEventListener").mockImplementation((_, handler) => {
      appStateCallback = handler as any;
      return { remove: jest.fn() } as any;
    });

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={() => {}} />
        </StudySessionProvider>,
      );
    });

    jest.mocked(notifications.dismissAllNotifications).mockClear();

    await act(async () => {
      appStateCallback("active");
    });

    expect(notifications.dismissAllNotifications).toHaveBeenCalled();
  });

  it("activates alarm, starts vibration and prepares next phase when running countdown hits zero (RF-004, RF-008)", async () => {
    let value!: ReturnType<typeof useStudySession>;
    const runningSession: StudySession = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running",
      endTimestamp: 100_000 + 1000, // 1s left
      notificationId: "alarm-id",
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(runningSession);

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    // Advance time by 1s
    jest.spyOn(Date, "now").mockReturnValue(100_000 + 1000);

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(value.isAlarmActive).toBe(true);
    expect(value.alarmPhase).toBe("study");
    expect(notifications.startAlarmVibration).toHaveBeenCalled();
    expect(value.session.status).toBe("stopped");
    expect(value.session.phase).toBe("shortBreak");
  });

  it("silences alarm, stops vibration and dismisses notification when calling stopAlarm() (RF-009)", async () => {
    let value!: ReturnType<typeof useStudySession>;
    const runningSession: StudySession = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running",
      endTimestamp: 100_000 + 1000,
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(runningSession);

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    jest.spyOn(Date, "now").mockReturnValue(100_000 + 1000);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(value.isAlarmActive).toBe(true);

    await act(async () => {
      value.stopAlarm();
    });

    expect(value.isAlarmActive).toBe(false);
    expect(notifications.stopAlarmVibration).toHaveBeenCalled();
    expect(notifications.dismissAllNotifications).toHaveBeenCalled();
  });

  it("automatically cuts off alarm after 60 seconds (RF-007)", async () => {
    let value!: ReturnType<typeof useStudySession>;
    const runningSession: StudySession = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running",
      endTimestamp: 100_000 + 1000,
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(runningSession);

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    // Finish phase at 101_000
    jest.spyOn(Date, "now").mockReturnValue(101_000);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(value.isAlarmActive).toBe(true);

    // Advance 60 seconds of alarm
    jest.spyOn(Date, "now").mockReturnValue(101_000 + 60_000);
    await act(async () => {
      jest.advanceTimersByTime(60_000);
    });

    expect(value.isAlarmActive).toBe(false);
    expect(notifications.stopAlarmVibration).toHaveBeenCalled();
  });

  it("silences alarm on remote 'stop' notification action (RF-010)", async () => {
    let responseHandler!: (action: "stop" | "open") => void;
    jest
      .mocked(notifications.addNotificationResponseListener)
      .mockImplementation((handler) => {
        responseHandler = handler;
        return () => {};
      });

    let value!: ReturnType<typeof useStudySession>;
    const runningSession: StudySession = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running",
      endTimestamp: 100_000 + 1000,
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(runningSession);

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    jest.spyOn(Date, "now").mockReturnValue(101_000);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(value.isAlarmActive).toBe(true);

    await act(async () => {
      responseHandler("stop");
    });

    expect(value.isAlarmActive).toBe(false);
    expect(notifications.stopAlarmVibration).toHaveBeenCalled();
  });

  it("silences alarm on notification body tap 'open' (RF-011)", async () => {
    let responseHandler!: (action: "stop" | "open") => void;
    jest
      .mocked(notifications.addNotificationResponseListener)
      .mockImplementation((handler) => {
        responseHandler = handler;
        return () => {};
      });

    let value!: ReturnType<typeof useStudySession>;
    const runningSession: StudySession = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running",
      endTimestamp: 100_000 + 1000,
    };
    jest.mocked(storage.loadStudySession).mockResolvedValue(runningSession);

    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    jest.spyOn(Date, "now").mockReturnValue(101_000);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(value.isAlarmActive).toBe(true);

    await act(async () => {
      responseHandler("open");
    });

    expect(value.isAlarmActive).toBe(false);
    expect(notifications.stopAlarmVibration).toHaveBeenCalled();
  });

  it("presents permission explanatory modal when starting timer for the first time without permission (RF-001)", async () => {
    jest.mocked(notifications.getNotificationPermissionStatus).mockResolvedValue({
      granted: false,
      canAskAgain: true,
    });

    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.isPermissionModalVisible).toBe(false);

    await act(async () => {
      await value.start();
    });

    expect(value.isPermissionModalVisible).toBe(true);
    expect(value.session.status).toBe("stopped");
    expect(notifications.scheduleFinishNotification).not.toHaveBeenCalled();
  });

  it("starts session and schedules notification when user confirms permission modal with granted permission (RF-001, RF-002)", async () => {
    jest.mocked(notifications.getNotificationPermissionStatus).mockResolvedValue({
      granted: false,
      canAskAgain: true,
    });
    jest.mocked(notifications.requestNotificationPermission).mockResolvedValue({
      available: true,
    });

    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await value.start();
    });
    expect(value.isPermissionModalVisible).toBe(true);

    await act(async () => {
      await value.confirmPermissionModal();
    });

    expect(value.isPermissionModalVisible).toBe(false);
    expect(value.session.status).toBe("running");
    expect(notifications.scheduleFinishNotification).toHaveBeenCalled();
    expect(value.warning).toBeNull();
  });

  it("starts session anyway and sets visible non-blocking warning when permission is denied in modal (RF-002)", async () => {
    jest.mocked(notifications.getNotificationPermissionStatus).mockResolvedValue({
      granted: false,
      canAskAgain: true,
    });
    jest.mocked(notifications.requestNotificationPermission).mockResolvedValue({
      available: false,
      warning: "El aviso de fin no está disponible.",
    });

    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await value.start();
    });
    expect(value.isPermissionModalVisible).toBe(true);

    await act(async () => {
      await value.confirmPermissionModal();
    });

    expect(value.isPermissionModalVisible).toBe(false);
    expect(value.session.status).toBe("running");
    expect(value.warning).toContain("No recibirás avisos fuera de la app");
  });

  it("allows student to continue without permission from modal, starting session with non-blocking warning (RF-002)", async () => {
    jest.mocked(notifications.getNotificationPermissionStatus).mockResolvedValue({
      granted: false,
      canAskAgain: true,
    });

    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await value.start();
    });
    expect(value.isPermissionModalVisible).toBe(true);

    await act(async () => {
      await value.dismissPermissionModal();
    });

    expect(value.isPermissionModalVisible).toBe(false);
    expect(value.session.status).toBe("running");
    expect(value.warning).toContain("No recibirás avisos fuera de la app");
  });

  it("invokes openNotificationSettings to allow navigating to system settings (RF-003)", async () => {
    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await value.openNotificationSettings();
    });

    expect(notifications.openNotificationSettings).toHaveBeenCalledTimes(1);
  });

  it("degrades smoothly to memory and sets non-blocking warning when saveStudySession fails on start (RF-007, Decisión 4)", async () => {
    jest.mocked(storage.saveStudySession).mockRejectedValueOnce(new Error("Storage disk full"));

    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await value.start();
    });

    // Sesión debe continuar en memoria como "running", sin revertirse ni congelarse
    expect(value.session.status).toBe("running");
    expect(value.warning).toContain("memoria");
    expect(value.error).toBeNull();
  });

  it("degrades smoothly to memory when saveStudySession fails on pause (RF-007)", async () => {
    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    await act(async () => {
      await value.start();
    });
    expect(value.session.status).toBe("running");

    jest.mocked(storage.saveStudySession).mockRejectedValueOnce(new Error("Storage write failure"));

    await act(async () => {
      await value.pause();
    });

    // Sesión debe pausarse en memoria con advertencia no bloqueante
    expect(value.session.status).toBe("paused");
    expect(value.warning).toContain("memoria");
  });

  it("does not re-prompt notification permission modal on subsequent starts after user dismissed it (RF-008, Decisión 6)", async () => {
    jest.mocked(notifications.getNotificationPermissionStatus).mockResolvedValue({
      granted: false,
      canAskAgain: true,
    });

    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    // Primer inicio: abre modal
    await act(async () => {
      await value.start();
    });
    expect(value.isPermissionModalVisible).toBe(true);

    // Usuario descarta el modal para continuar sin avisos
    await act(async () => {
      await value.dismissPermissionModal();
    });
    expect(value.session.status).toBe("running");

    // Pausa la sesión
    await act(async () => {
      await value.pause();
    });
    expect(value.session.status).toBe("paused");

    // Segundo inicio: arranca directo sin volver a mostrar el modal
    await act(async () => {
      await value.start();
    });
    expect(value.isPermissionModalVisible).toBe(false);
    expect(value.session.status).toBe("running");
  });

  it("restores phase completed in absence offline and triggers alarm with safe vibration (RF-004, RF-009, Decisión 7)", async () => {
    // Sesión que expiró mientras la app estaba cerrada (now: 100_000, endTimestamp: 80_000)
    const expiredSession: StudySession = {
      ...createInitialSession(1500, 300, 900, 4, 50_000),
      status: "running",
      remainingSeconds: 0,
      endTimestamp: 80_000,
      notificationId: "old-notif-id",
      lastActiveTimestamp: 50_000,
    };
    jest.mocked(storage.loadStudySession).mockResolvedValueOnce(expiredSession);

    let value!: ReturnType<typeof useStudySession>;
    await act(async () => {
      renderer = TestRenderer.create(
        <StudySessionProvider>
          <Probe onValue={(next) => (value = next)} />
        </StudySessionProvider>,
      );
    });

    expect(value.isAlarmActive).toBe(true);
    expect(notifications.playAlarmWithFallback).toHaveBeenCalled();
  });
});


================================================
ðŸ“„ ARCHIVO: src\context\StudySessionContext.tsx
================================================

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import type { PomodoroPhase, PomodoroSettings, StudySession } from "../types/pomodoro";
import {
  addNotificationResponseListener,
  cancelFinishNotification,
  dismissAllNotifications,
  getNotificationPermissionStatus,
  openNotificationSettings,
  playAlarmWithFallback,
  requestNotificationPermission,
  scheduleFinishNotification,
  startAlarmVibration,
  stopAlarmVibration,
} from "../services/notificationService";
import { loadStudySession, saveStudySession, StorageError } from "../storage/sessionStorage";
import {
  pauseSession,
  resetSession,
  startSession,
} from "../utils/session";
import { createInitialSession } from "../utils/cycle";
import { completePhase, type PhaseDurations } from "../utils/phaseTransition";
import { evaluateSessionRecovery } from "../utils/sessionRecovery";
import { getRemainingSeconds } from "../utils/timer";
import { ALARM_TIMEOUT_MS } from "../utils/alarmMessages";

export interface StudySessionContextValue {
  session: StudySession;
  loading: boolean;
  error: string | null;
  warning: string | null;
  info: string | null;
  isAlarmActive: boolean;
  alarmPhase: PomodoroPhase | null;
  isPermissionModalVisible: boolean;
  start: () => Promise<void>;
  pause: () => Promise<void>;
  reset: (confirmed: boolean) => Promise<void>;
  stopAlarm: () => void;
  confirmPermissionModal: () => Promise<void>;
  dismissPermissionModal: () => Promise<void>;
  openNotificationSettings: () => Promise<void>;
  applySettings: (settings: PomodoroSettings) => Promise<void>;
}

export const StudySessionContext = createContext<StudySessionContextValue | null>(null);
const DEFAULT_DURATION_SECONDS = 25 * 60;
const PHASE_DURATIONS: PhaseDurations = {
  studySeconds: 25 * 60,
  shortBreakSeconds: 5 * 60,
  longBreakSeconds: 15 * 60,
};
const STORAGE_WARNING_MESSAGE =
  "No se pudieron guardar los cambios en el dispositivo. La sesión continuará en memoria mientras la aplicación esté abierta.";

export function StudySessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<StudySession>(() =>
    createInitialSession(DEFAULT_DURATION_SECONDS, 300, 900, 4, Date.now()),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [alarmPhase, setAlarmPhase] = useState<PomodoroPhase | null>(null);
  const [alarmStartedTimestamp, setAlarmStartedTimestamp] = useState<number | null>(null);
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
  const [hasDismissedPermissionModal, setHasDismissedPermissionModal] = useState(false);
  const phaseDurationsRef = useRef<PhaseDurations>(PHASE_DURATIONS);

  const stopAlarm = () => {
    setIsAlarmActive(false);
    setAlarmPhase(null);
    setAlarmStartedTimestamp(null);
    stopAlarmVibration();
    void dismissAllNotifications();
  };

  useEffect(() => {
    const unsubscribe = addNotificationResponseListener((_action) => {
      stopAlarm();
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAlarmActive || alarmStartedTimestamp === null) {
      return;
    }
    const timeout = setTimeout(() => {
      stopAlarm();
    }, ALARM_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [isAlarmActive, alarmStartedTimestamp]);

  const synchronize = async (baseSession: StudySession): Promise<StudySession> => {
    void dismissAllNotifications();
    const recovery = evaluateSessionRecovery(baseSession, Date.now(), phaseDurationsRef.current);
    let nextSession = recovery.session;

    if (recovery.anomaly === "expiredInactivity") {
      setInfo(recovery.message ?? null);
    } else if (recovery.anomaly === "phaseCompletedInAbsence") {
      setInfo(recovery.message ?? null);
      setIsAlarmActive(true);
      setAlarmPhase(baseSession.phase);
      setAlarmStartedTimestamp(Date.now());
      void playAlarmWithFallback();
    } else if (recovery.anomaly === "clockBackward") {
      setWarning(recovery.message ?? null);
    }

    if (
      recovery.rescheduledNotification &&
      nextSession.status === "running" &&
      nextSession.endTimestamp !== null
    ) {
      const permission = await requestNotificationPermission();
      if (!permission.available) {
        setWarning(permission.warning);
      } else {
        const scheduled = await scheduleFinishNotification(
          nextSession.endTimestamp,
          nextSession.phase,
        );
        if (scheduled.available) {
          nextSession = {
            ...nextSession,
            notificationId: scheduled.notificationId ?? null,
          };
        } else {
          setWarning(scheduled.warning);
        }
      }
    }

    return nextSession;
  };

  useEffect(() => {
    let mounted = true;
    void dismissAllNotifications();

    void loadStudySession()
      .then(async (saved) => {
        if (!mounted) return;
        if (saved) {
          const nextSession = await synchronize(saved);
          setSession(nextSession);
          try {
            await saveStudySession(nextSession);
          } catch {
            setWarning(STORAGE_WARNING_MESSAGE);
          }
        }
      })
      .catch(async (err: unknown) => {
        if (!mounted) return;
        const isInvalid =
          (err instanceof StorageError && err.operation === "invalid") ||
          (typeof err === "object" && err !== null && (err as { operation?: string }).operation === "invalid");

        if (isInvalid) {
          setError(
            "No se pudo recuperar la sesión anterior: los datos guardados no eran válidos. Se inició una nueva sesión.",
          );
          const clean = createInitialSession(DEFAULT_DURATION_SECONDS, 300, 900, 4, Date.now());
          setSession(clean);
          try {
            await saveStudySession(clean);
          } catch {
            setWarning(STORAGE_WARNING_MESSAGE);
          }
        } else {
          setError("No se pudo recuperar la sesión guardada.");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        void dismissAllNotifications();
        setSession((current) => {
          const recovery = evaluateSessionRecovery(current, Date.now(), phaseDurationsRef.current);
          if (recovery.anomaly === "expiredInactivity") {
            setInfo(recovery.message ?? null);
          } else if (recovery.anomaly === "phaseCompletedInAbsence") {
            setInfo(recovery.message ?? null);
            setIsAlarmActive(true);
            setAlarmPhase(current.phase);
            setAlarmStartedTimestamp(Date.now());
            void playAlarmWithFallback();
          } else if (recovery.anomaly === "clockBackward") {
            setWarning(recovery.message ?? null);
          }
          if (recovery.session !== current) {
            void saveStudySession(recovery.session).catch(() => {
              setWarning(STORAGE_WARNING_MESSAGE);
            });
          }
          return recovery.session;
        });
      }
    };
    const subscription = AppState.addEventListener("change", handleAppState);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (session.status !== "running" || session.endTimestamp === null) {
      return;
    }
    const interval = setInterval(() => {
      setSession((current) => {
        if (current.status !== "running" || current.endTimestamp === null) return current;
        const remaining = getRemainingSeconds(current.endTimestamp, Date.now());
        if (remaining === 0) {
          const completed = completePhase(
            { ...current, remainingSeconds: 0 },
            phaseDurationsRef.current,
          );
          const next = {
            ...completed,
            notificationId: null,
            lastActiveTimestamp: Date.now(),
          };
          setIsAlarmActive(true);
          setAlarmPhase(current.phase);
          setAlarmStartedTimestamp(Date.now());
          startAlarmVibration();
          void playAlarmWithFallback();
          void saveStudySession(next).catch(() => {
            setWarning(STORAGE_WARNING_MESSAGE);
          });
          return next;
        }
        return {
          ...current,
          remainingSeconds: remaining,
          lastActiveTimestamp: Date.now(),
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [session.status, session.endTimestamp]);

  const commit = async (next: StudySession): Promise<boolean> => {
    try {
      await saveStudySession(next);
      setSession(next);
      setError(null);
      return true;
    } catch {
      // Degradación suave: la sesión continúa en memoria (RF-007, Decisión 4)
      setSession(next);
      setWarning(STORAGE_WARNING_MESSAGE);
      setError(null);
      return true;
    }
  };

  const executeStart = async (allowNotification: boolean) => {
    stopAlarm();
    const syncCurrent = evaluateSessionRecovery(session, Date.now(), phaseDurationsRef.current).session;
    const next = startSession(syncCurrent, Date.now());
    if (next === session) {
      return;
    }

    next.lastActiveTimestamp = Date.now();

    let scheduledId: string | null = null;
    if (allowNotification) {
      const scheduled = await scheduleFinishNotification(
        next.endTimestamp ?? Date.now(),
        next.phase,
      );
      if (scheduled.available && scheduled.notificationId) {
        scheduledId = scheduled.notificationId;
      } else if (!scheduled.available) {
        setWarning(scheduled.warning);
      }
    }

    next.notificationId = scheduledId;
    await commit(next);
  };

  const applySettings = async (newSettings: PomodoroSettings) => {
    const updatedDurations: PhaseDurations = {
      studySeconds: newSettings.studyDurationMinutes * 60,
      shortBreakSeconds: newSettings.shortBreakMinutes * 60,
      longBreakSeconds: newSettings.longBreakMinutes * 60,
    };
    phaseDurationsRef.current = updatedDurations;

    setSession((current) => {
      if (current.status === "stopped") {
        const nominal =
          current.phase === "study"
            ? updatedDurations.studySeconds
            : current.phase === "shortBreak"
              ? updatedDurations.shortBreakSeconds
              : updatedDurations.longBreakSeconds;

        const next: StudySession = {
          ...current,
          initialDurationSeconds: nominal,
          remainingSeconds: nominal,
          cycleTarget: newSettings.cycleTarget,
          lastActiveTimestamp: Date.now(),
        };
        void saveStudySession(next);
        return next;
      }

      const next: StudySession = {
        ...current,
        cycleTarget: newSettings.cycleTarget,
        lastActiveTimestamp: Date.now(),
      };
      void saveStudySession(next);
      return next;
    });
  };

  const start = async () => {
    stopAlarm();
    if (session.status === "running") {
      return;
    }

    const permissionStatus = await getNotificationPermissionStatus();
    if (!permissionStatus.granted && !hasDismissedPermissionModal && permissionStatus.canAskAgain) {
      setIsPermissionModalVisible(true);
      return;
    }

    if (!permissionStatus.granted) {
      setWarning("No recibirás avisos fuera de la app. Puedes activarlos en los ajustes.");
      await executeStart(false);
    } else {
      await executeStart(true);
    }
  };

  const confirmPermissionModal = async () => {
    setIsPermissionModalVisible(false);
    setHasDismissedPermissionModal(true);
    const permission = await requestNotificationPermission();
    if (permission.available) {
      setWarning(null);
      await executeStart(true);
    } else {
      setWarning("No recibirás avisos fuera de la app. Puedes activarlos en los ajustes.");
      await executeStart(false);
    }
  };

  const dismissPermissionModal = async () => {
    setIsPermissionModalVisible(false);
    setHasDismissedPermissionModal(true);
    setWarning("No recibirás avisos fuera de la app. Puedes activarlos en los ajustes.");
    await executeStart(false);
  };

  const handleOpenNotificationSettings = async () => {
    await openNotificationSettings();
  };

  const pause = async () => {
    stopAlarm();
    if (session.status !== "running") {
      return;
    }
    const idToCancel = session.notificationId;
    const next = pauseSession(session, Date.now());
    next.notificationId = null;
    next.lastActiveTimestamp = Date.now();
    if (!(await commit(next))) {
      return;
    }

    if (idToCancel !== null) {
      const result = await cancelFinishNotification(idToCancel);
      if (!result.available) {
        setWarning(result.warning);
      }
    }
  };

  const reset = async (confirmed: boolean) => {
    if (!confirmed) {
      return;
    }
    stopAlarm();
    const idToCancel = session.notificationId;
    const next = resetSession(session, true);
    next.notificationId = null;
    next.lastActiveTimestamp = Date.now();
    if (await commit(next)) {
      if (idToCancel !== null) {
        const result = await cancelFinishNotification(idToCancel);
        if (!result.available) {
          setWarning(result.warning);
        }
      }
    }
  };

  const value = useMemo(
    () => ({
      session,
      loading,
      error,
      warning,
      info,
      isAlarmActive,
      alarmPhase,
      isPermissionModalVisible,
      start,
      pause,
      reset,
      stopAlarm,
      confirmPermissionModal,
      dismissPermissionModal,
      openNotificationSettings: handleOpenNotificationSettings,
      applySettings,
    }),
    [
      session,
      loading,
      error,
      warning,
      info,
      isAlarmActive,
      alarmPhase,
      isPermissionModalVisible,
      start,
      pause,
      reset,
      confirmPermissionModal,
      dismissPermissionModal,
      handleOpenNotificationSettings,
      applySettings,
    ],
  );

  return <StudySessionContext.Provider value={value}>{children}</StudySessionContext.Provider>;
}

export function useStudySession(): StudySessionContextValue {
  const value = useContext(StudySessionContext);
  if (value === null) {
    throw new Error("useStudySession debe usarse dentro de StudySessionProvider.");
  }
  return value;
}


================================================
ðŸ“„ ARCHIVO: src\services\notificationService.test.ts
================================================

import * as Notifications from "expo-notifications";
import { Linking, Platform, Vibration } from "react-native";
import {
  addNotificationResponseListener,
  ALARM_CATEGORY,
  ALARM_VIBRATION_PATTERN,
  cancelFinishNotification,
  dismissAllNotifications,
  getNotificationPermissionStatus,
  openNotificationSettings,
  playAlarmWithFallback,
  requestNotificationPermission,
  scheduleFinishNotification,
  startAlarmVibration,
  stopAlarmVibration,
} from "./notificationService";

jest.mock("expo-notifications", () => ({
  AndroidImportance: { MAX: 5 },
  AndroidAudioUsage: { ALARM: 4 },
  AndroidAudioContentType: { SONIFICATION: 4 },
  AndroidNotificationVisibility: { PUBLIC: 1 },
  SchedulableTriggerInputTypes: { DATE: "date" },
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  setNotificationCategoryAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  dismissAllNotificationsAsync: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
}));

describe("notification service with alarm channel and interactive actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (Notifications.setNotificationChannelAsync as jest.Mock).mockResolvedValue(null);
    (Notifications.setNotificationCategoryAsync as jest.Mock).mockResolvedValue(null);
    (Notifications.dismissAllNotificationsAsync as jest.Mock).mockResolvedValue(null);
    jest.spyOn(Vibration, "vibrate").mockImplementation(() => {});
    jest.spyOn(Vibration, "cancel").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("configures android channel with ALARM usage and rhythmic vibration (RF-004, RF-005)", async () => {
    Platform.OS = "android";
    await requestNotificationPermission();

    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: ALARM_VIBRATION_PATTERN,
        audioAttributes: expect.objectContaining({
          usage: Notifications.AndroidAudioUsage.ALARM,
        }),
      }),
    );
  });

  it("configures interactive category with 'Detener' action (RF-010)", async () => {
    await requestNotificationPermission();

    expect(Notifications.setNotificationCategoryAsync).toHaveBeenCalledWith(
      ALARM_CATEGORY,
      expect.arrayContaining([
        expect.objectContaining({
          identifier: "STOP_ALARM",
          buttonTitle: "Detener",
          options: expect.objectContaining({ opensAppToForeground: false }),
        }),
      ]),
    );
  });

  it("schedules alarm notification with specific content and category (RF-006, RF-010)", async () => {
    (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue("alarm-notif-1");

    const result = await scheduleFinishNotification(120_000, "study", "shortBreak", 5);

    expect(result).toEqual({
      available: true,
      notificationId: "alarm-notif-1",
    });
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: "¡Estudio terminado!",
          body: "Bien hecho. Listo para descanso corto (5 min)",
          categoryIdentifier: ALARM_CATEGORY,
        }),
      }),
    );
  });

  it("controls rhythmic alarm vibration and cancellation (RF-004, RF-009)", () => {
    startAlarmVibration();
    expect(Vibration.vibrate).toHaveBeenCalledWith(ALARM_VIBRATION_PATTERN, true);

    stopAlarmVibration();
    expect(Vibration.cancel).toHaveBeenCalled();
  });

  it("safely handles platforms or devices without vibration hardware (RF-012)", () => {
    jest.spyOn(Vibration, "vibrate").mockImplementationOnce(() => {
      throw new Error("No vibration hardware");
    });
    expect(() => startAlarmVibration()).not.toThrow();

    jest.spyOn(Vibration, "cancel").mockImplementationOnce(() => {
      throw new Error("Cancel failed");
    });
    expect(() => stopAlarmVibration()).not.toThrow();
  });

  it("triggers vibration fallback safely when audio playback fails or is unavailable (RF-003, RF-004, Decisión 3)", async () => {
    const failingAudio = jest.fn().mockRejectedValue(new Error("Audio device error or muted"));
    const result = await playAlarmWithFallback(failingAudio);

    expect(Vibration.vibrate).toHaveBeenCalledWith(ALARM_VIBRATION_PATTERN, true);
    expect(result).toEqual({ audioPlayed: false, vibrationStarted: true });
  });

  it("triggers both vibration and audio successfully when audio is working", async () => {
    const successAudio = jest.fn().mockResolvedValue(undefined);
    const result = await playAlarmWithFallback(successAudio);

    expect(Vibration.vibrate).toHaveBeenCalledWith(ALARM_VIBRATION_PATTERN, true);
    expect(result).toEqual({ audioPlayed: true, vibrationStarted: true });
  });

  it("operates gracefully if audio is omitted and only vibration is available", async () => {
    const result = await playAlarmWithFallback();

    expect(Vibration.vibrate).toHaveBeenCalledWith(ALARM_VIBRATION_PATTERN, true);
    expect(result).toEqual({ audioPlayed: false, vibrationStarted: true });
  });

  it("dispatches 'stop' action when user taps 'Detener' on notification (RF-010)", () => {
    let listenerCallback!: (response: any) => void;
    (Notifications.addNotificationResponseReceivedListener as jest.Mock).mockImplementation(
      (handler) => {
        listenerCallback = handler;
        return { remove: jest.fn() };
      },
    );

    const onAction = jest.fn();
    const unsubscribe = addNotificationResponseListener(onAction);

    listenerCallback({
      actionIdentifier: "STOP_ALARM",
    });

    expect(onAction).toHaveBeenCalledWith("stop");
    unsubscribe();
  });

  it("dispatches 'open' action when user taps notification body (RF-011)", () => {
    let listenerCallback!: (response: any) => void;
    (Notifications.addNotificationResponseReceivedListener as jest.Mock).mockImplementation(
      (handler) => {
        listenerCallback = handler;
        return { remove: jest.fn() };
      },
    );

    const onAction = jest.fn();
    const unsubscribe = addNotificationResponseListener(onAction);

    listenerCallback({
      actionIdentifier: "DEFAULT",
    });

    expect(onAction).toHaveBeenCalledWith("open");
    unsubscribe();
  });

  it("dismisses all notifications from system drawer (RF-009, RF-010)", async () => {
    (Notifications.dismissAllNotificationsAsync as jest.Mock).mockResolvedValue(null);
    await expect(dismissAllNotifications()).resolves.toBeUndefined();
    expect(Notifications.dismissAllNotificationsAsync).toHaveBeenCalledTimes(1);
  });

  it("cancels exact notification when notificationId is provided", async () => {
    (Notifications.cancelScheduledNotificationAsync as jest.Mock).mockResolvedValue(null);
    await expect(cancelFinishNotification("test-notif-id")).resolves.toEqual({
      available: true,
    });
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith("test-notif-id");
  });

  it("checks notification permission status (RF-001, RF-003)", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      status: "granted",
      canAskAgain: true,
    });
    await expect(getNotificationPermissionStatus()).resolves.toEqual({
      granted: true,
      canAskAgain: true,
    });

    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      status: "denied",
      canAskAgain: false,
    });
    await expect(getNotificationPermissionStatus()).resolves.toEqual({
      granted: false,
      canAskAgain: false,
    });
  });

  it("opens application notification settings safely (RF-003)", async () => {
    const openSettingsSpy = jest.spyOn(Linking, "openSettings").mockResolvedValue();
    await openNotificationSettings();
    expect(openSettingsSpy).toHaveBeenCalledTimes(1);

    openSettingsSpy.mockRejectedValueOnce(new Error("Cannot open settings"));
    await expect(openNotificationSettings()).resolves.toBeUndefined();
  });
});


================================================
ðŸ“„ ARCHIVO: src\services\notificationService.ts
================================================

import { Linking, Platform, Vibration } from "react-native";
import type { PomodoroPhase } from "../types/pomodoro";
import { getAlarmNotificationContent } from "../utils/alarmMessages";

const CHANNEL_ID = "pomodoro-alarm";
export const ALARM_CATEGORY = "pomodoro-alarm-category";
export const ALARM_VIBRATION_PATTERN = [0, 500, 250, 500, 250, 500];

type NotificationResult =
  | { available: true }
  | { available: false; warning: string };

type NotificationsModule = typeof import("expo-notifications");

function loadNotifications(): NotificationsModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("expo-notifications") as NotificationsModule;
  } catch {
    return null;
  }
}

export async function requestNotificationPermission(): Promise<NotificationResult> {
  const Notifications = loadNotifications();
  if (Notifications === null) {
    return {
      available: false,
      warning: "Los avisos no están disponibles en este entorno.",
    };
  }

  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: "Alarma de fin de fase",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: ALARM_VIBRATION_PATTERN,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        audioAttributes: {
          usage: Notifications.AndroidAudioUsage.ALARM,
          contentType: Notifications.AndroidAudioContentType.SONIFICATION,
        },
      });
    }

    await Notifications.setNotificationCategoryAsync(ALARM_CATEGORY, [
      {
        identifier: "STOP_ALARM",
        buttonTitle: "Detener",
        options: {
          opensAppToForeground: false,
        },
      },
    ]);

    const current = await Notifications.getPermissionsAsync();
    const permission =
      current.status === "granted"
        ? current
        : await Notifications.requestPermissionsAsync();

    return permission.status === "granted"
      ? { available: true }
      : { available: false, warning: "El aviso de fin no está disponible." };
  } catch {
    return {
      available: false,
      warning: "No se pudo comprobar el aviso de fin.",
    };
  }
}

export async function scheduleFinishNotification(
  endTimestamp: number,
  phase: PomodoroPhase = "study",
  nextPhase?: PomodoroPhase,
  nextDurationMinutes?: number,
): Promise<NotificationResult & { notificationId?: string }> {
  const Notifications = loadNotifications();
  if (Notifications === null) {
    return {
      available: false,
      warning: "Los avisos no están disponibles en este entorno.",
    };
  }

  const permission = await requestNotificationPermission();
  if (!permission.available) {
    return permission;
  }

  try {
    const determinedNextPhase: PomodoroPhase =
      nextPhase ?? (phase === "study" ? "shortBreak" : "study");
    const determinedMinutes: number =
      nextDurationMinutes ?? (determinedNextPhase === "longBreak" ? 15 : determinedNextPhase === "shortBreak" ? 5 : 25);
    const content = getAlarmNotificationContent(phase, determinedNextPhase, determinedMinutes);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: content.title,
        body: content.body,
        sound: "default",
        categoryIdentifier: ALARM_CATEGORY,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(endTimestamp),
        channelId: CHANNEL_ID,
      },
    });
    return { available: true, notificationId };
  } catch {
    return {
      available: false,
      warning: "No se pudo programar el aviso de fin.",
    };
  }
}

export async function cancelFinishNotification(
  notificationId: string | null,
): Promise<NotificationResult> {
  if (notificationId === null) {
    return { available: true };
  }

  const Notifications = loadNotifications();
  if (Notifications === null) {
    return {
      available: false,
      warning: "Los avisos no están disponibles en este entorno.",
    };
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    return { available: true };
  } catch {
    return {
      available: false,
      warning: "No se pudo cancelar el aviso de fin.",
    };
  }
}

export async function dismissAllNotifications(): Promise<void> {
  const Notifications = loadNotifications();
  if (Notifications === null) {
    return;
  }

  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch {
    // Manejo silencioso seguro ante plataformas o entornos sin soporte
  }
}

export function startAlarmVibration(): void {
  try {
    Vibration.vibrate(ALARM_VIBRATION_PATTERN, true);
  } catch {
    // Tolerante ante dispositivos sin hardware de vibración (RF-012)
  }
}

export function stopAlarmVibration(): void {
  try {
    Vibration.cancel();
  } catch {
    // Tolerante ante fallos
  }
}

export async function playAlarmWithFallback(
  playAudioFn?: () => Promise<void> | void,
): Promise<{ audioPlayed: boolean; vibrationStarted: boolean }> {
  let vibrationStarted = false;
  let audioPlayed = false;

  try {
    startAlarmVibration();
    vibrationStarted = true;
  } catch {
    // Tolerante ante hardware sin vibración
  }

  if (playAudioFn) {
    try {
      await playAudioFn();
      audioPlayed = true;
    } catch {
      // Respaldo por vibración ante ausencia o fallo de audio (RF-003, RF-004, Decisión 3)
    }
  }

  return { audioPlayed, vibrationStarted };
}

export function addNotificationResponseListener(
  callback: (action: "stop" | "open") => void,
): () => void {
  const Notifications = loadNotifications();
  if (Notifications === null) {
    return () => {};
  }

  try {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (response.actionIdentifier === "STOP_ALARM") {
          callback("stop");
        } else {
          callback("open");
        }
      },
    );
    return () => {
      subscription.remove();
    };
  } catch {
    return () => {};
  }
}

export async function getNotificationPermissionStatus(): Promise<{
  granted: boolean;
  canAskAgain: boolean;
}> {
  const Notifications = loadNotifications();
  if (Notifications === null) {
    return { granted: false, canAskAgain: false };
  }

  try {
    const current = await Notifications.getPermissionsAsync();
    return {
      granted: current.status === "granted",
      canAskAgain: current.canAskAgain ?? (current.status !== "denied"),
    };
  } catch {
    return { granted: false, canAskAgain: false };
  }
}

export async function openNotificationSettings(): Promise<void> {
  try {
    await Linking.openSettings();
  } catch {
    // Tolerante ante fallos
  }
}


================================================
ðŸ“„ ARCHIVO: src\storage\sessionStorage.test.ts
================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StudySession } from "../types/pomodoro";
import { createInitialSession } from "../utils/session";
import {
  loadStudySession,
  saveStudySession,
  StorageError,
} from "./sessionStorage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

describe("study session storage v3", () => {
  beforeEach(() => jest.clearAllMocks());

  it("saves and loads the approved versioned contract (version 3)", async () => {
    const session = createInitialSession(1500);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ version: 3, session }),
    );

    await saveStudySession(session);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "pomodoro.activeSession",
      JSON.stringify({ version: 3, session }),
    );
    await expect(loadStudySession()).resolves.toEqual(session);
  });

  it("returns null when no session exists", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    await expect(loadStudySession()).resolves.toBeNull();
  });

  it("migrates a valid version 1 session to version 3", async () => {
    const legacy = {
      phase: "study",
      status: "paused",
      initialDurationSeconds: 1500,
      remainingSeconds: 900,
      endTimestamp: null,
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ version: 1, session: legacy }),
    );

    await expect(loadStudySession()).resolves.toMatchObject({
      version: 3,
      phase: "study",
      status: "paused",
      initialDurationSeconds: 1500,
      remainingSeconds: 900,
      completedPomodoros: 0,
      cycleTarget: 4,
      notificationId: null,
    });
  });

  it("migrates a valid version 2 session to version 3", async () => {
    const legacyV2 = {
      version: 2,
      phase: "shortBreak",
      status: "paused",
      initialDurationSeconds: 300,
      remainingSeconds: 150,
      endTimestamp: null,
      completedPomodoros: 2,
      cycleTarget: 4,
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ version: 2, session: legacyV2 }),
    );

    await expect(loadStudySession()).resolves.toMatchObject({
      version: 3,
      phase: "shortBreak",
      status: "paused",
      initialDurationSeconds: 300,
      remainingSeconds: 150,
      completedPomodoros: 2,
      cycleTarget: 4,
      notificationId: null,
    });
  });

  it("rejects unknown versions and corrupt sessions explicitly", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ version: 99, session: {} }),
    );
    await expect(loadStudySession()).rejects.toMatchObject({ operation: "invalid" });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("invalid json string");
    await expect(loadStudySession()).rejects.toMatchObject({ operation: "invalid" });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({
        version: 3,
        session: {
          version: 3,
          phase: "invalid-phase",
        },
      }),
    );
    await expect(loadStudySession()).rejects.toMatchObject({ operation: "invalid" });
  });

  it("restores a prepared phase without consuming its duration", async () => {
    const prepared = {
      ...createInitialSession(1500, 300, 900, 4),
      phase: "shortBreak" as const,
      initialDurationSeconds: 300,
      remainingSeconds: 300,
      completedPomodoros: 1,
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ version: 3, session: prepared }),
    );

    await expect(loadStudySession()).resolves.toEqual(prepared);
  });

  it("exposes differentiated read and write errors", async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error("read"));
    await expect(loadStudySession()).rejects.toMatchObject({
      operation: "read",
    });

    (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error("write"));
    await expect(saveStudySession(createInitialSession(1500))).rejects.toMatchObject({
      operation: "write",
    });
    expect(new StorageError("read", "x")).toBeInstanceOf(Error);
  });

  it("restricts persisted session strictly to approved v3 fields without telemetry or user IDs (RF-006, RNF-003)", async () => {
    const rawSessionWithExtras = {
      ...createInitialSession(1500),
      userId: "cotopaxi-student-001",
      email: "student@cotopaxi.edu",
      trackingId: "analytics-xyz",
    } as unknown as StudySession;

    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);

    await saveStudySession(rawSessionWithExtras);

    const callArg = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
    const parsed = JSON.parse(callArg);

    expect(parsed.session).not.toHaveProperty("userId");
    expect(parsed.session).not.toHaveProperty("email");
    expect(parsed.session).not.toHaveProperty("trackingId");
    expect(parsed.session).toHaveProperty("version", 3);
    expect(parsed.session).toHaveProperty("phase", "study");
  });
});


================================================
ðŸ“„ ARCHIVO: src\storage\sessionStorage.ts
================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PomodoroPhase, SessionStatus, StudySession } from "../types/pomodoro";

const SESSION_KEY = "pomodoro.activeSession";
const STORAGE_VERSION = 3;

export class StorageError extends Error {
  constructor(
    public readonly operation: "read" | "write" | "invalid",
    message: string,
  ) {
    super(message);
    this.name = "StorageError";
  }
}

interface StoredSession {
  version: 3;
  session: StudySession;
}

function isValidSession(session: unknown): session is StudySession {
  if (typeof session !== "object" || session === null) return false;
  const value = session as Partial<StudySession>;
  const completedPomodoros = value.completedPomodoros;
  const cycleTarget = value.cycleTarget;
  return (
    value.version === 3 &&
    ["study", "shortBreak", "longBreak"].includes(value.phase ?? "") &&
    ["stopped", "running", "paused", "finished"].includes(value.status ?? "") &&
    typeof value.initialDurationSeconds === "number" &&
    value.initialDurationSeconds > 0 &&
    typeof value.remainingSeconds === "number" &&
    value.remainingSeconds >= 0 &&
    (typeof value.endTimestamp === "number" || value.endTimestamp === null) &&
    typeof completedPomodoros === "number" &&
    typeof cycleTarget === "number" &&
    Number.isInteger(completedPomodoros) &&
    Number.isInteger(cycleTarget) &&
    completedPomodoros >= 0 &&
    cycleTarget >= 1 &&
    completedPomodoros < cycleTarget &&
    (value.notificationId === null || typeof value.notificationId === "string") &&
    typeof value.lastActiveTimestamp === "number" &&
    Number.isInteger(value.lastActiveTimestamp) &&
    value.lastActiveTimestamp >= 0
  );
}

export async function loadStudySession(): Promise<StudySession | null> {
  let raw: string | null;
  try {
    raw = await AsyncStorage.getItem(SESSION_KEY);
  } catch {
    throw new StorageError("read", "No se pudo recuperar la sesión guardada.");
  }

  if (raw === null) {
    return null;
  }

  let stored: { version?: number; session?: Partial<StudySession> };
  try {
    stored = JSON.parse(raw);
  } catch {
    throw new StorageError("invalid", "No se pudo recuperar la sesión: los datos no son válidos.");
  }

  if (typeof stored !== "object" || stored === null) {
    throw new StorageError("invalid", "No se pudo recuperar la sesión: los datos no son válidos.");
  }

  const storedVersion = stored.version;

  // Migración versión 1 -> versión 3
  if (storedVersion === 1 && stored.session) {
    const legacy = stored.session;
    if (
      legacy.phase === "study" &&
      typeof legacy.initialDurationSeconds === "number" &&
      typeof legacy.remainingSeconds === "number"
    ) {
      return {
        version: 3,
        phase: "study",
        status: legacy.status ?? "stopped",
        initialDurationSeconds: legacy.initialDurationSeconds,
        remainingSeconds: legacy.remainingSeconds,
        endTimestamp: legacy.endTimestamp ?? null,
        completedPomodoros: 0,
        cycleTarget: 4,
        notificationId: null,
        lastActiveTimestamp: Date.now(),
      };
    }
  }

  // Migración versión 2 -> versión 3
  if (storedVersion === 2 && stored.session) {
    const legacy = stored.session;
    if (
      ["study", "shortBreak", "longBreak"].includes(legacy.phase ?? "") &&
      ["stopped", "running", "paused", "finished"].includes(legacy.status ?? "") &&
      typeof legacy.initialDurationSeconds === "number" &&
      typeof legacy.remainingSeconds === "number" &&
      typeof legacy.completedPomodoros === "number" &&
      typeof legacy.cycleTarget === "number"
    ) {
      return {
        version: 3,
        phase: legacy.phase as PomodoroPhase,
        status: legacy.status as SessionStatus,
        initialDurationSeconds: legacy.initialDurationSeconds,
        remainingSeconds: legacy.remainingSeconds,
        endTimestamp: legacy.endTimestamp ?? null,
        completedPomodoros: legacy.completedPomodoros,
        cycleTarget: legacy.cycleTarget,
        notificationId: null,
        lastActiveTimestamp: Date.now(),
      };
    }
  }

  // Versión 3
  if (storedVersion === STORAGE_VERSION && isValidSession(stored.session)) {
    return stored.session;
  }

  throw new StorageError("invalid", "No se pudo recuperar la sesión: los datos no son válidos.");
}

export async function saveStudySession(session: StudySession): Promise<void> {
  try {
    const sanitizedSession: StudySession = {
      version: 3,
      phase: session.phase,
      status: session.status,
      initialDurationSeconds: session.initialDurationSeconds,
      remainingSeconds: session.remainingSeconds,
      endTimestamp: session.endTimestamp,
      completedPomodoros: session.completedPomodoros,
      cycleTarget: session.cycleTarget,
      notificationId: session.notificationId,
      lastActiveTimestamp: session.lastActiveTimestamp,
    };
    const stored: StoredSession = { version: STORAGE_VERSION, session: sanitizedSession };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(stored));
  } catch {
    throw new StorageError("write", "No se pudo guardar la sesión.");
  }
}


================================================
ðŸ“„ ARCHIVO: src\storage\settingsStorage.test.ts
================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadSettings, saveSettings, SETTINGS_STORAGE_KEY } from "./settingsStorage";
import { DEFAULT_POMODORO_SETTINGS } from "../utils/cycleSettings";
import type { PomodoroSettings } from "../types/pomodoro";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe("settingsStorage (RF-005, RF-011, RNF-001, RNF-002)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loadSettings", () => {
    it("returns default settings (25/5/15/4) when no settings are stored", async () => {
      jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce(null);

      const result = await loadSettings();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(SETTINGS_STORAGE_KEY);
      expect(result).toEqual(DEFAULT_POMODORO_SETTINGS);
    });

    it("returns saved settings when stored JSON is valid", async () => {
      const customSettings: PomodoroSettings = {
        studyDurationMinutes: 50,
        shortBreakMinutes: 10,
        longBreakMinutes: 20,
        cycleTarget: 4,
      };
      jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(customSettings));

      const result = await loadSettings();

      expect(result).toEqual(customSettings);
    });

    it("silently recovers with default settings when stored JSON is malformed (RF-011)", async () => {
      jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce("{invalid-json-content");

      const result = await loadSettings();

      expect(result).toEqual(DEFAULT_POMODORO_SETTINGS);
    });

    it("silently recovers with default settings when stored data contains invalid ranges", async () => {
      const invalidData = {
        studyDurationMinutes: 10, // Invalid (<25)
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        cycleTarget: 4,
      };
      jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(invalidData));

      const result = await loadSettings();

      expect(result).toEqual(DEFAULT_POMODORO_SETTINGS);
    });

    it("gracefully recovers with default settings when AsyncStorage throws", async () => {
      jest.mocked(AsyncStorage.getItem).mockRejectedValueOnce(new Error("AsyncStorage read failure"));

      const result = await loadSettings();

      expect(result).toEqual(DEFAULT_POMODORO_SETTINGS);
    });
  });

  describe("saveSettings", () => {
    it("serializes and saves valid settings under @pomodoro_settings", async () => {
      const customSettings: PomodoroSettings = {
        studyDurationMinutes: 45,
        shortBreakMinutes: 8,
        longBreakMinutes: 20,
        cycleTarget: 6,
      };
      jest.mocked(AsyncStorage.setItem).mockResolvedValueOnce();

      await saveSettings(customSettings);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(customSettings),
      );
    });

    it("rejects and does not write if settings are invalid", async () => {
      const invalidSettings: PomodoroSettings = {
        studyDurationMinutes: 20, // Invalid
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        cycleTarget: 4,
      };

      await expect(saveSettings(invalidSettings)).rejects.toThrow();
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it("rethrows error when AsyncStorage.setItem fails as a typed StorageError", async () => {
      const validSettings: PomodoroSettings = {
        studyDurationMinutes: 30,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        cycleTarget: 4,
      };
      jest.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error("Write error"));

      await expect(saveSettings(validSettings)).rejects.toMatchObject({
        name: "StorageError",
        operation: "write",
      });
    });

    it("restricts persisted settings strictly to approved fields without user id or telemetry (RF-006, RNF-003)", async () => {
      const settingsWithExtra = {
        studyDurationMinutes: 35,
        shortBreakMinutes: 6,
        longBreakMinutes: 18,
        cycleTarget: 4,
        userId: "student-12345",
        deviceTelemetry: { os: "android" },
      } as unknown as PomodoroSettings;

      jest.mocked(AsyncStorage.setItem).mockResolvedValueOnce();

      await saveSettings(settingsWithExtra);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        SETTINGS_STORAGE_KEY,
        JSON.stringify({
          studyDurationMinutes: 35,
          shortBreakMinutes: 6,
          longBreakMinutes: 18,
          cycleTarget: 4,
        }),
      );
    });
  });
});


================================================
ðŸ“„ ARCHIVO: src\storage\settingsStorage.ts
================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PomodoroSettings } from "../types/pomodoro";
import { DEFAULT_POMODORO_SETTINGS, validateCycleSettings } from "../utils/cycleSettings";
import { StorageError } from "./sessionStorage";

export const SETTINGS_STORAGE_KEY = "@pomodoro_settings";

export async function loadSettings(): Promise<PomodoroSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw === null) {
      return DEFAULT_POMODORO_SETTINGS;
    }

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return DEFAULT_POMODORO_SETTINGS;
    }

    const candidate = parsed as Partial<PomodoroSettings>;
    const validation = validateCycleSettings({
      studyDurationMinutes: candidate.studyDurationMinutes,
      shortBreakMinutes: candidate.shortBreakMinutes,
      longBreakMinutes: candidate.longBreakMinutes,
      cycleTarget: candidate.cycleTarget,
    });

    if (!validation.valid) {
      return DEFAULT_POMODORO_SETTINGS;
    }

    return {
      studyDurationMinutes: candidate.studyDurationMinutes as number,
      shortBreakMinutes: candidate.shortBreakMinutes as number,
      longBreakMinutes: candidate.longBreakMinutes as number,
      cycleTarget: candidate.cycleTarget as number,
    };
  } catch {
    // Tolerante y silencioso ante corrupciones o fallos de lectura (RF-011, Decisión 8)
    return DEFAULT_POMODORO_SETTINGS;
  }
}

export async function saveSettings(settings: PomodoroSettings): Promise<void> {
  const validation = validateCycleSettings(settings);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const sanitized: PomodoroSettings = {
    studyDurationMinutes: settings.studyDurationMinutes,
    shortBreakMinutes: settings.shortBreakMinutes,
    longBreakMinutes: settings.longBreakMinutes,
    cycleTarget: settings.cycleTarget,
  };

  try {
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "No se pudieron guardar los ajustes.";
    throw new StorageError("write", message);
  }
}



================================================
ðŸ“„ ARCHIVO: src\types\pomodoro.ts
================================================

export type SessionStatus = "stopped" | "running" | "paused" | "finished";
export type PomodoroPhase = "study" | "shortBreak" | "longBreak";

export interface StudySession {
  version: 3;
  phase: PomodoroPhase;
  status: SessionStatus;
  initialDurationSeconds: number;
  remainingSeconds: number;
  endTimestamp: number | null;
  completedPomodoros: number;
  cycleTarget: number;
  notificationId: string | null;
  lastActiveTimestamp: number;
}

export interface StudySettings {
  studyDurationMinutes: number;
}

export interface PomodoroSettings {
  studyDurationMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  cycleTarget: number;
}

export interface SettingsFieldErrors {
  studyDurationMinutes?: string | null;
  shortBreakMinutes?: string | null;
  longBreakMinutes?: string | null;
  cycleTarget?: string | null;
}

export interface SettingsFormInput {
  studyDurationMinutes: string;
  shortBreakMinutes: string;
  longBreakMinutes: string;
  cycleTarget: string;
}

export type RecoveryAnomaly =
  | "none"
  | "phaseCompletedInAbsence"
  | "expiredInactivity"
  | "clockBackward"
  | "corruptData";

export type SessionRecoveryAnomaly = RecoveryAnomaly;

export interface SessionRecoveryResult {
  session: StudySession;
  anomaly: RecoveryAnomaly;
  message?: string;
  rescheduledNotification?: boolean;
}

export interface AlarmNotificationContent {
  title: string;
  body: string;
}

export interface AlarmState {
  isActive: boolean;
  phase: PomodoroPhase | null;
  startedTimestamp: number | null;
}



================================================
ðŸ“„ ARCHIVO: src\utils\alarmMessages.test.ts
================================================

import {
  ALARM_TIMEOUT_MS,
  getAlarmNotificationContent,
  isAlarmExpired,
} from "./alarmMessages";

describe("alarmMessages pure utilities", () => {
  describe("getAlarmNotificationContent", () => {
    it("returns study finished message with short break duration (RF-006)", () => {
      const content = getAlarmNotificationContent("study", "shortBreak", 5);
      expect(content).toEqual({
        title: "¡Estudio terminado!",
        body: "Bien hecho. Listo para descanso corto (5 min)",
      });
    });

    it("returns study finished message with long break duration when cycle completed (RF-006)", () => {
      const content = getAlarmNotificationContent("study", "longBreak", 15);
      expect(content).toEqual({
        title: "¡Estudio terminado!",
        body: "Bien hecho. Listo para descanso largo (15 min)",
      });
    });

    it("returns short break finished message motivating next study session (RF-006)", () => {
      const content = getAlarmNotificationContent("shortBreak", "study", 25);
      expect(content).toEqual({
        title: "¡Descanso terminado!",
        body: "Tiempo de concentrarse en la siguiente sesión de estudio",
      });
    });

    it("returns long break finished message motivating next study session (RF-006)", () => {
      const content = getAlarmNotificationContent("longBreak", "study", 25);
      expect(content).toEqual({
        title: "¡Descanso terminado!",
        body: "Tiempo de concentrarse en la siguiente sesión de estudio",
      });
    });
  });

  describe("isAlarmExpired (RF-007)", () => {
    it("defines 60 seconds as the safety cutoff constant", () => {
      expect(ALARM_TIMEOUT_MS).toBe(60_000);
    });

    it("returns false if alarm duration is under 60 seconds", () => {
      const start = 1_000_000;
      expect(isAlarmExpired(start, start + 30_000)).toBe(false);
      expect(isAlarmExpired(start, start + 59_999)).toBe(false);
    });

    it("returns true when 60 seconds or more have elapsed", () => {
      const start = 1_000_000;
      expect(isAlarmExpired(start, start + 60_000)).toBe(true);
      expect(isAlarmExpired(start, start + 65_000)).toBe(true);
    });
  });
});


================================================
ðŸ“„ ARCHIVO: src\utils\alarmMessages.ts
================================================

import type { AlarmNotificationContent, PomodoroPhase } from "../types/pomodoro";

export const ALARM_TIMEOUT_MS = 60_000;

export function getAlarmNotificationContent(
  finishedPhase: PomodoroPhase,
  nextPhase: PomodoroPhase,
  nextDurationMinutes: number,
): AlarmNotificationContent {
  if (finishedPhase === "study") {
    const breakType = nextPhase === "longBreak" ? "descanso largo" : "descanso corto";
    return {
      title: "¡Estudio terminado!",
      body: `Bien hecho. Listo para ${breakType} (${nextDurationMinutes} min)`,
    };
  }

  return {
    title: "¡Descanso terminado!",
    body: "Tiempo de concentrarse en la siguiente sesión de estudio",
  };
}

export function isAlarmExpired(
  startedTimestamp: number,
  currentTimestamp: number = Date.now(),
  timeoutMs: number = ALARM_TIMEOUT_MS,
): boolean {
  return currentTimestamp - startedTimestamp >= timeoutMs;
}


================================================
ðŸ“„ ARCHIVO: src\utils\cycle.test.ts
================================================

import { createInitialSession } from "./cycle";

describe("cycle contract", () => {
  it("creates a study session with the configured cycle target", () => {
    expect(createInitialSession(1500, 300, 900, 4)).toEqual({
      version: 3,
      phase: "study",
      status: "stopped",
      initialDurationSeconds: 1500,
      remainingSeconds: 1500,
      endTimestamp: null,
      completedPomodoros: 0,
      cycleTarget: 4,
      notificationId: null,
      lastActiveTimestamp: 0,
    });
  });
});


================================================
ðŸ“„ ARCHIVO: src\utils\cycle.ts
================================================

import type { StudySession } from "../types/pomodoro";

export function createInitialSession(
  studyDurationSeconds: number,
  _shortBreakDurationSeconds = 300,
  _longBreakDurationSeconds = 900,
  cycleTarget = 4,
  lastActiveTimestamp = 0,
): StudySession {
  return {
    version: 3,
    phase: "study",
    status: "stopped",
    initialDurationSeconds: studyDurationSeconds,
    remainingSeconds: studyDurationSeconds,
    endTimestamp: null,
    completedPomodoros: 0,
    cycleTarget,
    notificationId: null,
    lastActiveTimestamp,
  };
}



================================================
ðŸ“„ ARCHIVO: src\utils\cycleSettings.test.ts
================================================

import {
  DEFAULT_POMODORO_SETTINGS,
  SETTINGS_LIMITS,
  validateCycleSettings,
  validateCycleTarget,
  validateLongBreak,
  validateShortBreak,
  validateStudyDuration,
} from "./cycleSettings";

describe("cycleSettings pure validations (RF-002, RF-003)", () => {
  describe("default and limit constants", () => {
    it("provides 25/5/15/4 as default settings", () => {
      expect(DEFAULT_POMODORO_SETTINGS).toEqual({
        studyDurationMinutes: 25,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        cycleTarget: 4,
      });
    });

    it("defines correct educational limits", () => {
      expect(SETTINGS_LIMITS.study).toEqual({ min: 25, max: 90 });
      expect(SETTINGS_LIMITS.shortBreak).toEqual({ min: 5, max: 20 });
      expect(SETTINGS_LIMITS.longBreak).toEqual({ min: 15, max: 30 });
      expect(SETTINGS_LIMITS.cycle).toEqual({ min: 2, max: 8 });
    });
  });

  describe("validateStudyDuration", () => {
    it("accepts valid values within [25, 90]", () => {
      expect(validateStudyDuration(25)).toEqual({ valid: true });
      expect(validateStudyDuration(50)).toEqual({ valid: true });
      expect(validateStudyDuration(90)).toEqual({ valid: true });
      expect(validateStudyDuration("45")).toEqual({ valid: true });
    });

    it("rejects values outside [25, 90]", () => {
      expect(validateStudyDuration(24)).toEqual({
        valid: false,
        error: expect.stringContaining("25 y 90"),
      });
      expect(validateStudyDuration(91)).toEqual({
        valid: false,
        error: expect.stringContaining("25 y 90"),
      });
    });

    it("rejects decimals, negatives, empty and non-numeric values", () => {
      expect(validateStudyDuration(25.5).valid).toBe(false);
      expect(validateStudyDuration(-25).valid).toBe(false);
      expect(validateStudyDuration(0).valid).toBe(false);
      expect(validateStudyDuration("").valid).toBe(false);
      expect(validateStudyDuration("abc").valid).toBe(false);
      expect(validateStudyDuration(null).valid).toBe(false);
      expect(validateStudyDuration(undefined).valid).toBe(false);
    });
  });

  describe("validateShortBreak", () => {
    it("accepts valid values within [5, 20]", () => {
      expect(validateShortBreak(5)).toEqual({ valid: true });
      expect(validateShortBreak(10)).toEqual({ valid: true });
      expect(validateShortBreak(20)).toEqual({ valid: true });
      expect(validateShortBreak("15")).toEqual({ valid: true });
    });

    it("rejects values outside [5, 20]", () => {
      expect(validateShortBreak(4)).toEqual({
        valid: false,
        error: expect.stringContaining("5 y 20"),
      });
      expect(validateShortBreak(21)).toEqual({
        valid: false,
        error: expect.stringContaining("5 y 20"),
      });
    });

    it("rejects decimals, negatives and non-numbers", () => {
      expect(validateShortBreak(5.5).valid).toBe(false);
      expect(validateShortBreak(-5).valid).toBe(false);
      expect(validateShortBreak("").valid).toBe(false);
      expect(validateShortBreak("xyz").valid).toBe(false);
    });
  });

  describe("validateLongBreak", () => {
    it("accepts valid values within [15, 30]", () => {
      expect(validateLongBreak(15)).toEqual({ valid: true });
      expect(validateLongBreak(20)).toEqual({ valid: true });
      expect(validateLongBreak(30)).toEqual({ valid: true });
      expect(validateLongBreak("25")).toEqual({ valid: true });
    });

    it("rejects values outside [15, 30]", () => {
      expect(validateLongBreak(14)).toEqual({
        valid: false,
        error: expect.stringContaining("15 y 30"),
      });
      expect(validateLongBreak(31)).toEqual({
        valid: false,
        error: expect.stringContaining("15 y 30"),
      });
    });

    it("rejects decimals, negatives and invalid formats", () => {
      expect(validateLongBreak(15.2).valid).toBe(false);
      expect(validateLongBreak(-15).valid).toBe(false);
      expect(validateLongBreak("").valid).toBe(false);
    });
  });

  describe("validateCycleTarget", () => {
    it("accepts valid values within [2, 8]", () => {
      expect(validateCycleTarget(2)).toEqual({ valid: true });
      expect(validateCycleTarget(4)).toEqual({ valid: true });
      expect(validateCycleTarget(8)).toEqual({ valid: true });
      expect(validateCycleTarget("6")).toEqual({ valid: true });
    });

    it("rejects values outside [2, 8]", () => {
      expect(validateCycleTarget(1)).toEqual({
        valid: false,
        error: expect.stringContaining("2 y 8"),
      });
      expect(validateCycleTarget(9)).toEqual({
        valid: false,
        error: expect.stringContaining("2 y 8"),
      });
    });

    it("rejects non-integers, empty and negative values", () => {
      expect(validateCycleTarget(4.5).valid).toBe(false);
      expect(validateCycleTarget(-2).valid).toBe(false);
      expect(validateCycleTarget("").valid).toBe(false);
    });
  });

  describe("validateCycleSettings (composite object)", () => {
    it("accepts valid composite settings with PomodoroSettings interface", () => {
      expect(
        validateCycleSettings({
          studyDurationMinutes: 25,
          shortBreakMinutes: 5,
          longBreakMinutes: 15,
          cycleTarget: 4,
        }),
      ).toEqual({ valid: true });
    });

    it("accepts valid composite settings with legacy property names", () => {
      expect(
        validateCycleSettings({
          studyMinutes: 30,
          shortBreakMinutes: 10,
          longBreakMinutes: 20,
          cycleTarget: 4,
        }),
      ).toEqual({ valid: true });
    });

    it("rejects composite settings with any invalid field", () => {
      expect(
        validateCycleSettings({
          studyDurationMinutes: 20, // Invalid (<25)
          shortBreakMinutes: 5,
          longBreakMinutes: 15,
          cycleTarget: 4,
        }),
      ).toEqual({
        valid: false,
        error: expect.stringContaining("25 y 90"),
      });

      expect(
        validateCycleSettings({
          studyDurationMinutes: 25,
          shortBreakMinutes: 25, // Invalid (>20)
          longBreakMinutes: 15,
          cycleTarget: 4,
        }),
      ).toEqual({
        valid: false,
        error: expect.stringContaining("5 y 20"),
      });
    });
  });
});


================================================
ðŸ“„ ARCHIVO: src\utils\cycleSettings.ts
================================================

import type { PomodoroSettings } from "../types/pomodoro";

export const SETTINGS_LIMITS = {
  study: { min: 25, max: 90 },
  shortBreak: { min: 5, max: 20 },
  longBreak: { min: 15, max: 30 },
  cycle: { min: 2, max: 8 },
} as const;

export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  studyDurationMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cycleTarget: 4,
};

export type ValidationResult =
  | { valid: true }
  | { valid: false; error: string };

function parseInteger(value: unknown): number | null {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || !Number.isInteger(value)) {
      return null;
    }
    return value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!/^-?\d+$/.test(trimmed)) {
      return null;
    }
    const parsed = parseInt(trimmed, 10);
    return Number.isSafeInteger(parsed) ? parsed : null;
  }
  return null;
}

export function validateStudyDuration(value: unknown): ValidationResult {
  const parsed = parseInteger(value);
  if (
    parsed === null ||
    parsed < SETTINGS_LIMITS.study.min ||
    parsed > SETTINGS_LIMITS.study.max
  ) {
    return {
      valid: false,
      error: `El tiempo de estudio debe ser un número entero entre ${SETTINGS_LIMITS.study.min} y ${SETTINGS_LIMITS.study.max} minutos.`,
    };
  }
  return { valid: true };
}

export function validateShortBreak(value: unknown): ValidationResult {
  const parsed = parseInteger(value);
  if (
    parsed === null ||
    parsed < SETTINGS_LIMITS.shortBreak.min ||
    parsed > SETTINGS_LIMITS.shortBreak.max
  ) {
    return {
      valid: false,
      error: `El descanso corto debe ser un número entero entre ${SETTINGS_LIMITS.shortBreak.min} y ${SETTINGS_LIMITS.shortBreak.max} minutos.`,
    };
  }
  return { valid: true };
}

export function validateLongBreak(value: unknown): ValidationResult {
  const parsed = parseInteger(value);
  if (
    parsed === null ||
    parsed < SETTINGS_LIMITS.longBreak.min ||
    parsed > SETTINGS_LIMITS.longBreak.max
  ) {
    return {
      valid: false,
      error: `El descanso largo debe ser un número entero entre ${SETTINGS_LIMITS.longBreak.min} y ${SETTINGS_LIMITS.longBreak.max} minutos.`,
    };
  }
  return { valid: true };
}

export function validateCycleTarget(value: unknown): ValidationResult {
  const parsed = parseInteger(value);
  if (
    parsed === null ||
    parsed < SETTINGS_LIMITS.cycle.min ||
    parsed > SETTINGS_LIMITS.cycle.max
  ) {
    return {
      valid: false,
      error: `La cantidad de pomodoros por ciclo debe ser un número entero entre ${SETTINGS_LIMITS.cycle.min} y ${SETTINGS_LIMITS.cycle.max}.`,
    };
  }
  return { valid: true };
}

export interface CycleSettingsInput {
  studyMinutes?: unknown;
  studyDurationMinutes?: unknown;
  shortBreakMinutes?: unknown;
  longBreakMinutes?: unknown;
  cycleTarget?: unknown;
}

export function validateCycleSettings(settings: CycleSettingsInput): ValidationResult {
  const studyVal = settings.studyDurationMinutes ?? settings.studyMinutes;
  const studyCheck = validateStudyDuration(studyVal);
  if (!studyCheck.valid) {
    return studyCheck;
  }

  const shortCheck = validateShortBreak(settings.shortBreakMinutes);
  if (!shortCheck.valid) {
    return shortCheck;
  }

  const longCheck = validateLongBreak(settings.longBreakMinutes);
  if (!longCheck.valid) {
    return longCheck;
  }

  const cycleCheck = validateCycleTarget(settings.cycleTarget);
  if (!cycleCheck.valid) {
    return cycleCheck;
  }

  return { valid: true };
}

export function validateSettingsForm(input: {
  studyDurationMinutes?: string;
  shortBreakMinutes?: string;
  longBreakMinutes?: string;
  cycleTarget?: string;
}): {
  isValid: boolean;
  errors: {
    studyDurationMinutes?: string;
    shortBreakMinutes?: string;
    longBreakMinutes?: string;
    cycleTarget?: string;
  };
} {
  const errors: {
    studyDurationMinutes?: string;
    shortBreakMinutes?: string;
    longBreakMinutes?: string;
    cycleTarget?: string;
  } = {};

  const studyCheck = validateStudyDuration(input.studyDurationMinutes);
  if (!studyCheck.valid) {
    errors.studyDurationMinutes = studyCheck.error;
  }

  const shortCheck = validateShortBreak(input.shortBreakMinutes);
  if (!shortCheck.valid) {
    errors.shortBreakMinutes = shortCheck.error;
  }

  const longCheck = validateLongBreak(input.longBreakMinutes);
  if (!longCheck.valid) {
    errors.longBreakMinutes = longCheck.error;
  }

  const cycleCheck = validateCycleTarget(input.cycleTarget);
  if (!cycleCheck.valid) {
    errors.cycleTarget = cycleCheck.error;
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
}

export function parseSettingsForm(input: {
  studyDurationMinutes: string;
  shortBreakMinutes: string;
  longBreakMinutes: string;
  cycleTarget: string;
}): PomodoroSettings | null {
  const validation = validateSettingsForm(input);
  if (!validation.isValid) {
    return null;
  }

  return {
    studyDurationMinutes: parseInt(input.studyDurationMinutes.trim(), 10),
    shortBreakMinutes: parseInt(input.shortBreakMinutes.trim(), 10),
    longBreakMinutes: parseInt(input.longBreakMinutes.trim(), 10),
    cycleTarget: parseInt(input.cycleTarget.trim(), 10),
  };
}



================================================
ðŸ“„ ARCHIVO: src\utils\phaseTransition.test.ts
================================================

import { createInitialSession } from "./cycle";
import { completePhase, getEffectiveSession, type PhaseDurations } from "./phaseTransition";

const durations: PhaseDurations = {
  studySeconds: 1500,
  shortBreakSeconds: 300,
  longBreakSeconds: 900,
};

describe("phase transitions", () => {
  it.each([0, 1, 2])("prepares a short break after study %i", (completedPomodoros) => {
    const session = {
      ...createInitialSession(1500, 300, 900, 4),
      completedPomodoros,
      status: "running" as const,
      endTimestamp: 10_000,
    };

    const next = completePhase(session, durations);

    expect(next).toMatchObject({
      phase: "shortBreak",
      status: "stopped",
      completedPomodoros: completedPomodoros + 1,
      remainingSeconds: 300,
      endTimestamp: null,
    });
  });

  it("prepares a long break and resets the counter at the cycle target", () => {
    const session = {
      ...createInitialSession(1500, 300, 900, 4),
      completedPomodoros: 3,
      status: "running" as const,
      endTimestamp: 10_000,
    };

    expect(completePhase(session, durations)).toMatchObject({
      phase: "longBreak",
      completedPomodoros: 0,
      remainingSeconds: 900,
      status: "stopped",
    });
  });

  it("prepares study after either break without starting it", () => {
    for (const phase of ["shortBreak", "longBreak"] as const) {
      const session = {
        ...createInitialSession(1500, 300, 900, 4),
        phase,
        status: "running" as const,
        initialDurationSeconds: phase === "shortBreak" ? 300 : 900,
        remainingSeconds: 0,
        endTimestamp: 10_000,
        completedPomodoros: 1,
      };

      expect(completePhase(session, durations)).toMatchObject({
        phase: "study",
        status: "stopped",
        remainingSeconds: 1500,
        completedPomodoros: 1,
      });
    }
  });

  it("performs exactly one transition when a running phase has elapsed", () => {
    const session = {
      ...createInitialSession(1500, 300, 900, 4),
      status: "running" as const,
      endTimestamp: 10_000,
    };

    const next = getEffectiveSession(session, 20_000, durations);
    expect(next.phase).toBe("shortBreak");
    expect(next.status).toBe("stopped");
  });
});


================================================
ðŸ“„ ARCHIVO: src\utils\phaseTransition.ts
================================================

import type { StudySession } from "../types/pomodoro";
import { getRemainingSeconds } from "./timer";

export interface PhaseDurations {
  studySeconds: number;
  shortBreakSeconds: number;
  longBreakSeconds: number;
}

function preparedSession(
  session: StudySession,
  phase: StudySession["phase"],
  durationSeconds: number,
  completedPomodoros: number,
): StudySession {
  return {
    ...session,
    phase,
    status: "stopped",
    initialDurationSeconds: durationSeconds,
    remainingSeconds: durationSeconds,
    endTimestamp: null,
    completedPomodoros,
  };
}

export function completePhase(
  session: StudySession,
  durations: PhaseDurations,
): StudySession {
  if (session.phase === "study") {
    const completedPomodoros = session.completedPomodoros + 1;
    if (completedPomodoros >= session.cycleTarget) {
      return preparedSession(session, "longBreak", durations.longBreakSeconds, 0);
    }
    return preparedSession(session, "shortBreak", durations.shortBreakSeconds, completedPomodoros);
  }

  return preparedSession(session, "study", durations.studySeconds, session.completedPomodoros);
}

export function getEffectiveSession(
  session: StudySession,
  currentTimestamp: number,
  durations?: PhaseDurations,
): StudySession {
  if (session.status !== "running" || session.endTimestamp === null) {
    return session;
  }

  const remainingSeconds = getRemainingSeconds(session.endTimestamp, currentTimestamp);
  if (remainingSeconds > 0) {
    return { ...session, remainingSeconds };
  }

  return durations
    ? completePhase({ ...session, remainingSeconds: 0 }, durations)
    : { ...session, status: "finished", remainingSeconds: 0, endTimestamp: null };
}


================================================
ðŸ“„ ARCHIVO: src\utils\session.test.ts
================================================

import {
  getEffectiveSession,
  pauseSession,
  resetSession,
  startSession,
} from "./session";
import { createInitialSession } from "./cycle";

describe("study session transitions", () => {
  it("starts with the configured duration and starts from a timestamp", () => {
    const initial = createInitialSession(1500, 300, 900, 4);
    const running = startSession(initial, 10_000);

    expect(initial.status).toBe("stopped");
    expect(running).toMatchObject({
      status: "running",
      remainingSeconds: 1500,
      endTimestamp: 1_510_000,
    });
  });

  it("pauses using the exact elapsed time and resumes from the saved remainder", () => {
    const running = startSession(createInitialSession(1500, 300, 900, 4), 10_000);
    const paused = pauseSession(running, 310_000);
    const resumed = startSession(paused, 500_000);

    expect(paused).toMatchObject({
      status: "paused",
      remainingSeconds: 1200,
      endTimestamp: null,
    });
    expect(resumed.endTimestamp).toBe(1_700_000);
  });

  it("finishes at zero without an automatic next phase", () => {
    const running = startSession(createInitialSession(60, 300, 900, 4), 10_000);
    const finished = getEffectiveSession(running, 70_000);

    expect(finished).toMatchObject({
      status: "finished",
      remainingSeconds: 0,
      endTimestamp: null,
    });
  });

  it("resets only after explicit confirmation", () => {
    const running = startSession(createInitialSession(60, 300, 900, 4), 10_000);
    expect(resetSession(running, false)).toEqual(running);
    expect(resetSession(running, true)).toMatchObject({
      status: "stopped",
      remainingSeconds: 60,
      endTimestamp: null,
    });
  });
});


================================================
ðŸ“„ ARCHIVO: src\utils\session.ts
================================================

import type { StudySession } from "../types/pomodoro";
import { getRemainingSeconds } from "./timer";
import { createInitialSession } from "./cycle";

export { createInitialSession } from "./cycle";

export function startSession(session: StudySession, currentTimestamp: number): StudySession {
  if (session.remainingSeconds <= 0 || session.status === "finished") {
    return session;
  }

  return {
    ...session,
    status: "running",
    endTimestamp: currentTimestamp + session.remainingSeconds * 1000,
  };
}

export function pauseSession(
  session: StudySession,
  currentTimestamp: number,
): StudySession {
  if (session.status !== "running" || session.endTimestamp === null) {
    return session;
  }

  return {
    ...session,
    status: "paused",
    remainingSeconds: getRemainingSeconds(session.endTimestamp, currentTimestamp),
    endTimestamp: null,
  };
}

export function getEffectiveSession(
  session: StudySession,
  currentTimestamp: number,
): StudySession {
  if (session.status !== "running" || session.endTimestamp === null) {
    return session;
  }

  const remainingSeconds = getRemainingSeconds(session.endTimestamp, currentTimestamp);
  if (remainingSeconds === 0) {
    return {
      ...session,
      status: "finished",
      remainingSeconds: 0,
      endTimestamp: null,
    };
  }

  return { ...session, remainingSeconds };
}

export function resetSession(session: StudySession, confirmed: boolean): StudySession {
  return confirmed
    ? createInitialSession(session.initialDurationSeconds, 300, 900, session.cycleTarget)
    : session;
}


================================================
ðŸ“„ ARCHIVO: src\utils\sessionRecovery.test.ts
================================================

import { evaluateSessionRecovery } from "./sessionRecovery";
import type { StudySession } from "../types/pomodoro";
import type { PhaseDurations } from "./phaseTransition";

describe("evaluateSessionRecovery pure utility", () => {
  const durations: PhaseDurations = {
    studySeconds: 1500,
    shortBreakSeconds: 300,
    longBreakSeconds: 900,
  };

  const ONE_HOUR = 60 * 60 * 1000;
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  it("recovers a running session with valid remaining time without anomaly", () => {
    const current = 1_000_000;
    const session: StudySession = {
      version: 3,
      phase: "study",
      status: "running",
      initialDurationSeconds: 1500,
      remainingSeconds: 1500,
      endTimestamp: current + 500_000, // 500s remaining
      completedPomodoros: 1,
      cycleTarget: 4,
      notificationId: "notif-abc",
      lastActiveTimestamp: current - 10_000,
    };

    const result = evaluateSessionRecovery(session, current, durations);
    expect(result.anomaly).toBe("none");
    expect(result.session.status).toBe("running");
    expect(result.session.remainingSeconds).toBe(500);
    expect(result.session.lastActiveTimestamp).toBe(current);
    expect(result.rescheduledNotification).toBe(true);
  });

  it("detects clock moved backwards beyond initial duration and caps remaining time (RF-007)", () => {
    const current = 1_000_000;
    // Suppose initialDuration is 1500s. Clock shifted back so endTimestamp - current = 2500s
    const session: StudySession = {
      version: 3,
      phase: "study",
      status: "running",
      initialDurationSeconds: 1500,
      remainingSeconds: 1000,
      endTimestamp: current + 2_500_000,
      completedPomodoros: 2,
      cycleTarget: 4,
      notificationId: "notif-abc",
      lastActiveTimestamp: current - 5_000,
    };

    const result = evaluateSessionRecovery(session, current, durations);
    expect(result.anomaly).toBe("clockBackward");
    expect(result.session.remainingSeconds).toBe(1500);
    expect(result.session.endTimestamp).toBe(current + 1500 * 1000);
    expect(result.message).toBe(
      "Se detectó un cambio en el reloj del dispositivo. El tiempo restante se ajustó al máximo de la fase.",
    );
    expect(result.rescheduledNotification).toBe(true);
  });

  it("handles phase completed in absence when under 24 hours (RF-004)", () => {
    const current = 1_000_000;
    // Ended 10 minutes ago
    const session: StudySession = {
      version: 3,
      phase: "study",
      status: "running",
      initialDurationSeconds: 1500,
      remainingSeconds: 1500,
      endTimestamp: current - 600_000,
      completedPomodoros: 0,
      cycleTarget: 4,
      notificationId: "notif-1",
      lastActiveTimestamp: current - 2_100_000,
    };

    const result = evaluateSessionRecovery(session, current, durations);
    expect(result.anomaly).toBe("phaseCompletedInAbsence");
    expect(result.session.phase).toBe("shortBreak");
    expect(result.session.status).toBe("stopped");
    expect(result.session.completedPomodoros).toBe(1);
    expect(result.session.remainingSeconds).toBe(300);
    expect(result.session.endTimestamp).toBeNull();
    expect(result.session.notificationId).toBeNull();
    expect(result.session.lastActiveTimestamp).toBe(current);
    expect(result.message).toBe("La fase anterior terminó mientras la aplicación no estaba activa.");
  });

  it("advances to longBreak on 4th pomodoro completed in absence (RF-004)", () => {
    const current = 1_000_000;
    const session: StudySession = {
      version: 3,
      phase: "study",
      status: "running",
      initialDurationSeconds: 1500,
      remainingSeconds: 1500,
      endTimestamp: current - 60_000,
      completedPomodoros: 3,
      cycleTarget: 4,
      notificationId: "notif-1",
      lastActiveTimestamp: current - 1_560_000,
    };

    const result = evaluateSessionRecovery(session, current, durations);
    expect(result.anomaly).toBe("phaseCompletedInAbsence");
    expect(result.session.phase).toBe("longBreak");
    expect(result.session.status).toBe("stopped");
    expect(result.session.completedPomodoros).toBe(0); // Cycle completed, resets to 0
    expect(result.session.remainingSeconds).toBe(900);
    expect(result.message).toBe("La fase anterior terminó mientras la aplicación no estaba activa.");
  });

  it("expires cycle after > 24 hours of inactivity on a finished phase (RF-008)", () => {
    const current = 100_000_000;
    // Ended 25 hours ago
    const session: StudySession = {
      version: 3,
      phase: "study",
      status: "running",
      initialDurationSeconds: 1500,
      remainingSeconds: 1500,
      endTimestamp: current - (TWENTY_FOUR_HOURS + ONE_HOUR),
      completedPomodoros: 2,
      cycleTarget: 4,
      notificationId: "notif-old",
      lastActiveTimestamp: current - (TWENTY_FOUR_HOURS + 2 * ONE_HOUR),
    };

    const result = evaluateSessionRecovery(session, current, durations);
    expect(result.anomaly).toBe("expiredInactivity");
    expect(result.session.phase).toBe("study");
    expect(result.session.status).toBe("stopped");
    expect(result.session.completedPomodoros).toBe(0);
    expect(result.session.remainingSeconds).toBe(durations.studySeconds);
    expect(result.session.notificationId).toBeNull();
    expect(result.session.endTimestamp).toBeNull();
    expect(result.message).toBe(
      "El ciclo anterior expiró por inactividad (más de 24 horas). Se inició un nuevo ciclo de estudio.",
    );
  });

  it("expires cycle after > 24 hours of inactivity on a paused session (RF-009)", () => {
    const current = 100_000_000;
    // Paused 26 hours ago
    const session: StudySession = {
      version: 3,
      phase: "shortBreak",
      status: "paused",
      initialDurationSeconds: 300,
      remainingSeconds: 150,
      endTimestamp: null,
      completedPomodoros: 2,
      cycleTarget: 4,
      notificationId: null,
      lastActiveTimestamp: current - (TWENTY_FOUR_HOURS + 2 * ONE_HOUR),
    };

    const result = evaluateSessionRecovery(session, current, durations);
    expect(result.anomaly).toBe("expiredInactivity");
    expect(result.session.phase).toBe("study");
    expect(result.session.status).toBe("stopped");
    expect(result.session.completedPomodoros).toBe(0);
    expect(result.session.remainingSeconds).toBe(durations.studySeconds);
    expect(result.message).toBe(
      "La sesión pausada expiró por inactividad (más de 24 horas). Se inició un nuevo ciclo de estudio.",
    );
  });

  it("keeps paused session intact when paused for less than 24 hours (RF-005)", () => {
    const current = 100_000_000;
    // Paused 5 hours ago
    const session: StudySession = {
      version: 3,
      phase: "study",
      status: "paused",
      initialDurationSeconds: 1500,
      remainingSeconds: 750,
      endTimestamp: null,
      completedPomodoros: 1,
      cycleTarget: 4,
      notificationId: null,
      lastActiveTimestamp: current - 5 * ONE_HOUR,
    };

    const result = evaluateSessionRecovery(session, current, durations);
    expect(result.anomaly).toBe("none");
    expect(result.session.status).toBe("paused");
    expect(result.session.remainingSeconds).toBe(750);
    expect(result.session.completedPomodoros).toBe(1);
    expect(result.session.phase).toBe("study");
    expect(result.session.lastActiveTimestamp).toBe(current);
  });

  it("handles stopped session without anomaly", () => {
    const current = 100_000_000;
    const session: StudySession = {
      version: 3,
      phase: "study",
      status: "stopped",
      initialDurationSeconds: 1500,
      remainingSeconds: 1500,
      endTimestamp: null,
      completedPomodoros: 0,
      cycleTarget: 4,
      notificationId: null,
      lastActiveTimestamp: current - 1000,
    };

    const result = evaluateSessionRecovery(session, current, durations);
    expect(result.anomaly).toBe("none");
    expect(result.session.status).toBe("stopped");
    expect(result.session.remainingSeconds).toBe(1500);
  });
});


================================================
ðŸ“„ ARCHIVO: src\utils\sessionRecovery.ts
================================================

import type { StudySession, SessionRecoveryResult } from "../types/pomodoro";
import type { PhaseDurations } from "./phaseTransition";
import { completePhase } from "./phaseTransition";
import { createInitialSession } from "./cycle";

export const INACTIVITY_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 horas

export function evaluateSessionRecovery(
  session: StudySession,
  currentTimestamp: number,
  durations: PhaseDurations,
): SessionRecoveryResult {
  // 1. Evaluación de inactividad prolongada (> 24 h) para sesiones en curso o pausadas
  if (session.status === "running" && session.endTimestamp !== null) {
    if (currentTimestamp - session.endTimestamp > INACTIVITY_THRESHOLD_MS) {
      return {
        session: createInitialSession(
          durations.studySeconds,
          durations.shortBreakSeconds,
          durations.longBreakSeconds,
          session.cycleTarget,
          currentTimestamp,
        ),
        anomaly: "expiredInactivity",
        message:
          "El ciclo anterior expiró por inactividad (más de 24 horas). Se inició un nuevo ciclo de estudio.",
        rescheduledNotification: false,
      };
    }
  }

  if (session.status === "paused") {
    if (currentTimestamp - session.lastActiveTimestamp > INACTIVITY_THRESHOLD_MS) {
      return {
        session: createInitialSession(
          durations.studySeconds,
          durations.shortBreakSeconds,
          durations.longBreakSeconds,
          session.cycleTarget,
          currentTimestamp,
        ),
        anomaly: "expiredInactivity",
        message:
          "La sesión pausada expiró por inactividad (más de 24 horas). Se inició un nuevo ciclo de estudio.",
        rescheduledNotification: false,
      };
    }
  }

  // 2. Evaluación de sesión en curso
  if (session.status === "running" && session.endTimestamp !== null) {
    const rawRemaining = Math.max(0, Math.ceil((session.endTimestamp - currentTimestamp) / 1000));

    // 2a. Reloj modificado hacia atrás: tiempo restante supera la duración nominal de la fase
    if (rawRemaining > session.initialDurationSeconds) {
      const boundedSeconds = session.initialDurationSeconds;
      return {
        session: {
          ...session,
          remainingSeconds: boundedSeconds,
          endTimestamp: currentTimestamp + boundedSeconds * 1000,
          lastActiveTimestamp: currentTimestamp,
        },
        anomaly: "clockBackward",
        message:
          "Se detectó un cambio en el reloj del dispositivo. El tiempo restante se ajustó al máximo de la fase.",
        rescheduledNotification: true,
      };
    }

    // 2b. Fase finalizada en ausencia
    if (rawRemaining === 0) {
      const nextPhase = completePhase(
        {
          ...session,
          remainingSeconds: 0,
        },
        durations,
      );
      return {
        session: {
          ...nextPhase,
          notificationId: null,
          lastActiveTimestamp: currentTimestamp,
        },
        anomaly: "phaseCompletedInAbsence",
        message: "La fase anterior terminó mientras la aplicación no estaba activa.",
        rescheduledNotification: false,
      };
    }

    // 2c. Sesión en curso dentro de parámetros normales
    return {
      session: {
        ...session,
        remainingSeconds: rawRemaining,
        lastActiveTimestamp: currentTimestamp,
      },
      anomaly: "none",
      rescheduledNotification: true,
    };
  }

  // 3. Sesión pausada dentro de las 24 horas
  if (session.status === "paused") {
    return {
      session: {
        ...session,
        lastActiveTimestamp: currentTimestamp,
      },
      anomaly: "none",
      rescheduledNotification: false,
    };
  }

  // 4. Sesión detenida o finalizada
  return {
    session: {
      ...session,
      lastActiveTimestamp: currentTimestamp,
    },
    anomaly: "none",
    rescheduledNotification: false,
  };
}


================================================
ðŸ“„ ARCHIVO: src\utils\settings.test.ts
================================================

import { validateStudyDuration } from "./settings";

describe("study duration validation", () => {
  it("accepts integer minutes from 1 through 100", () => {
    expect(validateStudyDuration(1)).toEqual({ valid: true });
    expect(validateStudyDuration(100)).toEqual({ valid: true });
  });

  it.each([0, -1, 101, 25.5, NaN, Infinity, "25", ""])(
    "rejects invalid value %p",
    (value) => {
      expect(validateStudyDuration(value)).toEqual({
        valid: false,
        error: expect.any(String),
      });
    },
  );
});


================================================
ðŸ“„ ARCHIVO: src\utils\settings.ts
================================================

export type DurationValidation =
  | { valid: true }
  | { valid: false; error: string };

export function validateStudyDuration(value: unknown): DurationValidation {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return { valid: false, error: "La duración debe ser un número entero." };
  }

  if (!Number.isInteger(value) || value < 1 || value > 100) {
    return {
      valid: false,
      error: "La duración debe ser un número entero entre 1 y 100 minutos.",
    };
  }

  return { valid: true };
}


================================================
ðŸ“„ ARCHIVO: src\utils\timer.test.ts
================================================

import { formatTime, getRemainingSeconds } from "./timer";

describe("timer utilities", () => {
  it("calculates remaining seconds from the end timestamp", () => {
    expect(getRemainingSeconds(130_000, 100_000)).toBe(30);
  });

  it("returns zero when the timestamp has elapsed", () => {
    expect(getRemainingSeconds(99_000, 100_000)).toBe(0);
  });

  it("formats minutes and seconds with leading zeroes", () => {
    expect(formatTime(65)).toBe("01:05");
    expect(formatTime(0)).toBe("00:00");
  });

  it("limits remaining seconds to maxSeconds if clock was moved backwards", () => {
    // 25 minutes nominal = 1500s. Clock moved back so calculated diff is 2000s
    const end = 2_000_000;
    const current = 0;
    expect(getRemainingSeconds(end, current, 1500)).toBe(1500);
  });

  it("respects calculated remaining seconds when less than maxSeconds", () => {
    const end = 1_200_000;
    const current = 1_000_000;
    expect(getRemainingSeconds(end, current, 1500)).toBe(200);
  });
});



================================================
ðŸ“„ ARCHIVO: src\utils\timer.ts
================================================

export function getRemainingSeconds(
  endTimestamp: number,
  currentTimestamp: number = Date.now(),
  maxSeconds?: number,
): number {
  const calculated = Math.max(0, Math.ceil((endTimestamp - currentTimestamp) / 1000));
  if (typeof maxSeconds === "number") {
    return Math.min(maxSeconds, calculated);
  }
  return calculated;
}

export function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


================================================
ðŸ“„ ARCHIVO: tsconfig.json
================================================

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "types": ["jest"],
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@/assets/*": [
        "./assets/*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
