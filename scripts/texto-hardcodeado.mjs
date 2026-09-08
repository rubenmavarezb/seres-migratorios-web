#!/usr/bin/env node
/**
 * Finds visible text written straight into an `.astro` file instead of coming
 * from `t(idioma, clave)` or from a `{ es, en }` field of a collection
 * (CLAUDE.md, "Bilingüe siempre": "Nunca hardcodear texto visible en un
 * .astro"). It is the gate of SM-047 — "un grep sobre src/pages y
 * src/components no encuentra texto visible en español fuera de los
 * diccionarios y de las colecciones" — written against Astro's own parser
 * instead of a regex, so a `<p>` inside a `.map()` counts and a JS comment
 * inside `{ }` does not.
 *
 * What counts as a finding:
 * - A text node with at least one word of three letters or more (or an
 *   inverted mark ¡ ¿) whose parent is an element, a component, a fragment or
 *   the template root. Text directly inside `{ }` is JavaScript, not text;
 *   `<script>`, `<style>`, comments and the frontmatter are never read.
 * - A quoted (literal) attribute whose name reaches the reader — `alt`,
 *   `title`, `placeholder`, `aria-label`, `set:text`… — with such a word.
 * - On a component, any quoted prop that reads like copy: two or more words,
 *   a Spanish-only character, or a capitalized word (`texto="Sumate"`).
 *
 * What does not: the not-translatable strings of CLAUDE.md ("Seres
 * Migratorios", CONSULADO, FAMILIA / RESILIENCIA / EXILIO, handles,
 * "¡Aguante la fotografía!"), and `src/pages/kit.astro` as a whole — the
 * internal, `noindex`, Spanish-only component kit, whose labels are specimen
 * names and prop values (`variante="papel" (por defecto)`), not interface
 * copy (see the OBSERVACIÓN in the SM-047 report).
 *
 * Parsing uses `@astrojs/compiler`, the compiler `astro` itself depends on:
 * no new dependency, and the exact grammar the build applies.
 *
 * Usage:
 *   node scripts/texto-hardcodeado.mjs            # src/pages, src/components, src/layouts
 *   node scripts/texto-hardcodeado.mjs src/pages  # one or more folders or files
 *
 * Exit code 1 with one line per finding (`archivo:línea:columna  tipo  «texto»`),
 * 0 when nothing is found.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from '@astrojs/compiler';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

const CARPETAS_POR_DEFECTO = ['src/pages', 'src/components', 'src/layouts'];

/** Files skipped by the default run, with the reason in the header above; naming one explicitly still inspects it. */
const ARCHIVOS_EXENTOS = new Set(['src/pages/kit.astro']);

/**
 * Component props that never carry copy, however many words they hold:
 * utility classes, ids, paths, image and link plumbing, `data-*`/`aria-*`
 * (the `aria-*` that do carry copy are in ATRIBUTOS_VISIBLES and checked first).
 */
const PROPS_SIN_TEXTO = new Set([
  'class',
  'class:list',
  'style',
  'id',
  'href',
  'src',
  'slot',
  'sizes',
  'widths',
  'formats',
  'width',
  'height',
  'loading',
  'decoding',
  'fetchpriority',
  'rel',
  'target',
  'type',
  'name',
  'lang',
  'hreflang',
  'is:inline',
  'is:raw',
]);

/**
 * Attributes whose literal value reaches the reader, as text or as accessible
 * name: the HTML ones, plus the props the canonical components use for copy
 * (`texto` of `Anotacion`/`CajaNombre`, `arriba`/`abajo` of `TitularPartido`,
 * the `BloqueFicha` lines, the `alt`s of `FichaFotografo`…). A single lowercase
 * word in one of these (`texto="sumate"`) is copy; in any other prop
 * (`variante="sello"`) it is a variant name, which PARECE_TEXTO leaves alone.
 */
const ATRIBUTOS_VISIBLES = new Set([
  'alt',
  'title',
  'placeholder',
  'label',
  'aria-label',
  'aria-description',
  'aria-placeholder',
  'aria-roledescription',
  'aria-valuetext',
  'set:text',
  'set:html',
  'texto',
  'arriba',
  'abajo',
  'titulo',
  'subtitulo',
  'descripcion',
  'etiqueta',
  'linea',
  'pie',
  'credito',
  'nombre',
  'fecha',
  'horario',
  'ciudad',
  'obraAlt',
  'retratoAlt',
  'prefijoPie',
]);

/** Strings CLAUDE.md lists as never translated, so they may sit in the markup. */
const NO_TRADUCIBLES = [
  /^(Seres|Migratorios|Seres Migratorios)$/,
  /^(CONSULADO|FAMILIA|RESILIENCIA|EXILIO)$/,
  /^FAMILIA \/ RESILIENCIA \/ EXILIO$/,
  /^¡Aguante la fotografía!$/,
  /^@[\w.]+$/,
];

