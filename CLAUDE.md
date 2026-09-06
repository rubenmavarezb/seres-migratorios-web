# CLAUDE.md — Web Seres Migratorios

Instrucciones para Claude Code en este repo. Leelas completas antes de tocar código.

## Qué es esto

Sitio de **Seres Migratorios**, iniciativa fotográfica de la diáspora venezolana en Buenos Aires. Estático y bilingüe (ES por defecto, EN bajo `/en/`), con cuatro áreas: manifiesto e historia, artistas y galería, ediciones y apoyo, convocatoria con formulario. Sigue el design system v1.2 (`design-system.md`): expediente migratorio intervenido a mano, bicolor tinta negra + azul de sello sobre papel. El diseño aprobado de las nueve páginas está en `diseno-web-indice.md` y en el proyecto "Seres Migratorios - Web" de Claude Design (sincronizado en `design/`, fuera del build).

## Stack

Astro 5 (`output: 'static'`, sin adapter mientras todo sea estático), Tailwind CSS v4 vía `@tailwindcss/vite` con tokens en `@theme`, TypeScript estricto, `@astrojs/sitemap`, `astro:assets` con sharp, Content Collections (`glob` loader + zod). Formulario con **Netlify Forms** (`data-netlify`, honeypot, `action="/gracias"`), analytics con Cloudflare Web Analytics. Deploy en **Netlify** (`netlify.toml` en la raíz), Deploy Preview por PR. Movimiento en CSS puro (DS §11), sin `<ClientRouter />`.

## Comandos

```bash
npm run dev
npx astro check
npm run lint
npx prettier --write .
npm run build
npm run preview
npx playwright test
```

## Estructura

```
src/
  assets/      marca/ logos/ fotos/ retratos/ manuscritas/ firmas/
  components/  los 16 canónicos + internos/ (Seo, Galeria, Lightbox, Aparejo)
  content/     artistas/ ediciones/ aliados/ convocatorias/
  i18n/ · layouts/ · styles/ (theme.css, global.css)
  pages/       rutas ES en la raíz, rutas EN en pages/en/
  content.config.ts · consts.ts
```

## Convenciones

Lo que acá no está permitido, no se hace.

- **Nombres canónicos en español, exactos**: `BloqueFicha`, `TitularPartido`, `CajaNombre`, `Sello`, `Escudo`, `Anotacion`, `FotoPegada`, `FichaFotografo`, `SelloHorario`, `PalabrasClave`, `FranjaAliados`, `HiloTricolor`, `Boton`, `Campo`, `Nav`, `Pie`; layouts `Base.astro` y `Pagina.astro`. No se renombran ni se traducen; los helpers ajenos al design system van en `internos/`.
- **Props en camelCase y en español** (`fraseManuscrita`, `obraPrincipal`, `altoLogo`, `rutaActual`), siempre tipadas con una `interface Props`.
- **TypeScript estricto.** Nada de `any`: si un tipo no cierra, se arregla el tipo, no se silencia.
- **Sin frameworks de UI** (React, Vue, Svelte, Preact) ni librerías de estilos o animación (shadcn, DaisyUI, Bootstrap, Framer Motion, GSAP, Motion). Lo que necesite JavaScript va como isla mínima o `<script>` con vanilla JS; hoy son dos: `internos/Lightbox.astro` y la validación del formulario de `/convocatoria`. Sin `<ClientRouter />`: el cambio de página usa View Transitions cross-document por CSS.
- **Movimiento solo según DS §11.** Las entradas por scroll se activan con `data-entrada` (`FotoPegada`, `FichaFotografo`, `Sello` con `data-entrada="sello"`, filas del `Aparejo`, `HiloTricolor` del `Pie` con `data-entrada="hilo"`) y viven en `theme.css` dentro de `@media (prefers-reduced-motion: no-preference)` y `@supports ((animation-timeline: view()) and (animation-range: entry))`. Nunca `opacity: 0` fuera de ese bloque, nunca animar `transform` (lo usan las rotaciones estáticas): solo `opacity`, `translate`, `scale` y `clip-path`. `TitularPartido` y `BloqueFicha` no se animan; nada rebota ni hace parallax.
- **Solo clases de Tailwind y tokens del `@theme`.** Ningún color hardcodeado: nada de `#0B0B0B`, `text-[#1B4BAF]`, `rgb(...)` ni `bg-blue-600`. Un color nuevo se agrega al `@theme` y se documenta en el design system; los tokens existentes no se tocan.
- **Radio 0 en todo.** Excepciones únicas: el `Sello` circular y los números en círculo del `SelloHorario` (`rounded-full`). Sin degradados.
- **Mayúsculas solo con `text-transform`.** El contenido se escribe con su capitalización real (`Herick Frontado`, `Buenos Aires`) y el componente aplica `uppercase`. Nunca en mayúsculas en el markdown ni en el JSX.
- **Tipografías permitidas**: `font-display` (Anton), `font-mono` (Courier Prime), `font-manuscrita` (Gochi Hand, solo como respaldo). Nunca Inter, Roboto, Arial ni Helvetica. **Serial A** es la fuente real de la marca pero **requiere comprar licencia web**: hasta entonces no se usa.
- **Sombra única**: `shadow-foto`, exclusiva de `FotoPegada`. No se agregan otras.
- **Dependencias**: ninguna sin preguntar antes.

