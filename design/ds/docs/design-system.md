# Design System v1 — Seres Migratorios

**Versión 1.2 · 06 sep 2026** (v1 del 05 sep 2026; changelog en §13)
**Canvas en Claude Design (láminas 01–09, editable, exporta PNG/PDF):** https://claude.ai/code/artifact/50dc4200-edb3-47f0-a24e-41c91544befd · Capturas en `laminas/`.
**Proyecto en claude.ai/design:** "Seres Migratorios Design System" (creado por Rubén el 06.09.2026 a partir del prompt maestro; 17 componentes, 21 guidelines, tokens, UI kits web y piezas). El 06.09.2026 se le cargaron 56 assets con transparencia real extraídos de las capas de los PSD (`assets/marca`, `manuscritas`, `logos`, `retratos`, `obra`); los mismos archivos viven en `assets-fuente/_para-claude-design/` de esta carpeta.

Fuente única de verdad de las decisiones visuales: `00-BRIEF-tecnico.md` (en la raíz de esta carpeta). Este documento las desarrolla para diseño y desarrollo; no reemplaza al BRIEF, lo documenta.

---

## 1. Principios

1. **El expediente es la forma.** La marca se apropia del lenguaje del trámite migratorio —fichas, sellos, máquina de escribir— para contar la migración desde adentro.
2. **La mano interviene lo impreso.** Todo lo tipeado o sellado convive con una anotación manuscrita real en azul: la tensión entre el trámite frío y la letra de una persona.
3. **Bicolor, sin adornos.** Tinta negra y azul de sello sobre papel alcanzan para todo; el tricolor venezolano aparece una sola vez, mínimo, para que pese cuando aparece.
4. **Nada se redondea.** Solo los sellos reales tienen círculos; el resto del sistema es de esquinas rectas.
5. **Las fotos están pegadas, no diseñadas.** Bordes blancos, rotación leve y sombra de papel: cada imagen se ve como una copia pegada a mano, no como un elemento vectorial perfecto.

---

## 2. Lenguaje visual

Las piezas (posts 1080×1080 y stories 1080×1920) simulan un **expediente migratorio intervenido a mano**. Sobre papel con grano y motas negras conviven cinco capas: datos duros en mono (patrón `ETIQUETA:`/valor) para fecha, horario y lugar; un titular descomunal partido en dos (`SERES` / `MIGRATORIOS`) con contenido en el medio; sellos de tinta azul con textura de "mal entintado" y leve rotación; anotaciones manuscritas en azul-marcador, escaneadas de la letra real de cada persona; y fotos "pegadas" con borde blanco, sombra y rotación aleatoria.

Funciona porque cada capa remite a un objeto real y reconocible —un formulario, un sello de aduana, una carta escrita a mano, una foto pegada en un álbum— y esos objetos son, literalmente, los que atraviesa alguien que migra. La estética no ilustra el tema desde afuera: usa los objetos del trámite migratorio como material de diseño.

---

## 3. Color

### 3.1 Tokens

| Token | Hex | Uso |
|---|---|---|
| `papel` | `#FBFAF7` | Fondo base del sitio (blanco cálido; en piezas impresas, blanco puro con grano). |
| `papel-puro` | `#FFFFFF` | Bordes de fotos pegadas, tarjetas, cajas de nombre. |
| `tinta` | `#0B0B0B` | Texto principal, titulares, bordes de cajas. |
| `tinta-suave` | `#3A3A3A` | Texto secundario largo. |
| `grafito` | `#6B6B6B` | Metadatos, captions, estados deshabilitados. |
| `linea` | `#D9D6CF` | Divisores finos, bordes de inputs en reposo. |
| `azul-sello` | `#1B4BAF` | Sellos, escudo, logos de aliados, links, foco. |
| `azul-marcador` | `#0B2FCD` | Anotaciones manuscritas, subrayados, hover de links. |
| `azul-profundo` | `#0A2A78` | Hover/pressed de elementos azules, texto sobre fondos claros azules. |
| `azul-tinta-agua` | `#E4EAF8` | Fondo suave para bloques azules (tinta diluida). |
| `tricolor-amarillo` | `#F2C230` | Solo en `HiloTricolor` y logos de aliados. Nunca color de UI. |
| `tricolor-azul` | `#0033A0` | Ídem. |
| `tricolor-rojo` | `#E0393E` | Ídem. |

### 3.2 Contraste (ratio aproximado, WCAG)

