# AGENTS.md — Web Seres Migratorios

Instrucciones compartidas para Codex, Claude Code y cualquier agente que trabaje en este repo. Leelas completas antes de tocar código. Respondé a Ruben en español. Las instrucciones explícitas del usuario definen el alcance de la tarea; estos archivos no autorizan acciones externas adicionales.

## Qué es esto

Sitio de **Seres Migratorios**, iniciativa fotográfica de la diáspora venezolana en Buenos Aires. Estático y bilingüe (ES por defecto, EN bajo `/en/`), con cuatro áreas: manifiesto e historia, artistas y galería, ediciones y apoyo, convocatoria con formulario. Sigue el design system v1.2 (`design/ds/docs/design-system.md`): expediente migratorio intervenido a mano, bicolor tinta negra + azul de sello sobre papel. El diseño aprobado de las nueve páginas está en `design/diseno-web-indice.md` y en el proyecto "Seres Migratorios - Web" de Claude Design (sincronizado en `design/`, fuera del build).

## Stack

Astro 7 (`package.json` y `package-lock.json` fijan la versión; ver `docs/notas-astro-7.md`), Node 22.12 o superior (`.nvmrc`). Astro usa `output: 'static'`, sin adapter mientras todo sea estático. Tailwind CSS v4 vía `@tailwindcss/vite` con tokens en `@theme`, TypeScript estricto, `@astrojs/sitemap`, `astro:assets` con sharp, Content Collections (`glob` loader + zod). Formulario con **Netlify Forms** (`data-netlify`, honeypot, `action="/gracias"`), analytics con Cloudflare Web Analytics. Deploy en **Netlify** (`netlify.toml` en la raíz), Deploy Preview por PR. Movimiento en CSS puro (DS §11), sin `<ClientRouter />`.

## Comandos

Ejecutar desde la raíz del checkout o worktree elegido:

```bash
npm ci                 # instalar las versiones del lockfile
npm run dev            # desarrollo, localhost:4321
npm run check          # astro check
npm run lint
npm run test:unit      # paridad i18n + unitarias; ver scripts en package.json
npx prettier --check .
npm run build
npm run preview        # servir el build para revisión
npm test               # Playwright; requiere build y tests e2e existentes
```

Para formatear, usar `npx prettier --write <archivos-tocados>`; no reformatear el repo entero como efecto secundario de una tarea.

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

Respetá las siguientes convenciones dentro del alcance pedido.

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

- **No inventar datos.** Fechas, direcciones, nombres, handles, cifras y links: solo los del contenido o del BRIEF. Lo que falte va como **placeholder visible entre corchetes**: `[FECHA PRÓXIMA EDICIÓN]`, `[LINK DONACIONES]`, `[EMAIL DEL COLECTIVO]`. El dominio NO es placeholder: es `seresmigratorios.com` y es el `site` de `astro.config.mjs`. Un placeholder es correcto; un dato inventado es un error grave.
- **Bilingüe siempre.** Todo texto nuevo entra en `es.json` y `en.json` a la vez, o como campo `{ es, en }` en la colección. Nunca hardcodear texto visible en un `.astro`. Si no hay traducción, `[EN PENDIENTE]` en la clave inglesa: es preferible a dejar español en una página EN. Si agregás una ruta, agregá su equivalente en el otro idioma y actualizá `RUTAS` en `src/i18n/rutas.ts`, que usa `rutaLocalizada()`. `/kit` es una ruta interna sin gemela EN.
- **No se traducen**: nombres propios, CONSULADO, handles, "Seres Migratorios", FAMILIA / RESILIENCIA / EXILIO, "¡Aguante la fotografía!" ni las frases manuscritas (la letra escaneada de cada persona).
- **Voz**: directa, cálida, colectiva ("nosotros"), con voseo suave en los llamados a la acción ("Postulate", "Sumate"). Sin emojis ni solemnidad.

## Imágenes

