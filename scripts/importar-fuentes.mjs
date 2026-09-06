#!/usr/bin/env node
/**
 * Import everything the site needs from the brand folder
 * (`~/Documents/Seres Migratorios/`) into this repo.
 *
 * Idempotent: a file is copied only when it is missing or its content differs.
 * Nothing is ever deleted from the repo and nothing is ever written to the
 * source folder, which is read-only by rule.
 *
 * Usage:
 *   node scripts/importar-fuentes.mjs                 # import everything
 *   node scripts/importar-fuentes.mjs --dry-run       # show the plan only
 *   node scripts/importar-fuentes.mjs --solo assets   # one step: ds | design | assets | claude
 *   node scripts/importar-fuentes.mjs --origen "/otra/carpeta" --destino /otro/repo
 *
 * Steps:
 *   ds      02-Design-System/canvas/** and the DS documents -> design/ds/{canvas,docs}
 *   design  assets-fuente/_para-claude-design/assets/** (+ extras of assets-fuente)
 *           -> design/assets/**, and 03-Web/diseno-web-indice.md -> design/
 *   assets  design/assets/** -> src/assets/** with the content-model layout
 *           (fotos/<slug>/NN.png, retratos, manuscritas, firmas, marca, logos)
 *   claude  03-Web/CLAUDE.md -> CLAUDE.md (byte-for-byte copy)
 *
 * The nine web pages (`design/*.dc.html`, `support.js`, `_ds/`) come from the
 * Claude Design project via DesignSync, not from the brand folder; this script
 * leaves them untouched.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, copyFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const DRY = flag('--dry-run');
const SOLO = opt('--solo', null);
const ORIGEN = resolve(opt('--origen', join(homedir(), 'Documents', 'Seres Migratorios')));
const DESTINO = resolve(opt('--destino', join(dirname(fileURLToPath(import.meta.url)), '..')));

const PASOS = ['ds', 'design', 'assets', 'claude'];
if (SOLO && !PASOS.includes(SOLO)) {
  console.error(`--solo tiene que ser uno de: ${PASOS.join(' | ')}`);
  process.exit(2);
}
if (!existsSync(ORIGEN)) {
  console.error(`No existe la carpeta de origen: ${ORIGEN}`);
  process.exit(2);
}

/** Binary assets referenced by the approved design that are not in the brand folder yet. */
const ESPERADOS_DESIGN = [
  'obra/ruben-mavarez-web-01.png',
  'obra/ruben-mavarez-web-02.png',
  'obra/ruben-mavarez-web-03.png',
  'obra/ruben-mavarez-web-04.png',
  'obra/ruben-mavarez-web-05.png',
  'obra/ruben-mavarez-web-06.png',
  'obra/ruben-mavarez-web-07.png',
  'obra/ruben-mavarez-web-08.png',
  'retratos/ruben-mavarez.png',
  'piezas/post-refugio.jpg',
];

/** design/assets relative path -> source file, filled by the "design" step (also used by "assets" in dry-run). */
const origenDeAsset = new Map();

const resumen = { copiados: [], actualizados: [], iguales: 0, faltantes: [] };

const hash = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');

function copiar(desde, hacia) {
  if (!existsSync(desde)) {
    resumen.faltantes.push(relative(ORIGEN, desde));
    return;
  }
  const existe = existsSync(hacia);
  if (existe && hash(desde) === hash(hacia)) {
    resumen.iguales += 1;
    return;
  }
  (existe ? resumen.actualizados : resumen.copiados).push(relative(DESTINO, hacia));
  if (DRY) return;
  mkdirSync(dirname(hacia), { recursive: true });
  copyFileSync(desde, hacia);
}

/** Recursively list files under `dir` (relative paths), skipping macOS metadata. */
function listar(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  const walk = (actual) => {
    for (const entry of readdirSync(actual, { withFileTypes: true })) {
      if (entry.name === '.DS_Store' || entry.name.startsWith('._')) continue;
      const full = join(actual, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) out.push(relative(dir, full));
    }
  };
  walk(dir);
  return out.sort();
}

function copiarCarpeta(desde, hacia, filtro = () => true, registrar = null) {
  for (const rel of listar(desde)) {
    if (!filtro(rel)) continue;
    copiar(join(desde, rel), join(hacia, rel));
    if (registrar) registrar(rel, join(desde, rel));
  }
}

/* ---------------------------------------------------------------------- */

function pasoDs() {
  const ds = join(ORIGEN, '02-Design-System');
  copiarCarpeta(join(ds, 'canvas'), join(DESTINO, 'design', 'ds', 'canvas'));
  for (const f of [
    'design-system.md',
    'movimiento-y-animacion.md',
    'tokens.css',
    'tokens.json',
    'tailwind-theme.css',
  ]) {
    copiar(join(ds, f), join(DESTINO, 'design', 'ds', 'docs', f));
  }
}