| Par | Ratio | Lectura |
|---|---|---|
| `tinta` / `papel` | ≈ 18.8:1 | Supera AAA con margen amplio; texto por defecto. |
| `azul-sello` / `papel` | ≈ 7.5:1 | Supera AAA; links, sellos, texto pequeño. |
| `papel` / `tinta` | ≈ 18.8:1 | Mismo par invertido (ej. `Boton` en hover). |
| `azul-marcador` / `papel` | ≈ 8.7:1 | Alto en color puro; reservar igual para tamaños medianos/grandes, la manuscrita tiene trazos finos que reducen la legibilidad efectiva. |

Ratios calculados con la fórmula de luminancia de WCAG 2.x; son guía de sistema, no certificación por pieza (el grano de papel resta contraste real en un margen chico, ver §12).

### 3.3 Reglas y qué NO hacer
- Marca **bicolor**: tinta + azul-sello sobre papel. Tricolor solo en `HiloTricolor` o el logo de manos, nunca como fondo, botón o acento de UI.
- `azul-tinta-agua` es solo fondo, nunca texto. Sin degradados (salvo `HiloTricolor`, en rigor tres bloques sólidos contiguos).
- Ningún gris/azul fuera de la tabla. `grafito` no es para párrafos largos. `azul-marcador` no es color de cuerpo de texto.

---

## 4. Tipografía

| Rol | Fuente de marca | Fuente web (Google Fonts) | Fallback |
|---|---|---|---|
| `display` | **Anton** 400 (Google Fonts, SIL OFL 1.1) — definitiva en piezas y web desde el 06.09.2026 | **Anton** 400 | Impact, "Arial Narrow Bold", sans-serif |
| `mono` | Courier Bold | **Courier Prime** 400/700 | "Courier New", monospace |
| `manuscrita` | Letra real escaneada de cada persona (SVG/PNG); **Seres Manuscrita** (fuente propia, en desarrollo) para anotaciones de marca | **Gochi Hand** 400 (fallback hasta que exista Seres Manuscrita) | cursive |

**Decisión 06.09.2026 (v1.1):** no hay presupuesto para licenciar Serial A, así que **Anton** (Google Fonts, licencia SIL Open Font License 1.1: gratuita para web, impresión, redes y para instalar en Photoshop) pasa a ser la fuente `display` **definitiva de la marca**, en piezas y en web. Serial A queda descartada: los PSD deben rehacerse con Anton antes de producir piezas nuevas, porque la versión trial no puede usarse. Para lo manuscrito, el plan es crear una fuente propia, **Seres Manuscrita**, a partir de una plantilla escrita a mano por la misma persona que hizo el lettering azul de las piezas (A–Z, Ñ, acentos, números, signos; plantilla de Calligraphr o similar, fotografiada con buena luz, convertida a TTF y limpiada en FontForge); será de uso exclusivo del colectivo para anotaciones y claims. Las frases y firmas de cada fotógraf@ siguen siendo escaneos de su propia letra, nunca la fuente. Hasta que exista, el fallback sigue siendo Gochi Hand. Nunca usar Inter, Roboto, Arial ni Helvetica como tipografía visible.

### Escala

| Token | Valor | Uso |
|---|---|---|
| `display-xl` | `clamp(4.5rem, 16vw, 14rem)` | `SERES`/`MIGRATORIOS` en `TitularPartido`. |
| `display-lg` | `clamp(3rem, 9vw, 7.5rem)` | Titulares secundarios, menú mobile a pantalla completa. |
| `display-md` | `clamp(2rem, 5vw, 3.5rem)` | Logo de texto en `Nav`, títulos de sección. |
| cuerpo | `1rem` / `1.6`, máx. `65ch` | Párrafos largos. |
| etiqueta | `0.875rem`, 700, mayúsculas, `letter-spacing .04em` | `ETIQUETA:`/valor, `CajaNombre`, `Boton`, `Nav`. |
| metadatos | `0.8125rem` | Créditos de foto, fecha corta, captions. |
| manuscrita | `clamp(1.5rem, 4vw, 3rem)` | `Anotacion`, fallback de frases manuscritas. |

El tamaño de `etiqueta` no está fijado en px por el BRIEF (solo el tratamiento); `0.875rem` es propuesta de sistema para esta v1 — ver §13.