Toda imagen pasa por `astro:assets` (`<Image>` / `<Picture>`), nunca `<img>` desde `public/` salvo el favicon. Obra ≤ 2400 px de lado largo; retratos 800 px; escaneos de letra en SVG vectorizado o PNG transparente. El hero usa `<Picture>` con `priority` y AVIF/WebP; el resto, `loading="lazy"` con `widths` y `sizes` explícitos. **Toda imagen lleva `alt` real**; las decorativas, `alt=""` y `aria-hidden`. En una frase manuscrita el `alt` es la transcripción literal, en español.

## Accesibilidad mínima obligatoria

Contraste AA. Foco visible siempre (outline 2 px `azul-sello`, offset 2 px); nunca `outline: none`. Objetivo táctil ≥ 44 px. Un solo `<h1>` por página, sin saltos de jerarquía. `<label for>` real en todo campo, errores con `aria-describedby` y `aria-invalid`; el formulario valida nativo sin JavaScript y con JavaScript muestra los mensajes del diseño. Lightbox con `<dialog>`: foco atrapado, `Esc` cierra, el foco vuelve al disparador. `prefers-reduced-motion` anula rotaciones, transiciones, las entradas de DS §11 y las View Transitions. El sitio se lee sin JavaScript, y ninguna página pasa a `prerender = false` sin motivo.

## Formulario de convocatoria

`<form name="convocatoria" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" action="/gracias">` (en EN, `action="/en/thanks"`), un solo `name` en los dos idiomas y un campo oculto `idioma`. El honeypot `bot-field` va con el atributo `hidden` y fuera del orden de tabulación. Netlify detecta el formulario en el HTML del build: si `abierta` es `false` en los dos idiomas, el `<form>` no existe y puede desaparecer del panel (ver `modelo-de-contenido.md` §6). Sin endpoint ni variable de entorno.

## Cómo agregar un artista o una edición

Rama `contenido/<tipo>-<slug>`. **Artista**: `src/content/artistas/<slug>.md` con el frontmatter del modelo de contenido (`roles` obligatorio; `numero` solo para quien fotea); retrato, obra, frase y firma en sus carpetas de `assets/`; agregar el slug a `fotean` o `exponen` de la edición. **Edición**: `src/content/ediciones/<slug>.md`; si es la próxima, `estado: proxima` y bajar la anterior a `pasada` en el mismo PR — hay una sola `proxima` a la vez. En los dos casos, completar los campos `{ es, en }`.

## Antes de abrir un PR

Reproducir el CI de `.github/workflows/ci.yml`, en orden:

1. `npm run check` sin errores.
2. `npm run lint` limpio.
3. `npm run test:unit` verde (incluye paridad ES/EN; consultar `package.json` para los gates disponibles en la rama).
4. `npx prettier --check .` limpio.
5. `npm run build` pasa.
6. `npm test` si hay tests en `tests/e2e/`. Si solo existe `.gitkeep`, informar **sin cobertura e2e todavía**, nunca darlo por verde. Playwright usa `npm run preview` y necesita el build anterior.
7. Revisión manual: ¿color fuera de token? ¿texto sin traducir? ¿imagen sin `alt`? ¿dato inventado donde iría un placeholder? Para cambios visuales, revisar en navegador escritorio y móvil, foco y reduced-motion; informar si no se pudo verificar.
8. Deploy Preview de Netlify aprobado por Ruben. Sin eso no se mergea a `main`.

Para tareas que no preparan un PR, validar lo relevante al cambio. En cambios exclusivos de documentación o configuración de agentes, comprobar formato, referencias y sintaxis de configuración; no hace falta reconstruir el sitio. No afirmar que pasaron verificaciones que no se ejecutaron.

## Fuentes y alcance de trabajo

