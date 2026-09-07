---
name: 'paginas-bilingues'
description: 'Cómo se agrega o edita una página de Seres Migratorios: layout Pagina o Base, un solo h1, metadatos por Seo vía el layout, la gemela en src/pages/en/, la fila en RUTAS, exclusión del sitemap y redirects en netlify.toml. Cargar al crear o editar cualquier archivo de src/pages/.'
globs: 'src/pages/**/*.astro, astro.config.mjs, netlify.toml'
---

# paginas-bilingues

## Resumen

Una página del sitio existe dos veces, ES en la raíz y EN bajo `/en/`, con la misma estructura y las mismas claves de diccionario. Esta skill lista lo que una página nueva tiene que traer para no romper el bilingüe, el SEO ni el sitemap.

## Conceptos clave

- **`Pagina.astro`**: layout de las internas. `encabezado` (prop) da el `<h1>` `display-lg` con subtítulo mono; el slot `encabezado` reemplaza el header entero; sin ninguno, la página es dueña de todo. `contenedor={false}` cuando la página arma sus propias `<section class="contenedor seccion">`.
- **`Base.astro`**: `<head>` (vía `internos/Seo.astro`), `Nav` y `Pie`. Lo usa directo el home, que no tiene el header estándar.
- **`idioma`**: `Base` lo deriva de `Astro.currentLocale`; una página EN lo fija en `const idioma: Idioma = 'en'` para sus llamadas a `t()`.
- **`RUTAS`**: la tabla de `src/i18n/rutas.ts`. Sin fila ahí, el selector ES/EN del `Nav` y el `hreflang` caen al home.
- **Rutas fuera del sitemap**: `RUTAS_FUERA_DEL_SITEMAP` en `astro.config.mjs` (`/kit`, `/gracias`, `/en/thanks`).

## Patrones a seguir

### Página interna con el header estándar

```astro
---
import Pagina from '../layouts/Pagina.astro';
import { type Idioma, t } from '../i18n/utils.ts';

const idioma: Idioma = 'es';
---

<Pagina
  titulo={t(idioma, 'apoyar.titulo')}
  descripcion={t(idioma, 'apoyar.descripcion')}
  rutaActual={Astro.url.pathname}
  encabezado={{ titulo: t(idioma, 'apoyar.titulo'), subtitulo: t(idioma, 'apoyar.subtitulo') }}
>
  …
</Pagina>
```

### La gemela EN es el mismo archivo con `idioma = 'en'`

`src/pages/en/support.astro` importa con `../../`, fija `idioma: Idioma = 'en'` y usa las mismas claves. El JSDoc de cabecera dice de qué página ES es contraparte y qué ticket la creó.

### Un solo `<h1>`

Lo emite `Pagina` (prop `encabezado`) o `TitularPartido` (home y edición). Ninguna sección agrega otro; la jerarquía sigue `h2` → `h3` sin saltos.

### Metadatos solo por el layout

`titulo`, `descripcion`, `imagenOg` y `rutaActual` van como props a `Pagina`/`Base`; `Seo.astro` emite `<title>`, canonical, OG y Twitter. Una página nunca escribe `<title>` ni `<meta>` propios. `noindex` para una interna como `/kit`.

### Alta completa de una ruta

1. `src/pages/<ruta>.astro` y `src/pages/en/<route>.astro`.
2. Fila en `RUTAS` y literal en `ClaveDeRuta` (`src/i18n/rutas.ts`).
3. Claves en `es.json` y `en.json` (`[EN PENDIENTE]` si hace falta).
4. Si es interna o de agradecimiento: sumarla a `RUTAS_FUERA_DEL_SITEMAP`.
5. Si reemplaza una ruta vieja: redirect 301 con `force = true` en `netlify.toml`; los slugs de contenido nunca cambian.
6. `npm run test:unit` y `npm run build`; revisar `dist/sitemap-0.xml`.

### Seguir la lámina cuando difiere de la spec

Si `design/<Pagina>.dc.html` y `sitemap.md` o `PLAN.md` no coinciden, gana la lámina aprobada y el desvío se documenta como `OBSERVACIÓN` en el JSDoc de la página.

## Anti-patrones

### Página ES sin gemela EN

```
src/pages/prensa.astro        ✅
src/pages/en/press.astro      ❌ falta
```

**Fix**: crear la gemela en el mismo PR; si no hay traducción, las claves EN llevan `[EN PENDIENTE]`.

### Texto o metadatos hardcodeados

```astro
<!-- ❌ MAL -->
<title>Apoyar — Seres Migratorios</title>
<h1>Apoyar</h1>
```

**Fix**: props `titulo` y `encabezado` de `Pagina`, con `t()`.

### `.contenedor` anidado

`Pagina` con `contenedor` por defecto y una `<section class="contenedor">` adentro duplica el padding lateral. **Fix**: `contenedor={false}`.

### Colocar la `Anotacion` con `transform`

El slot `anotacion` se posiciona con `inset`, nunca con `translate`/`transform`, para que reduced-motion aplane la rotación sin perder la posición.

### `prerender = false` o `<ClientRouter />`

El sitio es estático y sin router de cliente; ninguna página cambia eso sin motivo escrito.

## Ejemplos

### Ejemplo 1 — página de agradecimiento

**Contexto**: `/gracias` y `/en/thanks` después del formulario.

**Antes**: solo `gracias.astro`, indexable.

**Después**: ambas páginas, fila `{ clave: 'gracias', es: '/gracias', en: '/en/thanks' }`, ambas en `RUTAS_FUERA_DEL_SITEMAP`, `action` del formulario apuntando a cada una.

**Por qué**: Netlify Forms redirige ahí; no aporta al índice.

### Ejemplo 2 — renombrar una ruta

**Contexto**: `/fotografos` pasó a `/artistas`.

**Después**: redirect 301 `force = true` en `netlify.toml` para `/fotografos` y `/fotografos/*`; los slugs de artista no cambian.

**Por qué**: PLAN.md §10, los slugs de contenido son permanentes.

## Referencias

- `CLAUDE.md` raíz, "Bilingüe siempre", "Accesibilidad mínima obligatoria", "Formulario de convocatoria".
- `src/layouts/Pagina.astro` y `src/layouts/Base.astro` (JSDoc de cabecera), `src/components/internos/Seo.astro`.
- `src/i18n/rutas.ts`, `astro.config.mjs`, `netlify.toml`.
- Skills relacionadas: `contenido-y-i18n` (claves y rutas), `componente-astro-canonico` (lo que va dentro de la página).

---

## Cuándo invocar esta skill

Al crear o editar cualquier `.astro` bajo `src/pages/`, y al tocar `astro.config.mjs` o `netlify.toml` por sitemap o redirects. Para el contenido que la página muestra, `contenido-y-i18n`; para los componentes que compone, `componente-astro-canonico`.
