/**
 * `robots.txt` (backlog SM-065): a static endpoint instead of a file under
 * `public/`, so `Sitemap:` is always built from `site` (astro.config.mjs) and
 * never a hardcoded domain — the same rule SM-064 enforces for canonical and
 * `og:url`. `Disallow` reuses `RUTAS_EXCLUIDAS_DE_ANALITICA`, the same list
 * `astro.config.mjs`'s sitemap filter and `Base.astro`'s beacon condition
 * read, so the three surfaces never disagree about which routes are internal.
 *
 * The route itself is never added to that list: it must not disallow itself,
 * and `@astrojs/sitemap` only collects prerendered `.html` pages, so this
 * `.txt` endpoint never reaches the sitemap in the first place.
 */
import type { APIRoute } from 'astro';

import { RUTAS_EXCLUIDAS_DE_ANALITICA } from '../analitica.ts';

export const GET: APIRoute = ({ site }) => {
  // `site` is `undefined` only when astro.config.mjs has no `site` at all,
  // which cannot happen here (it always falls back to the official domain) —
  // fail loudly rather than emit a `Sitemap:` line with no URL.
  if (site === undefined) {
    throw new Error('robots.txt necesita `site` configurado en astro.config.mjs.');
  }

  const lineas = [
    'User-agent: *',
    'Allow: /',
    // A `robots.txt` `Disallow` is a prefix match, so the slash-less form
    // already covers the `build.format: 'directory'` URL (`Disallow: /kit`
    // blocks both `/kit` and `/kit/`) — no need for `RUTAS_EXCLUIDAS_DE_ANALITICA`
    // to carry a trailing slash of its own.
    ...RUTAS_EXCLUIDAS_DE_ANALITICA.map((ruta) => `Disallow: ${ruta}`),
    '',
    `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
  ];

  return new Response(`${lineas.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
