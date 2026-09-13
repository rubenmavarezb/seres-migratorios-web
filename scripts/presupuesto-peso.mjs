#!/usr/bin/env node
/**
 * SM-061 / PLAN.md §9: "Presupuesto de ≤ 120 KB de HTML+CSS+JS por página sin
 * imágenes, verificado en CI."
 *
 * For every `*.html` file under `dist/` this adds the page's own HTML plus
 * every local CSS/JS resource it references (`<link rel="stylesheet">`,
 * `<link rel="modulepreload">`, `<script src>`), de-duplicated per page, and
 * compares the total against the threshold below.
 *
 * Mode: gzip, not raw bytes. Gzip approximates what actually travels over
 * the wire — Netlify (this project's host) compresses text responses the
 * same way — and matches the method the fase-5-qa-lanzamiento baseline
 * measurement used (`gzip -9 -c | wc -c` per resource, summed) so a run of
 * this script is comparable to that baseline. Raw size is still reported
 * for context, but only the gzip total is checked against the limit.
 *
 * Each resource (HTML, then each local CSS/JS file) is gzipped on its own
 * and the compressed sizes are summed — not "gzip the concatenation" — since
 * in a real page load the HTML and each asset are separate HTTP responses,
 * each compressed independently by the server.
 *
 * Images and other binary assets are never counted (the budget is explicitly
 * "sin imágenes"): only `<link>`/`<script>` references are followed, and
 * `<img>`/`<picture>` sources are ignored by construction. External
 * resources (`http:`, `https:`, protocol-relative) are not counted — they
 * are not built by this repo — but are listed in the report for
 * transparency. A `data:` URI is not followed either: its bytes already sit
 * inside the HTML that was just measured, so counting it again would be
 * double-counting.
 *
 * A local reference that does not resolve to a file under `dist/` is a build
 * defect (a stale or mistyped path), not a budget question, so it fails the
 * run the same as exceeding the budget.
 *
 * Pure Node (`node:fs`, `node:zlib`, `node:path`, `node:url`), no
 * dependencies, no bundler.
 *
 * Usage:
 *   node scripts/presupuesto-peso.mjs [directorio-dist]
 *
 * Exit code 0 when every page is at or under the limit and every local
 * reference resolves; 1 otherwise (after printing every problem found, not
 * just the first one).
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..');

/** The budget itself (SM-061 / PLAN.md §9). */
export const LIMITE_KB = 120;
export const LIMITE_BYTES = LIMITE_KB * 1024;

/** gzip level used for both the baseline measurement and this gate, so the two are comparable. */
export const NIVEL_GZIP = 9;

const RE_LINK = /<link\b[^>]*>/gi;
const RE_SCRIPT_ABIERTO = /<script\b[^>]*>/gi;

/**
 * Reads one attribute's value out of a raw tag string (e.g. `href` from
 * `<link rel="stylesheet" href="/x.css">`). Returns `null` when absent.
 * @param {string} tag
 * @param {string} nombre
 * @returns {string | null}
 */
function extraerAtributo(tag, nombre) {
  const coincidencia = new RegExp(`${nombre}\\s*=\\s*(["'])(.*?)\\1`, 'i').exec(tag);
  return coincidencia ? coincidencia[2] : null;
}

/**
 * `true` for a reference this build does not own: absolute `http(s):` URLs
 * and protocol-relative (`//host/...`) ones. These are listed for
 * transparency but never counted or resolved against `dist/`.
 * @param {string} referencia
 * @returns {boolean}
 */
export function esUrlExterna(referencia) {
  return /^(https?:)?\/\//i.test(referencia);
}

/**
 * `true` for a `data:` URI: its bytes are already inline in the HTML that
 * was measured, so it is neither a local file to resolve nor an external
 * resource to list — just ignored.
 * @param {string} referencia
 * @returns {boolean}
 */
export function esUrlInline(referencia) {
  return /^data:/i.test(referencia);
}

/**
 * Pulls every local CSS/JS reference out of one page's HTML:
 * `<link rel="stylesheet"|"modulepreload" href="...">` and `<script
 * src="...">` (module or not). Anchors, `preconnect`/`canonical`/`alternate`
 * links, and inline `<script>` blocks (no `src`) are not references to a
 * separate resource and are skipped. De-duplicated (a resource linked twice
 * on the same page counts once), order-preserving.
 * @param {string} html
 * @returns {string[]}
 */
export function extraerReferenciasLocales(html) {
  const referencias = new Set();

  for (const tag of html.match(RE_LINK) ?? []) {
    const rel = (extraerAtributo(tag, 'rel') ?? '').toLowerCase().split(/\s+/);
    if (!rel.includes('stylesheet') && !rel.includes('modulepreload')) continue;
    const href = extraerAtributo(tag, 'href');
    if (href) referencias.add(href);
  }

  for (const tag of html.match(RE_SCRIPT_ABIERTO) ?? []) {
    const src = extraerAtributo(tag, 'src');
    if (src) referencias.add(src);
  }

  return [...referencias];
}

