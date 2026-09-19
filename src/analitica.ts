/**
 * Shared analytics gates (backlog SM-065): which routes never emit the
 * Cloudflare Web Analytics beacon and are kept out of the sitemap and
 * `robots.txt`, plus the rule for when a `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`
 * value counts as a real token.
 *
 * Imports nothing on purpose, the same convention `i18n/rutas.ts` documents:
 * `astro.config.mjs` reads this module at config time, outside Vite (no
 * `import.meta.env` there yet), and `tests/unitarias/analitica.test.mjs` runs
 * it under Node's own type stripping, no bundler involved. `Base.astro` (the
 * beacon), `astro.config.mjs` (the sitemap filter) and
 * `src/pages/robots.txt.ts` (`Disallow`) all import
 * `RUTAS_EXCLUIDAS_DE_ANALITICA` from here so the three surfaces never drift
 * apart into three different lists.
 */

/**
 * Internal routes excluded from analytics, the sitemap and `robots.txt`
 * (PLAN.md §4.3, "Analytics"): `/kit` (internal reference page, SM-029, no
 * analytics value) and the two post-submit thank-you pages, `/gracias` and
 * `/en/thanks` (SM-054), which a visitor reaches only after posting the
 * convocatoria form and never navigates to directly.
 */
export const RUTAS_EXCLUIDAS_DE_ANALITICA: readonly string[] = ['/kit', '/gracias', '/en/thanks'];

/**
 * Normalizes a pathname for comparison against `RUTAS_EXCLUIDAS_DE_ANALITICA`:
 * `build.format: 'directory'` (astro.config.mjs) emits a trailing slash
 * (`/gracias/`) the table above does not carry. The root is left as `/`,
 * the only entry that is supposed to keep its trailing slash.
 */
export function sinBarraFinal(pathname: string): string {
  return pathname === '/' ? pathname : pathname.replace(/\/+$/, '');
}

/** Whether `pathname` is one of the routes excluded from analytics. */
export function estaExcluidaDeAnalitica(pathname: string): boolean {
  return RUTAS_EXCLUIDAS_DE_ANALITICA.includes(sinBarraFinal(pathname));
}

/**
 * Whether a `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` value is real enough to emit
 * the Cloudflare Web Analytics beacon (tech-lead decision, SM-065). Rejects
 * `undefined`, an empty or whitespace-only string, and a bracketed
 * placeholder such as `[TOKEN CLOUDFLARE ANALYTICS]` — `.env.example`'s own
 * value, so copying it without editing never ships a beacon pointed at
 * literal brackets.
 *
 * Takes `unknown`, not `string | undefined`: Vite types `import.meta.env`
 * with an `any` index signature (see `variablePublica` in `Pie.astro` for the
 * same note), so the caller's value arrives untyped and is narrowed here
 * instead of spreading `any` through `Base.astro`. The `valor is string`
 * predicate lets a caller use the real token, once validated, without an `as`
 * cast.
 */
export function tokenDeAnalyticsValido(valor: unknown): valor is string {
  if (typeof valor !== 'string') return false;
  const recortado = valor.trim();
  if (recortado === '') return false;
  return !/^\[.*\]$/.test(recortado);
}