**Reglas:** `display` siempre MAYÚSCULAS, `line-height: 0.85`, `letter-spacing: -0.01em` (interlineado apretado, lee como bloque sólido). `mono` etiqueta: MAYÚSCULAS, `.04em`, 700; `mono` cuerpo: normal, 400, `1rem/1.6`, máx. `65ch`. `manuscrita`: siempre `azul-marcador`, nunca negro, rotación -3° a 2°, superpuesta al titular o al margen.

**Patrón `ETIQUETA:`/valor** — firma tipográfica del `BloqueFicha`, `FichaFotografo` y `SelloHorario`:

```
FECHA:
08.08.2026

HORARIOS:
10:00 AM – 19:00

LUGAR:
CONSULADO
Humberto Primo 3032
Buenos Aires, ARG
```

---

## 5. Espaciado, grilla y forma

- **Base 4 px.** `--espacio-1` a `--espacio-10` = 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px.
- **Contenedor** máximo 1280 px; márgenes 24 px mobile / 48 px desktop; grilla de 12 columnas, `gap` 24 px.
- **Radio: 0** en todo el sistema. Únicas excepciones: `Sello` circular (50%) y números en círculo de `SelloHorario`.
- **Bordes:** 2 px `tinta` en `CajaNombre`, `Boton` e inputs en foco; 1 px `linea` para divisores.
- **Sombra:** una sola en todo el sistema, exclusiva de `FotoPegada`: `0 1px 2px rgba(0,0,0,.18), 0 6px 14px rgba(0,0,0,.10)`.

El círculo es un gesto de sello, nunca un recurso decorativo de UI (sin avatares redondos, chips ni botones con esquinas suaves).

---

## 6. Texturas

Tres texturas, siempre SVG inline vía `data:` URI, reutilizadas tal cual de `canvas-base.html`:

**Grano de papel + motas** (fondo de cualquier pieza o sección, clase `.papel`):

```css
.papel { position: relative; background: var(--papel); isolation: isolate; }
.papel::before { content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 0; opacity: .07; mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>"); }
.papel::after { content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 0; opacity: .5;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='420' height='420'><g fill='%230B0B0B'><circle cx='23' cy='41' r='1.1'/><circle cx='131' cy='17' r='.8'/><circle cx='202' cy='96' r='1.3'/><circle cx='377' cy='58' r='.9'/><circle cx='88' cy='188' r='1'/><circle cx='301' cy='161' r='.7'/><circle cx='159' cy='266' r='1.2'/><circle cx='352' cy='289' r='.8'/><circle cx='47' cy='343' r='.9'/><circle cx='238' cy='372' r='1.1'/><circle cx='399' cy='401' r='.7'/><circle cx='118' cy='402' r='.9'/><circle cx='279' cy='238' r='.6'/><circle cx='11' cy='229' r='.8'/></g></svg>"); }
.papel > * { position: relative; z-index: 1; }
```

**Grano de sello** (máscara "mal entintada" sobre `Sello`, `Escudo`, `PalabrasClave`):

```css
.sello-grano { -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 2.2 -0.55'/></filter><rect width='100%' height='100%' fill='white'/><rect width='100%' height='100%' filter='url(%23n)' opacity='.85'/></svg>"); mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 2.2 -0.55'/></filter><rect width='100%' height='100%' fill='white'/><rect width='100%' height='100%' filter='url(%23n)' opacity='.85'/></svg>"); -webkit-mask-size: 200px 200px; mask-size: 200px 200px; }
```

**Foto pegada** (copia impresa: borde blanco + sombra):

```css
.foto-pegada { background: var(--papel-puro); padding: 8px; box-shadow: 0 1px 2px rgba(0,0,0,.18), 0 6px 14px rgba(0,0,0,.10); display: inline-block; }
.foto-pegada img { display: block; width: 100%; height: auto; }
```

**Caja de nombre** (base de `CajaNombre`, también usada como base visual de `Boton`):

```css
.caja-nombre { font-family: var(--fuente-mono); font-weight: 700; text-transform: uppercase; letter-spacing: .04em; border: 2px solid var(--tinta); background: var(--papel-puro); padding: 12px 24px; display: inline-flex; align-items: center; justify-content: center; min-height: 44px; box-sizing: border-box; }
```

**Hilo tricolor** (único lugar del sistema con el tricolor completo):

```css
.hilo-tricolor { height: 3px; width: 100%; background: linear-gradient(90deg, var(--tricolor-amarillo) 0 33.34%, var(--tricolor-azul) 33.34% 66.67%, var(--tricolor-rojo) 66.67% 100%); }
```