/**
 * Resolves one reference string to an absolute filesystem path under
 * `distDir`. Astro (no `base` configured in `astro.config.mjs`) emits every
 * local CSS/JS reference root-absolute (`/_astro/Base.xxx.css`), so the
 * leading slash is stripped and the rest is joined onto `distDir`; a
 * reference without a leading slash is joined the same way. Query string or
 * fragment (neither ever produced by this build, but harmless if present) is
 * dropped first.
 * @param {string} distDir
 * @param {string} referencia
 * @returns {string}
 */
export function resolverRutaDist(distDir, referencia) {
  const sinQueryNiHash = referencia.split(/[?#]/)[0];
  const relativa = sinQueryNiHash.startsWith('/') ? sinQueryNiHash.slice(1) : sinQueryNiHash;
  return join(distDir, relativa);
}

/**
 * Recursively lists every `*.html` file under `dir`, as paths relative to
 * `dir` using `/` separators (stable across platforms and easy to print).
 * @param {string} dir
 * @returns {string[]}
 */
export function listarPaginasHtml(dir) {
  return listarRutasHtmlAbsolutas(dir)
    .map((ruta) => relative(dir, ruta).split(sep).join('/'))
    .sort();
}

/**
 * Recursion helper for {@link listarPaginasHtml}: absolute paths of every
 * `*.html` file under `dir`. Kept separate so the recursive call never has
 * to re-derive (and get wrong) a path relative to the original root — each
 * level only ever joins onto its own `dir`.
 * @param {string} dir
 * @returns {string[]}
 */
function listarRutasHtmlAbsolutas(dir) {
  /** @type {string[]} */
  const resultado = [];
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      resultado.push(...listarRutasHtmlAbsolutas(ruta));
    } else if (entrada.isFile() && entrada.name.toLowerCase().endsWith('.html')) {
      resultado.push(ruta);
    }
  }
  return resultado;
}

/**
 * Gzips a buffer at {@link NIVEL_GZIP} and returns the compressed length.
 * @param {Buffer} buffer
 * @returns {number}
 */
function bytesGzip(buffer) {
  return gzipSync(buffer, { level: NIVEL_GZIP }).length;
}

/**
 * @typedef {object} PesoDePagina
 * @property {string} rutaPagina - path of the page, relative to `dist/`.
 * @property {number} brutoBytes - HTML + local CSS/JS, uncompressed.
 * @property {number} gzipBytes - HTML + local CSS/JS, each gzipped and summed; what the gate checks.
 * @property {string[]} externos - external (http/https) references found, not counted.
 * @property {string[]} rotas - local references that do not resolve to a file under `dist/`.
 */

/**
 * Computes the weight of one built page: its own HTML plus every local
 * CSS/JS resource it references, de-duplicated.
 * @param {string} distDir
 * @param {string} rutaPaginaRelativa - as returned by {@link listarPaginasHtml}.
 * @returns {PesoDePagina}
 */
export function calcularPesoDePagina(distDir, rutaPaginaRelativa) {
  const rutaAbsolutaPagina = join(distDir, ...rutaPaginaRelativa.split('/'));
  const bufferHtml = readFileSync(rutaAbsolutaPagina);

  let brutoBytes = bufferHtml.length;
  let gzipBytes = bytesGzip(bufferHtml);
  /** @type {string[]} */
  const externos = [];
  /** @type {string[]} */
  const rotas = [];
  const vistos = new Set();

  for (const referencia of extraerReferenciasLocales(bufferHtml.toString('utf8'))) {
    if (esUrlExterna(referencia)) {
      externos.push(referencia);
      continue;
    }
    if (esUrlInline(referencia)) continue;

    const rutaAbsolutaRecurso = resolverRutaDist(distDir, referencia);
    if (vistos.has(rutaAbsolutaRecurso)) continue;
    vistos.add(rutaAbsolutaRecurso);

    if (!existsSync(rutaAbsolutaRecurso) || !statSync(rutaAbsolutaRecurso).isFile()) {
      rotas.push(referencia);
      continue;
    }

    const bufferRecurso = readFileSync(rutaAbsolutaRecurso);
    brutoBytes += bufferRecurso.length;
    gzipBytes += bytesGzip(bufferRecurso);
  }

  return { rutaPagina: rutaPaginaRelativa, brutoBytes, gzipBytes, externos, rotas };
}

/**
 * @typedef {object} EvaluacionPresupuesto
 * @property {PesoDePagina[]} queExceden - pages whose gzip total is over {@link LIMITE_BYTES}.
 * @property {PesoDePagina[]} conReferenciasRotas - pages with at least one unresolved local reference.
 * @property {boolean} ok - `true` only when both lists above are empty; this is what decides the gate's exit code.
 */