/** A run of three or more letters, or an inverted mark: the smallest thing that reads as a word. */
const PALABRA = /[A-Za-zÁÉÍÓÚÑÜáéíóúñü]{3,}|[¡¿]/;
/** Two words with letters, a Spanish-only character, or a capitalized word: a prop that reads as copy. */
const PARECE_TEXTO =
  /[A-Za-zÁÉÍÓÚÑÜáéíóúñü]{2,}\s+[A-Za-zÁÉÍÓÚÑÜáéíóúñü]{2,}|[áéíóúñÁÉÍÓÚÑ¿¡]|(?:^|\s)[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,}/;

function esNoTraducible(texto) {
  return NO_TRADUCIBLES.some((patron) => patron.test(texto));
}

function normalizar(texto) {
  return texto.replace(/\s+/g, ' ').trim();
}

/** Every `.astro` file under `ruta` (a file or a folder), relative to the repo root. */
function archivosAstro(ruta) {
  const absoluta = join(RAIZ, ruta);
  const info = statSync(absoluta);
  if (info.isFile()) return ruta.endsWith('.astro') ? [ruta] : [];
  return readdirSync(absoluta, { withFileTypes: true })
    .flatMap((entrada) => archivosAstro(join(ruta, entrada.name)))
    .sort();
}

/**
 * Walks the AST collecting findings. `padre` is the type of the enclosing node:
 * text under `expression` is JavaScript and is skipped; text under `script`,
 * `style` and `comment` never reaches the reader either.
 */
function recorrer(nodo, padre, hallazgos) {
  if (nodo.type === 'frontmatter' || nodo.type === 'comment' || nodo.type === 'doctype') return;

  if (nodo.type === 'text') {
    if (padre === 'expression' || padre === 'script' || padre === 'style') return;
    const texto = normalizar(nodo.value);
    if (PALABRA.test(texto) && !esNoTraducible(texto)) {
      hallazgos.push({ tipo: 'texto', texto, posicion: nodo.position?.start });
    }
    return;
  }

  const esComponente = nodo.type === 'component';
  for (const atributo of nodo.attributes ?? []) {
    if (atributo.kind !== 'quoted') continue;
    // Campo.nombre is the control's technical name/id, never its visible label.
    // Other components still expose nombre as copy (e.g. FichaFotografo).
    if (esComponente && nodo.name === 'Campo' && atributo.name === 'nombre') continue;
    const valor = normalizar(atributo.value);
    if (valor === '' || esNoTraducible(valor)) continue;
    const visible = ATRIBUTOS_VISIBLES.has(atributo.name) && PALABRA.test(valor);
    const propConCopy =
      esComponente &&
      !PROPS_SIN_TEXTO.has(atributo.name) &&
      !/^(data|aria)-/.test(atributo.name) &&
      PARECE_TEXTO.test(valor);
    if (visible || propConCopy) {
      hallazgos.push({ tipo: atributo.name, texto: valor, posicion: atributo.position?.start });
    }
  }

  const tipoParaHijos = nodo.type === 'element' ? nodo.name : nodo.type;
  for (const hijo of nodo.children ?? []) recorrer(hijo, tipoParaHijos, hallazgos);
}

async function main() {
  const objetivos = process.argv.slice(2);
  const porDefecto = objetivos.length === 0;
  const rutas = (porDefecto ? CARPETAS_POR_DEFECTO : objetivos).map((r) =>
    isAbsolute(r) ? relative(RAIZ, r) : r
  );
  const archivos = rutas
    .flatMap(archivosAstro)
    .filter((a) => !porDefecto || !ARCHIVOS_EXENTOS.has(a));

  let total = 0;
  const conHallazgos = [];
  for (const archivo of archivos) {
    const fuente = readFileSync(join(RAIZ, archivo), 'utf8');
    const { ast } = await parse(fuente, { position: true });
    const hallazgos = [];
    recorrer(ast, 'root', hallazgos);
    if (hallazgos.length === 0) continue;
    conHallazgos.push(archivo);
    total += hallazgos.length;
    for (const h of hallazgos) {
      const donde = h.posicion ? `${h.posicion.line}:${h.posicion.column}` : '?';
      console.error(`  ${archivo}:${donde}  ${h.tipo}  «${h.texto}»`);
    }
  }

  if (total > 0) {
    console.error(
      `texto-hardcodeado: ${total} hallazgo(s) en ${conHallazgos.length} archivo(s). Todo texto visible sale de t() o de un campo { es, en } de la colección (CLAUDE.md, "Bilingüe siempre").`
    );
    process.exitCode = 1;
    return;
  }
  console.log(
    `texto-hardcodeado: OK — ${archivos.length} archivos .astro sin texto visible fuera de t() y las colecciones.`
  );
}

main().catch((error) => {
  console.error(`texto-hardcodeado: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
