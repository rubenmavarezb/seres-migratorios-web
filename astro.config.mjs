// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { loadEnv } from 'vite';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { RUTAS_EXCLUIDAS_DE_ANALITICA, sinBarraFinal } from './src/analitica.ts';
import { IDIOMAS, rutaBase, rutasAlternativas } from './src/i18n/rutas.ts';

// PLAN.md §14 keeps every public value in `PUBLIC_*` env vars. `site` is read
// at config time (before `import.meta.env` exists), so it goes through Vite's
// `loadEnv`. The fallback is the official domain (PLAN.md §4.3 and §14, SM-010
// and SM-064 done on 06.09.2026); the internal seres-migratorios.netlify.app URL
// is never used for `site` or canonical URLs.
const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');

/**
 * The opposite shape, for the sitemap alternates: every `<loc>` the integration
 * writes ends in a slash (`build.format: 'directory'`), and each alternate must
 * name exactly the URL its page declares as canonical.
 * @param {string} pathname
 * @returns {string}
 */
const conBarraFinal = (pathname) => (pathname.endsWith('/') ? pathname : `${pathname}/`);

/**
 * BCP 47 codes of the sitemap alternates (SM-050): same pair as `i18n.locales`
 * below and as `HREFLANG` in `src/components/internos/Seo.astro`.
 * @type {Readonly<Record<import('./src/i18n/rutas.ts').Idioma, string>>}
 */
const HREFLANG = { es: 'es-AR', en: 'en-US' };

/**
 * Language pairs of the sitemap (SM-050). `@astrojs/sitemap` pairs URLs by
 * stripping the locale prefix and grouping equal paths, so with translated
 * route slugs (`/artistas` ↔ `/en/artists`) its own `i18n` option only ever
 * pairs the two homes. This hook rebuilds `links` for every route of the
 * `RUTAS` table with `rutasAlternativas()` — the same function `Seo.astro`
 * uses for its `<link rel="alternate">` tags and the `Nav` for its selector —
 * plus `x-default` pointing at the Spanish version, the default locale. A URL
 * outside the table keeps whatever the integration gave it.
 * @param {import('@astrojs/sitemap').SitemapItem} item
 * @returns {import('@astrojs/sitemap').SitemapItem}
 */
const conParesDeIdioma = (item) => {
  const ruta = new URL(item.url).pathname;
  if (rutaBase(ruta) === null) return item;
  const alternativas = rutasAlternativas(ruta);
  /** @param {string} pathname */
  const absoluta = (pathname) => new URL(conBarraFinal(pathname), item.url).href;
  return {
    ...item,
    links: [
      ...IDIOMAS.map((idioma) => ({ url: absoluta(alternativas[idioma]), lang: HREFLANG[idioma] })),
      { url: absoluta(alternativas.es), lang: 'x-default' },
    ],
  };
};