function pasoDesign() {
  const fuente = join(ORIGEN, '02-Design-System', 'assets-fuente');
  const destinoAssets = join(DESTINO, 'design', 'assets');
  const registrar = (sub) => (rel, src) => origenDeAsset.set(sub ? `${sub}/${rel}` : rel, src);
  // Curated set used by the Claude Design projects (same names as in the .dc.html files).
  copiarCarpeta(
    join(fuente, '_para-claude-design', 'assets'),
    destinoAssets,
    () => true,
    registrar('')
  );
  // Extras that only exist in the root subfolders (e.g. titulo-seres.png, claim-refugio-v2.png),
  // copied when the curated set does not already provide a file with that name.
  // `obra/` and `retratos/` are deliberately left out: the curated set is the approved one
  // (the root `obra/` attributes `pusadolfo-01` to a person, which the approved design does not).
  for (const sub of ['marca', 'manuscritas']) {
    copiarCarpeta(
      join(fuente, sub),
      join(destinoAssets, sub),
      (rel) => !origenDeAsset.has(`${sub}/${rel}`) && !rel.startsWith('x-'),
      registrar(sub)
    );
  }
  copiar(
    join(ORIGEN, '03-Web', 'diseno-web-indice.md'),
    join(DESTINO, 'design', 'diseno-web-indice.md')
  );
  for (const rel of ESPERADOS_DESIGN) {
    if (!existsSync(join(destinoAssets, rel)))
      resumen.faltantes.push(
        `design/assets/${rel} (exportar desde Claude Design a assets-fuente/_para-claude-design/assets/${rel})`
      );
  }
}

/** Map one design asset path (relative to design/assets) to its src/assets destination, or null to skip. */
function destinoEnSrc(rel) {
  const [carpeta, ...resto] = rel.split('/');
  const nombre = resto.join('/');
  const base = basename(nombre, extname(nombre));
  const ext = extname(nombre);
  switch (carpeta) {
    case 'obra': {
      if (base === 'pusadolfo-01' || base.startsWith('sin-atribuir-'))
        return `fotos/ediciones/buenos-aires-2026/${base}${ext}`;
      const web = base.match(/^(.+)-web-(\d+)$/);
      if (web) return `fotos/${web[1]}/web-${web[2]}${ext}`;
      const m = base.match(/^(.+)-(\d+)$/);
      return m ? `fotos/${m[1]}/${m[2]}${ext}` : `fotos/${base}${ext}`;
    }
    case 'retratos':
      return `retratos/${nombre}`;
    case 'manuscritas': {
      if (base.startsWith('frase-')) return `manuscritas/${base.slice('frase-'.length)}${ext}`;
      if (base.startsWith('firma-')) return `firmas/${base.slice('firma-'.length)}${ext}`;
      return `manuscritas/marca/${nombre}`;
    }
    case 'marca':
      return `marca/${nombre}`;
    case 'logos':
      return `logos/${nombre}`;
    case 'piezas':
      return null; // reference pieces, not site content
    default:
      return carpeta === 'placeholder-retrato.svg' ? 'marca/placeholder-retrato.svg' : null;
  }
}

function pasoAssets() {
  const carpetaDesign = join(DESTINO, 'design', 'assets');
  // Prefer what is already in design/assets (it may hold files exported by hand);
  // fall back to the source files registered by the "design" step (dry-run, or --solo assets on a fresh repo).
  const fuentes = new Map(origenDeAsset);
  for (const rel of listar(carpetaDesign)) fuentes.set(rel, join(carpetaDesign, rel));
  if (fuentes.size === 0) {
    console.error('No hay assets de diseño: corré primero el paso "design".');
    process.exit(2);
  }
  for (const [rel, src] of [...fuentes.entries()].sort()) {
    const destino = destinoEnSrc(rel);
    if (destino) copiar(src, join(DESTINO, 'src', 'assets', destino));
  }
}

function pasoClaude() {
  copiar(join(ORIGEN, '03-Web', 'CLAUDE.md'), join(DESTINO, 'CLAUDE.md'));
}

/* ---------------------------------------------------------------------- */

const acciones = { ds: pasoDs, design: pasoDesign, assets: pasoAssets, claude: pasoClaude };
console.log(`${DRY ? '[dry-run] ' : ''}Origen: ${ORIGEN}\nDestino: ${DESTINO}\n`);
for (const paso of PASOS) {
  if (SOLO && SOLO !== paso) continue;
  acciones[paso]();
}

const lista = (titulo, items) => {
  if (!items.length) return;
  console.log(`${titulo} (${items.length}):`);
  for (const i of items) console.log(`  ${i}`);
  console.log('');
};
lista(DRY ? 'Se copiarían' : 'Copiados', resumen.copiados);
lista(DRY ? 'Se actualizarían' : 'Actualizados', resumen.actualizados);
console.log(`Sin cambios: ${resumen.iguales}\n`);
lista('FALTANTES en el origen', resumen.faltantes);
process.exit(0);