Estas seis clases (`.papel`/`.papel::before`/`.papel::after`, `.sello-grano`, `.foto-pegada`, `.caja-nombre`, `.hilo-tricolor`) están copiadas tal cual de `canvas-base.html`/`tokens.css`; no redibujarlas ni modificarlas acá sin actualizar también el canvas de Claude Design. Regla general: la opacidad de grano (`.06`–`.08`) y motas (`.35`) es baja a propósito para no comer contraste de texto; no subirla sin re-chequear contraste.

---

## 7. Componentes

Los 16 componentes del sistema, nombre canónico entre paréntesis (BRIEF §2.4):

1. **Bloque ficha (`BloqueFicha`)** — encabezado de expediente arriba de toda pieza; 3 columnas mono con `ETIQUETA:` y valor debajo (`FECHA:`, `HORARIOS:`, `LUGAR:`); sin variantes. Ejemplo: `FECHA: 08.08.2026` · `HORARIOS: 10:00 AM – 19:00` · `LUGAR: CONSULADO, Humberto Primo 3032, Buenos Aires, ARG`.
2. **Titular partido (`TitularPartido`)** — `SERES` arriba y `MIGRATORIOS` abajo en `display-xl`, centrados, con un slot central libre que admite `CajaNombre`, `Escudo`, una `Anotacion` con el claim, o combinaciones; el titular sigue siendo el ancla de lectura pase lo que pase en el slot. Ejemplo: slot con la anotación "LA FOTOGRAFÍA COMO REFUGIO EN EL EXILIO".
3. **Caja de nombre (`CajaNombre`)** — mono 700 mayúsculas, borde 2 px `tinta`, padding `12×24`, fondo `papel-puro`; una caja por persona, en **aparejo de ladrillo** (filas de 3 y de 2 alternadas, centradas), nunca en grilla uniforme. Ejemplo: `GABRIELA RONDÓN` · `RUBÉN MAVAREZ` · `LEO SIMMONS` / `DANIELA BARBERA` · `ANGELA PÉREZ`.
4. **Sello circular (`Sello`)** — SVG en `azul-sello` con `.sello-grano`: texto circular "SERES MIGRATORIOS" arriba, ciudad y fecha adentro, tres estrellas abajo, anillo doble, rotado ≈-12°. Variante con ciudad/fecha variables para futuras ediciones. Ejemplo: "SERES MIGRATORIOS" / "BUENOS AIRES" / "08 AGO 2026".
5. **Escudo (`Escudo`)** — escudo nacional de Venezuela en `azul-sello` con textura de sello y arco de 8 estrellas arriba; símbolo de dominio público, siempre SVG/PNG provisto, nunca redibujado en CSS. Ejemplo: en el slot de `TitularPartido`, junto a "EXPERIENCIA FOTOGRÁFICA EN APOYO A VENEZUELA".
6. **Anotación manuscrita (`Anotacion`)** — palabra o frase corta en `azul-marcador`, manuscrita (escaneo real o `Gochi Hand` de fallback), rotada -3° a 2°, siempre superpuesta a otro elemento, nunca sola en un espacio vacío. Ejemplo: "EXPONEN", "FOTÓGRAFOS", "LA FOTOGRAFÍA COMO REFUGIO EN EL EXILIO".
7. **Foto pegada (`FotoPegada`)** — borde 6–10 px `papel-puro`, `--sombra-foto`, rotación aleatoria -2° a 2° por instancia (se neutraliza con `prefers-reduced-motion`). Variantes: estándar, `recortada` (sin borde) y `sangrada` (pegada al borde del lienzo). Ejemplo: fotos de paisaje sangradas en las esquinas de `ref-poster-refugio.jpg`.
8. **Ficha de fotógrafo (`FichaFotografo`)** — número de 3 dígitos + NOMBRE en mono 700 (`001 HERICK FRONTADO`), foto principal, retrato pequeño superpuesto en la esquina inferior izquierda, frase manuscrita escaneada y firma debajo; la frase siempre como imagen de la letra real, salvo que falte el escaneo. Ejemplo: `001 HERICK FRONTADO` — *"El suspiro involuntario al verme rodeado de mi gente, como quien ve tierra firme en el horizonte."*
9. **Sello de horario (`SelloHorario`)** — números en círculo estilo sello (`⑩ AM` `⑦ PM`) y fecha corta en azul, tipografía condensada texturizada; junto con `Sello`, única otra excepción al radio 0. Ejemplo: `⑩ AM` `⑦ PM` / `8.8.26`.
10. **Palabras clave (`PalabrasClave`)** — `FAMILIA` / `RESILIENCIA` / `EXILIO` apiladas, condensadas, `azul-sello` con textura de sello; horizontal o vertical en un margen, siempre las tres juntas y en ese orden. Ejemplo: columna vertical en el margen de `ref-poster-lista.jpg`.
11. **Franja de aliados (`FranjaAliados`)** — logos en fila, altura uniforme 32–40 px, monocromo `azul-sello` salvo el logo tricolor de manos, separación 40 px. Ejemplo: `CONSULADO` · logo tricolor de manos [a confirmar] · `infiltrado™` · `CCC` [a confirmar].
12. **Hilo tricolor (`HiloTricolor`)** — línea de 3 px en tres tramos iguales amarillo/azul/rojo; detalle de `Pie` o de badge de edición, nunca divisor genérico. Ejemplo: sobre el `Pie`, entre `FranjaAliados` y `Sello`.
13. **Botón (`Boton`)** — mono 700 mayúsculas, borde 2 px `tinta`, padding `14×24`, fondo `papel-puro`, altura mínima 44 px. Estados: hover fondo `tinta`/texto `papel`; foco `outline` 2 px `azul-sello` offset 2 px. Variante `sello`: borde y texto `azul-sello`, hover `azul-profundo`. Ejemplo: `POSTULATE`, `SUMATE`.
14. **Campo de formulario (`Campo`)** — etiqueta mono 700 mayúsculas arriba, input mono 400, borde inferior 2 px `tinta`. Estados: foco `azul-sello`; error `#B3261E` con mensaje mono (nunca manuscrita). Ejemplo: campos del formulario de convocatoria — nombre, ciudad, país, email, Instagram, portfolio, disciplina, edición, mensaje, consentimiento.
15. **Navegación (`Nav`)** — barra superior estilo ficha: logo de texto "SERES MIGRATORIOS" en `display-md` a la izquierda, links mono 700 mayúsculas, selector `ES / EN` como `CajaNombre` pequeña. Variante mobile: menú a pantalla completa en `papel` con links en `display-lg`. Ejemplo: links a Manifiesto, Fotógraf@s, Ediciones, Convocatoria, Apoyar.
16. **Pie (`Pie`)** — `FranjaAliados` + `HiloTricolor` + `Sello` + datos de contacto mono + "Aguante la fotografía", en ese orden fijo; si faltan datos de contacto van como placeholder, el bloque nunca se omite. Ejemplo: cierre con "¡Aguante la fotografía!" y `[EMAIL DE CONTACTO]` / `[INSTAGRAM DEL PROYECTO]`.

