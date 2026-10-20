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