## Reglas de contenido

- **No inventar datos.** Fechas, direcciones, nombres, handles, cifras y links: solo los del contenido o del BRIEF. Lo que falte va como **placeholder visible entre corchetes**: `[FECHA PRÓXIMA EDICIÓN]`, `[LINK DONACIONES]`, `[DOMINIO]`. Un placeholder es correcto; un dato inventado es un error grave.
- **Bilingüe siempre.** Todo texto nuevo entra en `es.json` y `en.json` a la vez, o como campo `{ es, en }` en la colección. Nunca hardcodear texto visible en un `.astro`. Si no hay traducción, `[EN PENDIENTE]` en la clave inglesa: es preferible a dejar español en una página EN. Si agregás una ruta, agregá su equivalente en el otro idioma y actualizá `rutaLocalizada()`.
- **No se traducen**: nombres propios, CONSULADO, handles, "Seres Migratorios", FAMILIA / RESILIENCIA / EXILIO, "¡Aguante la fotografía!" ni las frases manuscritas (la letra escaneada de cada persona).
- **Voz**: directa, cálida, colectiva ("nosotros"), con voseo suave en los llamados a la acción ("Postulate", "Sumate"). Sin emojis ni solemnidad.

## Imágenes

Toda imagen pasa por `astro:assets` (`<Image>` / `<Picture>`), nunca `<img>` desde `public/` salvo el favicon. Obra ≤ 2400 px de lado largo; retratos 800 px; escaneos de letra en SVG vectorizado o PNG transparente. El hero usa `<Picture>` con `priority` y AVIF/WebP; el resto, `loading="lazy"` con `widths` y `sizes` explícitos. **Toda imagen lleva `alt` real**; las decorativas, `alt=""` y `aria-hidden`. En una frase manuscrita el `alt` es la transcripción literal, en español.

## Accesibilidad mínima obligatoria

Contraste AA. Foco visible siempre (outline 2 px `azul-sello`, offset 2 px); nunca `outline: none`. Objetivo táctil ≥ 44 px. Un solo `<h1>` por página, sin saltos de jerarquía. `<label for>` real en todo campo, errores con `aria-describedby` y `aria-invalid`; el formulario valida nativo sin JavaScript y con JavaScript muestra los mensajes del diseño. Lightbox con `<dialog>`: foco atrapado, `Esc` cierra, el foco vuelve al disparador. `prefers-reduced-motion` anula rotaciones, transiciones, las entradas de DS §11 y las View Transitions. El sitio se lee sin JavaScript, y ninguna página pasa a `prerender = false` sin motivo.

## Formulario de convocatoria

`<form name="convocatoria" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" action="/gracias">` (en EN, `action="/en/thanks"`), un solo `name` en los dos idiomas y un campo oculto `idioma`. El honeypot `bot-field` va con el atributo `hidden` y fuera del orden de tabulación. Netlify detecta el formulario en el HTML del build: si `abierta` es `false` en los dos idiomas, el `<form>` no existe y puede desaparecer del panel (ver `modelo-de-contenido.md` §6). Sin endpoint ni variable de entorno.

## Cómo agregar un artista o una edición

Rama `contenido/<tipo>-<slug>`. **Artista**: `content/artistas/<slug>.md` con el frontmatter del modelo de contenido (`roles` obligatorio; `numero` solo para quien fotea); retrato, obra, frase y firma en sus carpetas de `assets/`; agregar el slug a `fotean` o `exponen` de la edición. **Edición**: `content/ediciones/<slug>.md`; si es la próxima, `estado: proxima` y bajar la anterior a `pasada` en el mismo PR — hay una sola `proxima` a la vez. En los dos casos, completar los campos `{ es, en }`.

## Antes de abrir un PR

1. `npx astro check` sin errores.
2. `npm run lint` limpio.
3. `npm run build` pasa.
4. `npx playwright test` verde.
5. Revisión manual: ¿color fuera de token? ¿texto sin traducir? ¿imagen sin `alt`? ¿dato inventado donde iría un placeholder?
6. Deploy Preview de Netlify aprobado por Ruben. Sin eso no se mergea a `main`.