---

## 8. Composición de piezas

**Post 1080×1080** — de arriba abajo: `BloqueFicha` (encabezado, 3 columnas) → `TitularPartido` (`SERES` / slot / `MIGRATORIOS`) → sellos (`Sello`, a veces `SelloHorario`) en los márgenes o superpuestos al titular, nunca sobre el texto principal → `FranjaAliados` al pie. El slot central es el espacio flexible: ahí van las `CajaNombre` en **aparejo 3/2** (filas de 3 y de 2 alternadas), la `Anotacion` del claim, el `Escudo`, o `PalabrasClave` en el margen. Las `FotoPegada` sangradas pueden ocupar las esquinas del lienzo.

**Story 1080×1920** — misma jerarquía vertical, pero el formato angosto 9:16 pide un aparejo más vertical: en vez de 3/2, el slot central usa **aparejo 2/1** (filas de 2 y de 1 alternadas). Los sellos suelen ir apilados en un lateral, y `SelloHorario` gana protagonismo por el espacio vertical disponible.

En ambos formatos, el `BloqueFicha` nunca se omite en piezas de convocatoria o difusión: ancla la pieza a un lugar y una fecha concretos.

---

## 9. Do / Don't

| Hacer | No hacer |
|---|---|
| Tinta negra + azul-sello como paleta principal sobre papel. | Usar el tricolor como acento de UI (botones, links, fondos). |
| `SERES`/`MIGRATORIOS` en mayúsculas, `line-height: 0.85`. | Titular en minúsculas o con interlineado suelto. |
| Anton (display) y Courier Prime (mono). | Inter, Roboto, Arial o Helvetica en cualquier pieza visible. |
| Manuscrita siempre en `azul-marcador`, rotada -3° a 2°. | Manuscrita en negro o sin rotación: pierde el gesto de intervención a mano. |
| Bordes rectos (radio 0) en cajas, botones e inputs. | Redondear esquinas fuera de `Sello` y los números en círculo. |
| `FotoPegada` con borde blanco, sombra y rotación leve. | Fotos sin recorte/borde "pegado" en posts y stories. |
| Patrón `ETIQUETA:`/valor para todo dato duro. | Mezclar etiqueta y valor en el mismo peso/tamaño o en minúsculas. |
| `Escudo` como imagen SVG/PNG intacta. | Redibujar el escudo en CSS o alterar sus proporciones y colores. |
| Grano y motas en opacidad baja (`.06`–`.08` / `.35`). | Subir la opacidad del grano al punto de afectar el contraste del texto. |
| Orden fijo `BloqueFicha` → `TitularPartido` → slot → sellos → `FranjaAliados`. | Quitar el `BloqueFicha` o alterar esa jerarquía en piezas de convocatoria. |

