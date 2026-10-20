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
