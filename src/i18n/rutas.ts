/**
 * Route table and locale helpers for the ten public routes of sitemap.md §1.
 *
 * This module imports nothing on purpose: no dictionary, no `import.meta.env`,
 * no Astro API. That keeps it plain TypeScript that Node's built-in type
 * stripping can execute directly, so `tests/unitarias/rutas.test.mjs` runs it
 * without a bundler. Everything that needs the dictionaries lives in
 * `./utils.ts`, which re-exports this module.
 */

export type Idioma = 'es' | 'en';

/** Locales of `astro.config.mjs`, in the order the `Nav` selector shows them. */
export const IDIOMAS = ['es', 'en'] as const satisfies readonly Idioma[];

/** Default locale: it carries no URL prefix (`prefixDefaultLocale: false`). */
export const IDIOMA_POR_DEFECTO: Idioma = 'es';

/** Stable identifier of a route, independent of the language it is shown in. */
export type ClaveDeRuta =
  | 'home'
  | 'manifiesto'
  | 'artistas'
  | 'artista'
  | 'ediciones'
  | 'edicion'
  | 'convocatoria'
  | 'apoyar'
  | 'gracias'
  | 'noEncontrada';

interface EntradaDeRuta {
  readonly clave: ClaveDeRuta;
  /** Spanish route; `[slug]` marks the single dynamic segment, if any. */
  readonly es: string;
  /** English route; same shape, under the `/en/` prefix. */
  readonly en: string;
}

/**
 * Home of each language. Kept as a named entry because it is both the first
 * row of the table and the fallback of `rutaLocalizada()`.
 */
const HOME = { clave: 'home', es: '/', en: '/en/' } as const satisfies EntradaDeRuta;

/**
 * The ten public routes, in the order of sitemap.md §1. Route slugs are
 * translated; content slugs are not (an edition is `buenos-aires-2026` in both
 * languages). `/kit` is deliberately absent: it is an internal, unindexed page
 * with no English counterpart.
 */
export const RUTAS = [
  HOME,
  { clave: 'manifiesto', es: '/manifiesto', en: '/en/manifesto' },
  { clave: 'artistas', es: '/artistas', en: '/en/artists' },
  { clave: 'artista', es: '/artistas/[slug]', en: '/en/artists/[slug]' },
  { clave: 'ediciones', es: '/ediciones', en: '/en/editions' },
  { clave: 'edicion', es: '/ediciones/[slug]', en: '/en/editions/[slug]' },
  { clave: 'convocatoria', es: '/convocatoria', en: '/en/open-call' },
  { clave: 'apoyar', es: '/apoyar', en: '/en/support' },
  { clave: 'gracias', es: '/gracias', en: '/en/thanks' },
  { clave: 'noEncontrada', es: '/404', en: '/en/404' },
] as const satisfies readonly EntradaDeRuta[];

/** Marker of the single dynamic segment inside a route template. */
const SEGMENTO_DINAMICO = '[slug]';

/**
 * Base only used to let `new URL` parse a bare pathname. It is never fetched
 * and never appears in the output; `.invalid` is reserved by RFC 2606.
 */
const BASE_INTERNA = 'https://seres-migratorios.invalid';

/** Pathname of a `URL`, an absolute URL string or a bare path. */
function comoRuta(url: URL | string): string {
  if (typeof url !== 'string') return url.pathname;
  return new URL(url, BASE_INTERNA).pathname;
}

/**
 * Canonical form used for comparison: leading slash, no trailing slash, no
 * query or hash. The root and `/en/` collapse to `/` and `/en`, so lookups
 * tolerate a trailing slash while the table keeps its stored spelling.
 */
function normalizar(ruta: string): string {
  const sinBarraFinal = comoRuta(ruta).replace(/\/+$/, '');
  return sinBarraFinal === '' ? '/' : sinBarraFinal;
}

interface Coincidencia {
  readonly entrada: EntradaDeRuta;
  readonly idioma: Idioma;
  readonly slug: string | null;
}

/** Finds the table row `ruta` belongs to, in either language. */
function coincidir(ruta: string): Coincidencia | null {
  const objetivo = normalizar(ruta);

  // Static rows win: `/artistas` is the index, never `/artistas/[slug]` with
  // an empty slug.
  for (const entrada of RUTAS) {
    for (const idioma of IDIOMAS) {
      const plantilla = entrada[idioma];
      if (plantilla.includes(SEGMENTO_DINAMICO)) continue;
      if (normalizar(plantilla) === objetivo) return { entrada, idioma, slug: null };
    }
  }

  for (const entrada of RUTAS) {
    for (const idioma of IDIOMAS) {
      const plantilla = entrada[idioma];
      if (!plantilla.includes(SEGMENTO_DINAMICO)) continue;
      const prefijo = normalizar(plantilla.replace(`/${SEGMENTO_DINAMICO}`, ''));
      if (!objetivo.startsWith(`${prefijo}/`)) continue;
      const slug = objetivo.slice(prefijo.length + 1);
      // A single segment only: `/artistas/uno/dos` is not an artist page.
      if (slug !== '' && !slug.includes('/')) return { entrada, idioma, slug };
    }
  }

  return null;
}

/** A route recognized by the table, split into its language-neutral parts. */
export interface RutaAnalizada {
  readonly clave: ClaveDeRuta;
  /** Language the given route was written in. */
  readonly idioma: Idioma;
  /** Content slug of a dynamic route; `null` for the static ones. */
  readonly slug: string | null;
}

/**
 * Identifies a route regardless of the language it is written in, so the `Nav`
 * can mark the active link and the layout can build its `hreflang` pair
 * (SM-049 / SM-050). Returns `null` for a route outside the table.
 */
export function rutaBase(ruta: string): RutaAnalizada | null {
  const coincidencia = coincidir(ruta);
  if (coincidencia === null) return null;
  const { entrada, idioma, slug } = coincidencia;
  return { clave: entrada.clave, idioma, slug };
}

/**
 * Language of a route or URL: `en` when the first path segment is exactly
 * `en`, `es` otherwise, because the default locale carries no prefix.
 * Accepts a `URL` (`Astro.url`), an absolute URL string or a bare path.
 */
export function idiomaDeUrl(url: URL | string): Idioma {
  const [, primerSegmento] = normalizar(comoRuta(url)).split('/');
  return primerSegmento === 'en' ? 'en' : IDIOMA_POR_DEFECTO;
}

/**
 * Equivalent route in `idioma`. Keeps the content slug of the dynamic routes
 * (`/artistas/ruben-mavarez` ↔ `/en/artists/ruben-mavarez`) and tolerates a
 * trailing slash in `ruta`.
 *
 * A route outside the table has no equivalent, so it falls back to the home of
 * the requested language (`/` for `es`, `/en/` for `en`).
 */
export function rutaLocalizada(ruta: string, idioma: Idioma): string {
  const coincidencia = coincidir(ruta);
  if (coincidencia === null) return HOME[idioma];
  const plantilla = coincidencia.entrada[idioma];
  if (coincidencia.slug === null) return plantilla;
  return plantilla.replace(SEGMENTO_DINAMICO, coincidencia.slug);
}

/**
 * Both language versions of `ruta`, ready for the `ES / EN` selector of the
 * `Nav` and for the `hreflang` links of the layout (SM-049 / SM-050).
 */
export function rutasAlternativas(ruta: string): Readonly<Record<Idioma, string>> {
  return { es: rutaLocalizada(ruta, 'es'), en: rutaLocalizada(ruta, 'en') };
}