---

## 10. Assets

### Disponibles en `assets/` (referencia, no producción final)

| Archivo(s) | Para qué sirve |
|---|---|
| `ref-poster-exponen.jpg`, `ref-poster-lista.jpg`, `ref-poster-refugio.jpg`, `ref-poster-escudo.jpg` | Composición completa de post: `BloqueFicha`, `TitularPartido`, aparejo de `CajaNombre`, sellos, `FranjaAliados`. |
| `ref-collage.jpg` | Collage de `FotoPegada` con `PalabrasClave`. |
| `ref-fotografos-001-004.jpg`, `ref-fotografos-005-007.jpg` | `FichaFotografo`: número, foto, retrato, frase manuscrita, firma. |
| `ref-story.jpg` | Formato story 9:16 y aparejo 2/1. |
| `el-sello.jpg`, `el-escudo.jpg` | Recortes de referencia de `Sello` y `Escudo` (rasterizados). |
| `lettering-exponen.jpg`, `lettering-refugio.jpg` | Anotaciones manuscritas "EXPONEN" y el claim de refugio. |
| `logos-aliados.jpg`, `cajas-nombres.jpg`, `bloque-info.jpg`, `sello-horario.jpg`, `familia-resiliencia-exilio.jpg`, `ficha-fotografo.jpg` | Recortes de referencia de `FranjaAliados`, `CajaNombre`, `BloqueFicha`, `SelloHorario`, `PalabrasClave` y una `FichaFotografo` individual. |
| `titulo-seres.jpg`, `titulo-migratorios.jpg` | Cada mitad del titular partido por separado. |

Todos son referencia visual de los PSD/AI originales, no los assets finales del sitio (rasterizados, comprimidos, a veces recortados de forma imprecisa).

### Pendiente de producir para el sitio (v1)
- **SVG del `Sello`** vectorizado, texto circular editable, textura `.sello-grano` aplicable por CSS.
- **SVG del `Escudo`** de Venezuela, monocromo `azul-sello`, arco de 8 estrellas, proporciones fieles al símbolo oficial.
- **Escaneos vectorizados de las letras manuscritas** de cada fotógraf@ (frases + firmas) como SVG o PNG transparente, para `FichaFotografo` y `Anotacion`.
- **Logos de aliados en SVG**, monocromo `azul-sello` a altura uniforme: `CONSULADO`, logo tricolor de manos [a confirmar], `infiltrado™`, `CCC` [a confirmar]; el logo de manos es la única excepción de color en `FranjaAliados`.
- Origen de todo lo anterior: los PSD/AI en la Mac de Ruben, `~/Downloads/Diseño/` (`Seres-migratorios-post.psd`, `Seres-migratorios-post2.psd`, `Seres_Migratorios_Story.psd`, `Seresigratorios_Post_armado.psd`, `sereies migratorios.ai`).

---

## 11. Movimiento

_Sección nueva en v1.2 (06 sep 2026), a partir de la propuesta de Rubén (`movimiento-y-animacion.md`). Reemplaza la regla anterior de "sin fades de entrada" por un permiso acotado; siguen prohibidos bounces, parallax y loops._

### 11.1 Principio

