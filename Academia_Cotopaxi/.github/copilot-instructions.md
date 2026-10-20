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