- Confirmar `git status --short`, `git branch --show-current` y `git worktree list` antes de editar. Cada worktree es un checkout del mismo sitio; no son paquetes de un monorepo. Trabajar en el asignado y preservar cambios ajenos.
- Para comparar ramas, respetar la base indicada; si no se indicó, detectar `refs/remotes/origin/HEAD`. No asumir que una tarea de fase se compara siempre contra `main`. Incluir cambios staged, unstaged y archivos nuevos cuando la revisión los abarque.
- El código, `package.json`, `package-lock.json`, `src/content.config.ts` y `docs/notas-astro-7.md` describen el stack y el esquema reales. El diseño aprobado está en `design/README.md`, `design/diseno-web-indice.md` y `design/ds/docs/`. `design/` es referencia, no código de producción.
- BRIEF, PLAN, sitemap y modelo de contenido pueden estar fuera del checkout. Buscar primero en el repo y en el contexto entregado. No depender de rutas personales como `~/Documents/…` ni de `~/CLAUDE.md` para empezar. Si falta una fuente necesaria, señalar qué decisión depende de ella; no inventar contenido ni reglas.
- Las referencias históricas a las reglas de `CLAUDE.md` apuntan ahora a este archivo: `CLAUDE.md` es el punto de entrada de Claude y carga `AGENTS.md`.
- No leer ni publicar secretos de `.env`, `.env.*` o `.netlify/`. `.env.example` es la excepción versionada y se puede consultar. No copiar valores privados a instrucciones, logs o memorias.
- No usar force-push, `reset --hard`, `clean`, rebase o amend para resolver una tarea rutinaria. No borrar ni guardar en stash trabajo ajeno. Una solicitud de implementación no implica commit, push, publicación o merge; respetar lo autorizado en la sesión. Antes de un commit o push autorizado, verificar identidad Git y remoto.

## Skills y revisiones

Leer solo los procedimientos que correspondan a la tarea. Las rutas son relativas a la raíz de este checkout:

| Trabajo                           | Procedimiento compartido                            | Entrada de Codex                                    |
| --------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| Componentes y layouts Astro       | `.claude/skills/componente-astro-canonico/SKILL.md` | `.agents/skills/componente-astro-canonico/SKILL.md` |
| Contenido, diccionarios y esquema | `.claude/skills/contenido-y-i18n/SKILL.md`          | `.agents/skills/contenido-y-i18n/SKILL.md`          |
| Páginas y rutas bilingües         | `.claude/skills/paginas-bilingues/SKILL.md`         | `.agents/skills/paginas-bilingues/SKILL.md`         |
| Checklist previo al PR            | `.claude/commands/pre-pr.md`                        | `.agents/skills/pre-pr/SKILL.md`                    |
| Alta de artista o edición         | `.claude/commands/agregar-contenido.md`             | `.agents/skills/agregar-contenido/SKILL.md`         |
| Auditoría de diseño               | `.claude/agents/auditor-design-system.md`           | `.codex/agents/auditor-design-system.toml`          |
| Auditoría de contenido bilingüe   | `.claude/agents/auditor-contenido-bilingue.md`      | `.codex/agents/auditor-contenido-bilingue.toml`     |

Los procedimientos conservan su detalle en `.claude/`; las entradas de Codex los cargan sin copiarlo. Cualquier agente puede leerlos como Markdown aunque no tenga un cargador de skills. El frontmatter específico de Claude (`model`, `color`, `memory`, `globs`) no configura a otros agentes. El alcance de las skills lo define su descripción y esta tabla.

Los auditores son de solo lectura. Si la herramienta no admite subagentes, aplicar la misma lista de revisión en la sesión actual; no inventar herramientas ni agentes instalados. Las memorias en `.claude/agent-memory/` son contexto opcional: leer solo las pertinentes si existen, contrastarlas con el código actual y no escribirlas durante una auditoría de solo lectura. Los agentes de plugins mencionados en los procedimientos no son dependencias obligatorias del proyecto.

Detalles de instalación, equivalencias y límites de permisos en `docs/agentes.md`.