El movimiento del sistema es el de un objeto de papel, no el de una app: una foto que se apoya, un sello que estampa, una ficha que entra en el campo de visión. Nada flota, nada rebota, nada se arma letra por letra. Regla operativa: **si al quitar la animación la página se ve igual de bien, la animación está bien calibrada.** El movimiento acompaña la lectura; no la produce.

### 11.2 Sin librerías

Todo se resuelve con CSS nativo: scroll-driven animations para las entradas y View Transitions **cross-document** (`@view-transition { navigation: auto }` más `view-transition-name` en el elemento que persiste) para el cambio de página. No se incorpora ninguna librería de animación (Framer Motion, GSAP, Motion, kits animados) ni el `<ClientRouter />` de Astro: el sitio sigue siendo `output: 'static'` sin JavaScript de navegación, y así el POST del formulario de convocatoria nunca queda interceptado por un router. Si algún día se adopta `<ClientRouter />`, el `<form>` lleva `data-astro-reload`. Si aparece una secuencia que CSS no puede expresar, se evalúa el paquete `motion` (vanilla) como excepción documentada, nunca como dependencia por defecto.

### 11.3 Tokens

| Token | Valor | Uso |
|---|---|---|
| `--duracion-rapida` | `150ms` | Hover y foco: links, `Boton`, `CajaNombre`. |
| `--duracion-media` | `250ms` | Menú mobile de `Nav`, lightbox de `/artistas/[slug]`. |
| `--duracion-entrada` | `350ms` | Entradas por carga de página (el `Sello` y el claim del hero). No aplica a las entradas por scroll: ahí la duración la fija el rango. |
| `--desfase-entrada` | `40ms` | Escalonado entre hermanos en las entradas por carga (hero). |

Curvas: `ease` para hover y estados, `ease-out` para entradas. Ninguna curva con overshoot ni `cubic-bezier` con rebote.

### 11.4 Qué se anima

| Componente | Gesto | Cómo |
|---|---|---|
| `Sello` | Estampado: opacidad 0 → 1 con `scale` 1.06 → 1. | Entrada por scroll (por carga en el hero). Nunca gira al aparecer: la rotación es estática. |
| `FotoPegada` | Se apoya: opacidad más `translate` de 12 px hacia arriba. | Entrada por scroll. |
| `FichaFotografo` | Igual que `FotoPegada`; cada ficha entra cuando aparece en el viewport. | Entrada por scroll, sin escalonado artificial. |
| `CajaNombre` en `Aparejo` | Entrada fila por fila: cada fila es una unidad `[data-entrada]`. | Entrada por scroll; sin CSS generado por índice. |
| `HiloTricolor` | Barrido de izquierda a derecha con `clip-path`. | Solo en el `Pie` (una vez por página). Sujeto a prueba en dispositivo: si se lee como barra de carga, queda estático. |
| `Boton`, links, `Nav` | Cambio de color de fondo y texto. | Transición de `--duracion-rapida`. |
| `Nav` mobile, lightbox | Apertura y cierre. | `@starting-style` + `transition-behavior: allow-discrete` sobre `<dialog>`, `--duracion-media`. |
| Cambio de página | El `TitularPartido` persiste entre Home e internas. | View Transitions cross-document, `view-transition-name: titular`. |

### 11.5 Qué no se anima

`TitularPartido` (ancla de lectura: sólido desde el primer frame) y `BloqueFicha` (dato duro). Texto letra por letra o efecto máquina de escribir: la mono ya evoca la máquina. Parallax, bounce, loops, spinners decorativos, hover que agranda fotos. Las rotaciones existentes de `FotoPegada`, `Anotacion` y `Sello`: son estáticas y ninguna animación las toca. Nada por debajo del pliegue que retenga contenido: el sitio se lee completo sin JavaScript y sin soporte de animaciones.

### 11.6 Implementación

Las entradas por scroll van con `animation-timeline: view()`, sin JavaScript ni `IntersectionObserver`. Dos envoltorios obligatorios en cada bloque de entrada:

```css
@media (prefers-reduced-motion: no-preference) {
  @supports ((animation-timeline: view()) and (animation-range: entry)) {
    @keyframes entrada-papel {
      from { opacity: 0; translate: 0 12px; }
    }
    [data-entrada] {
      animation: entrada-papel auto ease-out backwards;
      animation-timeline: view();
      animation-range: entry 0% entry 60%;
    }
  }
}
```