/**
 * The gate's decision logic, isolated from I/O and process control so it can
 * be unit-tested directly: given the per-page results, says which pages
 * violate the budget, which have a broken local reference, and whether the
 * run as a whole passes. `main()` below is the only caller in production,
 * but the decision itself — the threshold check and what counts as a
 * failure — lives here, not inside `main()`, precisely so a change to it
 * (e.g. loosening the threshold or dropping a failure condition) is caught
 * by a test against this function's return value, not only by observing the
 * CLI's exit code.
 * @param {PesoDePagina[]} resultados
 * @returns {EvaluacionPresupuesto}
 */
export function evaluarPresupuesto(resultados) {
  const queExceden = resultados.filter((r) => r.gzipBytes > LIMITE_BYTES);
  const conReferenciasRotas = resultados.filter((r) => r.rotas.length > 0);
  return {
    queExceden,
    conReferenciasRotas,
    ok: queExceden.length === 0 && conReferenciasRotas.length === 0,
  };
}

/** @param {number} bytes */
function formatoKB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

/**
 * Builds the human-readable report: one row per page, sorted heaviest
 * (gzip) first, with the maximum called out.
 * @param {PesoDePagina[]} resultados
 * @returns {string}
 */
export function generarTabla(resultados) {
  const ordenados = [...resultados].sort((a, b) => b.gzipBytes - a.gzipBytes);
  const anchoRuta = Math.max(...ordenados.map((r) => r.rutaPagina.length), 'PÁGINA'.length);
  const filas = ordenados.map((r) => {
    const marca = r.gzipBytes > LIMITE_BYTES ? '  ⚠ EXCEDE' : '';
    return `${r.rutaPagina.padEnd(anchoRuta)}  bruto=${formatoKB(r.brutoBytes).padStart(9)}  gzip=${formatoKB(r.gzipBytes).padStart(9)}${marca}`;
  });
  const max = ordenados[0];
  const resumen = max
    ? `Máximo: ${max.rutaPagina} (gzip ${formatoKB(max.gzipBytes)} de ${formatoKB(LIMITE_BYTES)})`
    : 'Sin páginas HTML en dist/.';
  return [
    `${'PÁGINA'.padEnd(anchoRuta)}  ${'BRUTO'.padStart(13)}  ${'GZIP'.padStart(13)}`,
    ...filas,
    '',
    resumen,
  ].join('\n');
}

async function main() {
  const distDir = process.argv[2] ? join(process.cwd(), process.argv[2]) : join(RAIZ, 'dist');

  if (!existsSync(distDir)) {
    console.error(`presupuesto-peso: no existe ${distDir}. Corré \`npm run build\` primero.`);
    process.exitCode = 1;
    return;
  }

  const paginas = listarPaginasHtml(distDir);
  if (paginas.length === 0) {
    console.error(`presupuesto-peso: ${distDir} no tiene ningún *.html.`);
    process.exitCode = 1;
    return;
  }

  const resultados = paginas.map((pagina) => calcularPesoDePagina(distDir, pagina));

  const { queExceden, conReferenciasRotas, ok } = evaluarPresupuesto(resultados);
  const externosVistos = new Map();
  for (const r of resultados) {
    for (const externo of r.externos) {
      if (!externosVistos.has(externo)) externosVistos.set(externo, []);
      externosVistos.get(externo).push(r.rutaPagina);
    }
  }

  console.log(generarTabla(resultados));

  if (externosVistos.size > 0) {
    console.log('\nRecursos externos referenciados (no cuentan para el presupuesto):');
    for (const [externo, paginasQueLoUsan] of externosVistos) {
      console.log(`  ${externo}  (${paginasQueLoUsan.length} página(s))`);
    }
  }

  if (conReferenciasRotas.length > 0) {
    console.error('\npresupuesto-peso: referencias locales rotas:');
    for (const r of conReferenciasRotas) {
      for (const rota of r.rotas) console.error(`  ${r.rutaPagina} -> ${rota}`);
    }
  }

  if (queExceden.length > 0) {
    console.error(
      `\npresupuesto-peso: ${queExceden.length} página(s) exceden ${formatoKB(LIMITE_BYTES)} gzip de HTML+CSS+JS:`
    );
    for (const r of queExceden) console.error(`  ${r.rutaPagina}  gzip=${formatoKB(r.gzipBytes)}`);
  }

  if (!ok) {
    process.exitCode = 1;
    return;
  }

  console.log(
    `\npresupuesto-peso: OK — ${resultados.length} página(s), todas ≤ ${formatoKB(LIMITE_BYTES)} gzip de HTML+CSS+JS.`
  );
}

// Only run the CLI when invoked directly (`node scripts/presupuesto-peso.mjs`),
// not when imported by the unit tests.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(`presupuesto-peso: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