// https://astro.build/config
export default defineConfig({
  // `||`, not `??`: `loadEnv` yields an empty string for a declared-but-empty
  // variable, and an empty `site` breaks the build the same way a missing one would.
  site: PUBLIC_SITE_URL || 'https://seresmigratorios.com',
  output: 'static',
  // Astro 7 defaults to 'jsx', which drops whitespace between inline elements.
  // `true` restores Astro 5's lossless compression — see docs/notas-astro-7.md.
  compressHTML: true,
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-AR', en: 'en-US' },
      },
      filter: (page) =>
        !RUTAS_EXCLUIDAS_DE_ANALITICA.includes(sinBarraFinal(new URL(page).pathname)),
      serialize: conParesDeIdioma,
    }),
  ],
  // SM-063: self-hosted at build time via Astro's stable Fonts API (`fonts`,
  // stable since v6.0.0 — no `experimental` flag, no new dependency: verified
  // `fontProviders` exports from `astro/config` in 7.3.1 before writing this).
  // Replaces the `@import url(fonts.googleapis.com/...)` that used to open
  // `src/styles/global.css`, which Lighthouse's base measurement (SM-063
  // ticket evidence) showed as a 4-hop render-blocking chain (Document →
  // Base.css → fonts.googleapis.com CSS → fonts.gstatic.com woff2, ~800-870ms
  // lost per route) and, with that chain blocked, took /artistas/, /404 and
  // /en/ from 89-92 to a stable 99 on Lighthouse mobile performance.
  //
  // Weights/styles are exactly what `grep -rn "italic" src` and
  // `grep -rl "font-bold" src` show in use — nothing is downloaded that no
  // page renders:
  // - Anton: only weight Google serves, only used unstyled (font-display).
  // - Courier Prime: 400 (body default, `font-mono` on <body>) and 700
  //   (`.boton`/`.campo` `font-bold` in theme.css, and Sello's inline-SVG
  //   `<text class="font-bold">`). No `italic` anywhere in the codebase
  //   (components, content, or CSS) even though the old Google Fonts URL
  //   requested `ital,wght@0,400;0,700;1,400` — that italic weight was dead
  //   weight, never dropped here on purpose.
  // - Gochi Hand: only weight Google serves, used as running text via
  //   `Anotacion.astro` (site-wide) and `Artista.astro`'s manuscrita frase.
  //
  // `fallbacks` is a single generic per family (`sans-serif` / `monospace` /
  // `cursive`), not the named system fonts the old `--font-display` etc.
  // tokens listed (`Impact`, `Arial Narrow Bold`, `Courier New`, `Comic Sans
  // MS`).
  //
  // `optimizedFallbacks: false` on all three, and this is NOT the default —
  // verified empirically, not assumed. With the default (`true`), Astro's
  // metric-matched fallback does not stay on the generic keyword: it
  // resolves `sans-serif`/`monospace` to a concrete installed font and
  // emits a named `src: local(...)` donor. A first build with the default
  // confirmed this by inspecting `dist/index.html`'s generated `@font-face`
  // rules directly — `font-family:"Anton-… fallback: Arial";src:
  // local("Arial")` and `font-family:"Courier Prime-… fallback: Courier
  // New";src:local("Courier New")`. That is exactly what CLAUDE.md and this
  // ticket's own instructions forbid ("Nunca Inter/Roboto/Arial/Helvetica
  // como fallback visible: el fallback métrico debe declararse sobre una
  // local() genérica monospace/sans documentada") — Arial and Courier New
  // are named, not generic, regardless of how briefly they show during the
  // font swap. `optimizedFallbacks: false` (astro.build/en/reference/
  // configuration-reference, "font.optimizedFallbacks") makes Astro use the
  // `fallbacks` list as-is, with no metric `@font-face`/`local()` of its
  // own: the CSS fallback is the bare generic (`sans-serif`/`monospace`/
  // `cursive`), and the browser's own default font for that generic —
  // whatever it is on that OS — is never pinned to a name in our output.
  // Cost: no automatic `size-adjust`/`ascent-override` for that fallback, so
  // this needed a CLS re-check, not just a build-time grep — the base
  // measurement's CLS is 0.0006-0.0049 against a 0.1 budget (SM-063 ticket
  // evidence), tens to hundreds of times the headroom, and this ticket's own
  // Lighthouse re-run (see report) confirms CLS does not regress with this
  // off. See the OBSERVACIÓN in theme.css above `--font-display`/
  // `--font-mono`/`--font-manuscrita` for the exact before/after tokens.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Anton',
      cssVariable: '--font-astro-display',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
      optimizedFallbacks: false,
    },
    {
      provider: fontProviders.google(),
      name: 'Courier Prime',
      cssVariable: '--font-astro-mono',
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
      optimizedFallbacks: false,
    },
    {
      provider: fontProviders.google(),
      name: 'Gochi Hand',
      cssVariable: '--font-astro-manuscrita',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['cursive'],
      optimizedFallbacks: false,
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