Cuatro reglas que no se negocian: (1) el `@supports` incluye `animation-range: entry`; sin esa condición pasan navegadores con soporte parcial y los elementos quedan invisibles. (2) Nada arranca oculto fuera del `@supports`: ningún `opacity: 0` en el CSS base; el estado inicial lo pone `backwards` desde adentro del bloque. (3) Solo `opacity`, `translate`, `scale` y `clip-path`; nunca la propiedad `transform`, que ya usan las rotaciones estáticas y se pisaría. (4) `animation-duration: auto` en las animaciones de scroll; `--duracion-entrada` es solo para las entradas por carga.

### 11.7 Movimiento reducido

`prefers-reduced-motion: reduce` es el estado por defecto de esta sección, no una excepción: todo el movimiento de 11.4 vive dentro de `@media (prefers-reduced-motion: no-preference)`, así que con la preferencia activada el sitio queda exactamente como el diseño aprobado el 06.09.2026. Sigue vigente el bloque de `tokens.css` que neutraliza las rotaciones estáticas y fuerza `scroll-behavior: auto`; las View Transitions también se desactivan bajo esa preferencia.

---

## 12. Accesibilidad

- **Contraste:** `azul-sello`/`papel` cumple AA/AAA (§3.2); `azul-marcador` cumple en color puro pero se reserva para tamaños medianos/grandes por ser manuscrita de trazo fino.
- **Foco visible:** todo interactivo (`Boton`, `Campo`, links de `Nav`) lleva `outline` 2 px `azul-sello`, offset 2 px.
- **Movimiento reducido:** `prefers-reduced-motion: reduce` neutraliza rotaciones de `FotoPegada`, `Anotacion` y `Sello`, apaga las entradas de §11 y reduce a casi cero transiciones/animaciones (bloque `@media` en `tokens.css` y `tailwind-theme.css`).
- **Texto alternativo:** toda imagen lleva `alt`; las frases manuscritas usadas como imagen llevan el texto completo de la frase, no una descripción genérica.
- **Grano de papel:** opacidad baja calibrada para no interferir con el contraste; si una pieza combina grano + `azul-marcador` + tamaño chico, verificar contraste real antes de publicar.
- **Formularios:** el error (`#B3261E`) siempre va con mensaje de texto mono, nunca solo cambio de color de borde.

---

## 13. Pendientes y versionado

**v1 — 05 sep 2026.** Este documento, `tokens.css`, `tokens.json` y `tailwind-theme.css` son la v1 del Design System, derivada íntegramente del BRIEF.

**v1.1 — 06 sep 2026.** Anton pasa a ser la display definitiva (Serial A descartada por costo de licencia); se define el plan de la fuente propia Seres Manuscrita; Instagram oficial @seresmigratorios; `etiqueta` confirmada en 0.875rem; 56 assets con transparencia real extraídos de los PSD (ver `assets-fuente/`).

**v1.2 — 06 sep 2026.** Entra §11 Movimiento (propuesta de Rubén aprobada por el tech lead con tres ajustes: View Transitions cross-document sin `<ClientRouter />`, escalonado del `Aparejo` por fila, barrido del `HiloTricolor` solo en el `Pie` y sujeto a prueba); Accesibilidad pasa a §12 y esta sección a §13. Tokens nuevos `--duracion-entrada` (350ms) y `--desfase-entrada` (40ms) en `tokens.css`, `tokens.json` y `tailwind-theme.css`. El párrafo "Movimiento" del `readme.md` del design system en Claude Design se actualiza en consecuencia.

Pendientes: rehacer los PSD con Anton; producir la plantilla y el TTF de Seres Manuscrita; nombres de los aliados (Rubén los corrige directamente en la web); handles pendientes (Pati Caro @huella.solar, Leo Simmons film @xlsimio, Gabriela Rondón, Gustavo Sánchez); SVG del Sello y del Escudo para impresión grande.

**Cómo se propone un cambio:** cualquier ajuste a un token o componente se propone como cambio puntual sobre estos mismos archivos (no se reescribe el documento entero), se anota en esta sección como pendiente hasta que el tech lead lo confirme, y solo entonces sube de versión (v1 → v1.1) con fecha y changelog breve al inicio del archivo. Ningún agente cambia un token o un nombre de componente por su cuenta: si algo parece un error, se documenta como OBSERVACIÓN en la entrega, nunca se corrige unilateralmente.
