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
