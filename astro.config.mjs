// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// PLAN.md §14 keeps every public value in `PUBLIC_*` env vars. `site` is read
// at config time (before `import.meta.env` exists), so it goes through Vite's
// `loadEnv`. PLAN.md §4.3 literally writes `site: 'https://[DOMINIO]'`, which
// is not a valid URL and breaks the build: the fallback is the real Netlify
// URL until the custom domain lands in SM-010 / SM-064.
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

// https://astro.build/config
export default defineConfig({
  // `||`, not `??`: `loadEnv` yields an empty string for a declared-but-empty
  // variable, and an empty `site` breaks the build the same way a missing one would.
  site: PUBLIC_SITE_URL || 'https://seres-migratorios.netlify.app',
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
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
