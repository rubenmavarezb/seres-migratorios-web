# Seres Migratorios — Design System v1

Sistema de diseño del colectivo fotográfico **Seres Migratorios**: diáspora venezolana en Buenos Aires, nacido en julio de 2026 a partir de la convocatoria (reel del 13.07.2026) de **Herick Frontado** para documentar el exilio y recaudar fondos para las víctimas de los terremotos en Venezuela. Primera edición: **sábado 08.08.2026, 10:00 a 19:00, CONSULADO** (Humberto Primo 3032, Buenos Aires, ARG): recorrido fotográfico por siete sets (001–007), exposición de nueve artistas, música en vivo, café de especialidad y postres venezolanos.

Tres palabras: **FAMILIA · RESILIENCIA · EXILIO**. Claim: "La fotografía como refugio en el exilio". Subtítulo: "Experiencia fotográfica en apoyo a Venezuela". Cierre: "¡Aguante la fotografía!" / "Unidos por la reconstrucción".

Superficies que cubre: **piezas gráficas** para Instagram (post 1080×1080, story 1080×1920) y el **sitio web** (Astro 5 + Tailwind v4, ES/EN, en planificación). Usuario principal: Rubén Mavarez (@rubenmavarezb), diseño y marca. Instagram oficial del colectivo: **@seresmigratorios** (https://www.instagram.com/seresmigratorios/).

## Fuentes consultadas

- Carpeta local montada `Seres Migratorios/` (en la Mac de Rubén: `~/Documents/Seres Migratorios/`): `00-BRIEF-tecnico.md` (fuente de verdad de tokens y componentes), `01-Proyecto/contexto-historia.md`, `01-Proyecto/instrucciones.md`, `02-Design-System/design-system.md`, `tokens.css`, `tokens.json`, `tailwind-theme.css`, `canvas/*.dc.html`, `assets/*.jpg`; `03-Web/PLAN.md`, `sitemap.md`, `modelo-de-contenido.md`, `CLAUDE.md`, `backlog.md`.
- Piezas originales de la edición 01 (JPEG en `uploads/`, copiadas a `assets/piezas/`): post escudo, post collage, post refugio, posts fotógrafos 1–2, post exponen, post lista, story lista. PSD originales (`~/Downloads/Diseño/*.psd`): el 06.09.2026 se extrajeron sus capas (escudo, sellos, letras manuscritas, logos, retratos y obra) como PNG con transparencia real a `assets/`.
- Canvas anterior en Claude Design: https://claude.ai/code/artifact/50dc4200-edb3-47f0-a24e-41c91544befd
- Links oficiales: reel de convocatoria https://www.instagram.com/reel/DavMRiQJ9uB/ · post del evento https://www.instagram.com/p/DbdlYPyFuaH/ · venue @consulado.ba.

## Regla de oro

**No inventar datos.** Fechas, nombres, handles, cifras y links solo si están confirmados. Lo que falta va entre corchetes: `[FECHA PRÓXIMA EDICIÓN]`, `[LINK DONACIONES]`, `[DOMINIO]`, `[EMAIL DEL COLECTIVO]`. El Instagram del colectivo ya no es placeholder: @seresmigratorios.

---

## CONTENT FUNDAMENTALS

**Idioma.** Español, registro neutro con guiños rioplatenses y venezolanos ("aguante", "convocatoria"). Inglés bajo `/en/` en la web; no se traducen nombres propios, CONSULADO, handles, "Seres Migratorios", FAMILIA / RESILIENCIA / EXILIO, "¡Aguante la fotografía!" ni las frases manuscritas.

**Voz.** Directa, cálida, colectiva: siempre "nosotros" ("buscamos", "entendemos"), nunca institucional. Orgullo venezolano sin solemnidad. Humor leve ("Toooda ayuda es bienvenida"). Frases cortas. Voseo suave en llamados a la acción: **Postulate · Sumate · Vení · Seguinos**. Nada de "nos complace anunciar".

**Casing.** Titulares display SIEMPRE en mayúsculas (aplicadas con `text-transform`, el contenido se escribe con su capitalización real). Etiquetas de datos en mayúsculas mono 700 con el patrón `ETIQUETA:` en una línea y valor debajo (`FECHA:` / `08.08.2026`). Cuerpo en mono 400 con capitalización normal. Nombres de fotógraf@s con número de tres dígitos: `001 HERICK FRONTADO`.

**Emojis.** Nunca en el sitio ni en piezas. Solo en copy pensado para publicar en Instagram.

**Textos literales aprobados.**
- Manifiesto (citar entre comillas, post del 31.07.2026): "En la vorágine de la rutina en el exilio buscamos la manera de ayudar, de agruparnos y compartir esto que sentimos en el pecho, de mirar a los ojos a quienes comparten un dolor que no se puede describir en palabras y que tratamos de codificar en una imagen, un retrato. En momentos como estos entendemos la importancia de la fotografía, y de nuestra labor como fotograf@s".
- Frases manuscritas (van como imagen escaneada de la letra real; el texto completo va en el `alt`): Herick Frontado — "El suspiro involuntario al verme rodeado de mi gente, como quien ve tierra firme en el horizonte." Angela Pérez — "Habitar con fe los nuevos espacios, reconstruir la identidad en ellos y transmitir esa esperanza a las personas con las que comparto." Andrea Cubillán — "La conexión con mi raíz es inquebrantable, no se borra, puedo volver a mi casa a través de todo lo que permanece en mi memoria." Leo Simmons — "Fragmentos de una memoria interrumpida que sobrevive y encuentra en la fotografía una forma de permanecer."
- Estructura de un copy de convocatoria para Instagram: cuándo, dónde, qué es, cómo será el recorrido, quiénes participan, café y comida, música, exposición, y cierre "¡Aguante la fotografía!".

**Estados vacíos son diseño.** Sin edición próxima: el BloqueFicha muestra `[PRÓXIMA EDICIÓN A CONFIRMAR]` con la anotación "La próxima se anuncia por acá". Convocatoria cerrada: la página no desaparece; CajaNombre en grafito "CONVOCATORIA CERRADA".

**Personas y aliados confirmados** (única lista válida): fotean 001 Herick Frontado @herickfrontado · 002 Naia Guanipa @naianaianaia · 003 Angela Pérez @angelaluisap · 004 Pati Caro (@huella.solar a confirmar) · 005 Andrea Cubillán @andreacubillany · 006 Carlos Vázquez @carlsvsqz · 007 Leo Simmons (@xlsimio a confirmar). Exponen: Gabriela Rondón, Rubén Mavarez @rubenmavarezb, Leo Simmons, Daniela Barbera @danielabarbeera, Angela Pérez, Sofía Martín, Rona Rangel @ronarangel, Kremlin Prieto @elkremlin, Gustavo Sánchez. Música: MIG, HOOCH, NAIA, MAVAREZ, GROOVE CARGO, RAWM. Aliados: CONSULADO Custom & Craft (@consulado.ba), logo tricolor de manos [a confirmar], infiltrado™ (@infiltrado.tm), CCC [a confirmar].

---

## VISUAL FOUNDATIONS

**Concepto.** Un expediente migratorio intervenido a mano. Cinco capas que remiten a objetos reales del trámite de migrar: el formulario (datos mono), el titular de imprenta (display condensado partido en dos), el sello de aduana (azul, mal entintado), la carta a mano (anotación en bolígrafo azul) y la foto pegada en el álbum (borde blanco, rotación).

**Color.** Marca **bicolor**: `tinta #0B0B0B` + `azul-sello #1B4BAF` sobre `papel #FBFAF7`. Apoyo: `papel-puro #FFFFFF` (fotos, cajas), `tinta-suave #3A3A3A`, `grafito #6B6B6B` (metadatos), `linea #D9D6CF` (divisores). Azules: `azul-marcador #0B2FCD` (manuscrito, hover), `azul-profundo #0A2A78` (pressed), `azul-tinta-agua #E4EAF8` (fondo suave, nunca texto). Tricolor `#F2C230 / #0033A0 / #E0393E` **solo** en el HiloTricolor de 3 px o el logo tricolor de manos. Error `#B3261E`. **Sin degradados** (el hilo son tres bloques sólidos). Ningún gris o azul fuera de la tabla.

**Tipografía.** `display`: **Anton** (Google Fonts, SIL OFL 1.1), fuente de marca definitiva desde el 06.09.2026 en piezas y en web (Serial A, que aparecía en los PSD como trial, quedó descartada por costo de licencia). Siempre MAYÚSCULAS, `line-height .85`, `letter-spacing -.01em`. Escala: xl `clamp(4.5rem,16vw,14rem)`, lg `clamp(3rem,9vw,7.5rem)`, md `clamp(2rem,5vw,3.5rem)`. `mono`: **Courier Prime** 400/700 (sustituye a Courier Bold): etiquetas 0.875rem 700 mayúsculas ls .04em; cuerpo 1rem/1.6 máx 65ch; metadatos 0.8125rem. `manuscrita`: **letra real escaneada** de cada persona (PNG/SVG) para frases y firmas; para anotaciones de marca se está creando la fuente propia **Seres Manuscrita** (a partir del lettering azul de las piezas); **Gochi Hand** solo fallback mientras tanto. Siempre azul-marcador, rotada -3° a 2°, superpuesta a otro elemento. Prohibidas como tipografía visible: Inter, Roboto, Arial, Helvetica.

**Espaciado y layout.** Base 4 px (4, 8, 12, 16, 24, 32, 48, 64, 96, 128). Contenedor máx 1280 px, márgenes 24 mobile / 48 desktop, 12 columnas gap 24. Nav fija estilo ficha con borde inferior 1 px `linea`. Composición de piezas: BloqueFicha → TitularPartido con slot → sellos en márgenes → FranjaAliados. El aparejo de ladrillo (3/2 en post, 2/1 en story) reemplaza a la grilla uniforme.

**Forma.** **Radio 0** en todo. Únicas excepciones: Sello circular y números en círculo del SelloHorario (50%). Bordes 2 px `tinta` en cajas, botones, inputs en foco; 1 px `linea` en divisores. Nada de píldoras, chips redondos ni avatares circulares.

**Sombras.** Una sola en todo el sistema, exclusiva de FotoPegada: `0 1px 2px rgba(0,0,0,.18), 0 6px 14px rgba(0,0,0,.10)`. Sin sombras internas, sin elevación en tarjetas o botones.

**Fondos y texturas.** Papel con grano (`feTurbulence` fractalNoise .9, 3 octavas, opacity .07, multiply) + motas negras de 0.6–1.3 px a .5 (`.papel`). Grano de sello (`feTurbulence` 1.4, 2 octavas) como `mask-image` sobre cualquier elemento azul (`.sello-grano`): sellos, escudo, palabras clave, fecha corta. Nunca imágenes de fondo full-bleed ni ilustraciones; la imagen siempre es una foto "pegada" o "sangrada" al borde del lienzo.

**Imagen.** Fotografía documental con grano de película: paisaje venezolano, retratos en la ciudad de acogida, objetos del trámite (cédula, pasaporte, billetes). Color natural cálido o blanco y negro; sin filtros de color ni degradados de protección. Tres tratamientos: `pegada` (borde blanco 8 px, sombra, rotación -2° a 2°), `recortada` (sin borde, como recorte de revista), `sangrada` (cortada por el borde del lienzo). Logos de aliados y escudo van con `mix-blend-mode: multiply` sobre el papel.

**Estados.** Hover de botón: fondo tinta, texto papel (150 ms). Hover de link: azul-marcador; pressed: azul-profundo. Sin cambios de escala ni opacidad. Foco: outline 2 px azul-sello, offset 2 px. Deshabilitado: grafito con opacidad .7. Error: borde y etiqueta `#B3261E` más mensaje mono (nunca solo color).

**Movimiento.** Casi nulo: transiciones 150 ms (hover) y 250 ms (menú mobile, lightbox), `ease`. Las rotaciones son estáticas; `prefers-reduced-motion` las anula. Sin fades de entrada, sin bounces, sin parallax.

**Transparencia y blur.** No se usan (salvo el multiply de texturas y logos). El menú mobile es papel opaco a pantalla completa.

**Tarjetas.** No existen como concepto: lo que se agrupa es una CajaNombre (borde 2 px, radio 0, fondo papel-puro) o una FotoPegada. Nada con sombra + borde redondeado.

---

## ICONOGRAPHY

No hay sistema de íconos ni fuente de íconos. La marca no usa pictogramas: la iconografía son **sellos y símbolos oficiales**.

- **Sello** circular: capa real `assets/marca/sello.png` (preferida; `<Sello src>`) o SVG propio en `components/sellos/Sello.jsx` para ciudades/fechas nuevas.
- **Escudo** nacional de Venezuela con arco de 8 estrellas (dominio público), siempre como imagen `assets/marca/escudo.png` (529×653, PNG con transparencia real, capa original del PSD); nunca redibujado.
- **Números en círculo** ⑩ ⑦ del SelloHorario, con borde 2 px.
- **Estrellas** de cinco puntas, solo dentro del sello y del escudo.
- **Logos de aliados** en `assets/logos/` (PNG con transparencia real, extraídos de las capas de los PSD originales; el SVG vectorial sigue pendiente): consulado (299×106), manos-tricolor (única excepción a color), infiltrado, ccc. Monocromo azul-sello, 32–40 px de alto.
- Unicode como ícono: solo el chevron del select se marca con texto mono. No hay flechas, hamburguesas ni checkmarks dibujados: el menú mobile es un botón que dice "MENÚ" / "CERRAR"; el checkbox es un cuadrado de 2 px que se rellena de tinta.
- Emojis: nunca en UI ni piezas.

Si un consumidor necesita un ícono funcional (cerrar lightbox, flecha de galería), usar texto mono en mayúsculas ("CERRAR", "←", "→") antes que un set de íconos.

**Logo.** No existe un logotipo dibujado: la marca es el **titular tipográfico** "SERES / MIGRATORIOS" en display (recortes de referencia en `assets/marca/titulo-seres.png` y `titulo-migratorios.png`) más el Sello. No se creó ningún logo nuevo.

---

## Tokens

`styles.css` (solo `@import`) → `tokens/fonts.css` (Google Fonts: Anton, Courier Prime, Gochi Hand), `tokens/colors.css` (base + alias semánticos `--texto-*`, `--enlace*`, `--foco`), `tokens/typography.css`, `tokens/spacing.css` (espacios, contenedor, bordes, radios, sombra, z-index), `tokens/texturas.css` (body/a base, `.papel`, `.sello-grano`, `.display`, `.etiqueta`, `.manuscrita`, `.foto-pegada`, `.caja-nombre`, `.hilo-tricolor`, `prefers-reduced-motion`).

**Fuentes:** no hay archivos de fuente; todo viene de Google Fonts. Anton es la display definitiva (no hay licencia de Serial A que esperar). Cuando exista Seres Manuscrita, agregar su `@font-face` en `tokens/fonts.css` y cambiar `--fuente-manuscrita`.

## Components

Namespace del bundle: `window.SeresMigratoriosDesignSystem_0c7dc7`. Nombres canónicos del BRIEF, en español.

- `components/expediente/` — **BloqueFicha**, **TitularPartido**, **CajaNombre**, **Aparejo**, **Anotacion**, **PalabrasClave**, **HiloTricolor**
- `components/sellos/` — **Sello**, **Escudo**, **SelloHorario**
- `components/fotos/` — **FotoPegada**, **FichaFotografo**
- `components/aliados/` — **FranjaAliados**
- `components/formularios/` — **Boton**, **Campo**
- `components/navegacion/` — **Nav**, **Pie**

**Intentional additions:** `Aparejo` (no está en la lista canónica; implementa la regla de disposición en aparejo de ladrillo de las CajaNombre, que el BRIEF describe como comportamiento y no como componente).

## UI kits

- `ui_kits/web/` — sitio web (Home, Fotógrafos, Convocatoria, Manifiesto) con Nav interactiva y selector ES/EN.
- `ui_kits/piezas/` — piezas gráficas: Post 1080×1080 (variantes exponen / claim / escudo) y Story 1080×1920.

## Índice

```
readme.md · SKILL.md · styles.css · thumbnail.html
tokens/           fonts.css · colors.css · typography.css · spacing.css · texturas.css
guidelines/       21 tarjetas: Colors (5) · Type (5) · Spacing (4) · Brand (7)
components/       expediente/ · sellos/ · fotos/ · aliados/ · formularios/ · navegacion/  (jsx + d.ts + prompt.md + *.card.html)
ui_kits/          web/ · piezas/
assets/           (marca/, manuscritas/, logos/, retratos/ y obra/ son PNG con transparencia real, extraídos capa por capa de los PSD originales el 06.09.2026; ya no hace falta `multiply` para ocultar el fondo de papel)
  marca/          escudo.png (529×653) · sello.png (432×432) · sello-compacto.png · sello-horario.png (⑩ AM ⑦ PM) · fecha-corta-8-8-26.png · palabras-clave.png (FAMILIA / RESILIENCIA / EXILIO, 376×281) · titulo-seres.png · titulo-migratorios.png (Serial A original, rasterizados) · subtitulo-experiencia.png
  manuscritas/    claim-refugio (653×277) · claim-refugio-compacto · exponen · fotografos · frase + firma de herick-frontado, andrea-cubillan y carlos-vazquez · frase de angela-perez, leo-simmons, naia-guanipa y pati-caro (las 7 personas del recorrido 001–007)
  logos/          consulado · manos-tricolor · infiltrado · ccc
  retratos/       herick-frontado · angela-perez · andrea-cubillan · carlos-vazquez · leo-simmons (retratos de cuerpo entero en estudio, fondo neutro, ~340×420) · pati-caro (114×114, único disponible)
  obra/           fotos por autor tal como están en las piezas: herick-frontado-01/02 · angela-perez-01/02/03 · andrea-cubillan-01 · carlos-vazquez-01 · leo-simmons-01 · naia-guanipa-01/02 · pati-caro-01 · kremlin-prieto-01/02 · ruben-mavarez-01/02 · sofia-martin-01…05 · pusadolfo-01 (autor por confirmar: @pusadolfo) · sin-atribuir-sombrero · sin-atribuir-puente
  fotos/          26 recortes de las piezas (versión anterior, con fondo; preferir obra/)
  piezas/         8 piezas completas de la edición 01 (posts y story)
```

## Pendientes

- Rehacer los PSD con **Anton** (los títulos SERES/MIGRATORIOS usan la trial de Serial A, que ya no se usa).
- Producir la fuente propia **Seres Manuscrita**: plantilla escrita a mano por la autora o autor del lettering azul, foto/escaneo, TTF y limpieza.
- Sello, Escudo, logos, letras manuscritas, retratos y obra ya están como PNG con transparencia real, extraídos de las capas de los PSD (06.09.2026). Queda pendiente solo la versión SVG del Sello y del Escudo para escalarlos sin límite en impresión grande.
- Nombres de los aliados (logo tricolor de manos, CCC): Rubén los corrige directamente en la web. Handles pendientes: Pati Caro, Leo Simmons, Gabriela Rondón, Gustavo Sánchez, MAVAREZ.
- Dominio y links de donación (el Instagram ya está: @seresmigratorios).
- Tamaño de `etiqueta`: 0.875rem queda confirmado por el tech lead (06.09.2026).
- Faltan retrato de cuerpo entero de Naia Guanipa y de Pati Caro, y firmas escaneadas de Angela Pérez, Leo Simmons, Naia Guanipa y Pati Caro (no están en los PSD).
