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
