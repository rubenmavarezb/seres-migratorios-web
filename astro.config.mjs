// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { IDIOMAS, rutaBase, rutasAlternativas } from './src/i18n/rutas.ts';

// PLAN.md §14 keeps every public value in `PUBLIC_*` env vars. `site` is read
// at config time (before `import.meta.env` exists), so it goes through Vite's
// `loadEnv`. The fallback is the official domain (PLAN.md §4.3 and §14, SM-010
// and SM-064 done on 06.09.2026); the internal seres-migratorios.netlify.app URL
// is never used for `site` or canonical URLs.
const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');

/** Internal routes kept out of the sitemap (PLAN.md §4.3, "Analytics"). */
const RUTAS_FUERA_DEL_SITEMAP = ['/kit', '/gracias', '/en/thanks'];

/**
 * Normalizes a pathname for comparison: `build.format: 'directory'` emits
 * `/gracias/`, so the trailing slash is dropped everywhere except the root.
 * @param {string} pathname
 * @returns {string}
 */
const sinBarraFinal = (pathname) => (pathname === '/' ? pathname : pathname.replace(/\/$/, ''));

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
      filter: (page) => !RUTAS_FUERA_DEL_SITEMAP.includes(sinBarraFinal(new URL(page).pathname)),
      serialize: conParesDeIdioma,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
