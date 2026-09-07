#!/usr/bin/env node
/**
 * Checks that `src/i18n/es.json` and `src/i18n/en.json` have exactly the same
 * tree of keys, and that no leaf is an empty string.
 *
 * `utils.ts` derives `ClaveDeTexto` (the type `t()` accepts) from the shape of
 * `es.json` alone, so a key missing from `en.json` compiles fine and silently
 * falls back to Spanish at runtime (SM-046 acceptance criterion: "los dos
 * archivos tienen exactamente el mismo árbol de claves, verificado por un
 * test"). This script is that test, run standalone or as part of
 * `npm run test:unit`.
 *
 * Pure Node (`node:fs`, `node:path`, `node:url`), no dependencies, no
 * bundler: `node scripts/i18n-paridad.mjs`.
 *
 * Usage:
 *   node scripts/i18n-paridad.mjs
 *
 * Exit code 0 when the two trees match and every leaf is non-empty; 1
 * otherwise, after printing every problem found (not just the first one).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const DIR_I18N = join(AQUI, '..', 'src', 'i18n');
const RUTA_ES = join(DIR_I18N, 'es.json');
const RUTA_EN = join(DIR_I18N, 'en.json');

/** Reads and parses a dictionary, failing loudly (not with an empty tree) if it is missing or malformed. */
function leerDiccionario(ruta) {
  const contenido = readFileSync(ruta, 'utf8');
  return JSON.parse(contenido);
}

/**
 * Flattens a dictionary tree into a `Map` of dot-separated path -> leaf
 * value, e.g. `{ nav: { artistas: "Artistas" } }` -> `"nav.artistas" =>
 * "Artistas"`. A path whose value is neither a plain object nor a string
 * (an array, a number, `null`...) is recorded in `formaInvalida` instead of
 * `hojas`, since `es.json` / `en.json` are only ever supposed to hold nested
 * objects and string leaves (arrays would also break `utils.ts`'s recursive
 * `ClavesDe<T>`, which is why the dictionaries never use them).
 */
function aplanar(arbol, prefijo, hojas, formaInvalida) {
  for (const [clave, valor] of Object.entries(arbol)) {
    const ruta = prefijo ? `${prefijo}.${clave}` : clave;
    if (typeof valor === 'string') {
      hojas.set(ruta, valor);
    } else if (esObjetoPlano(valor)) {
      aplanar(valor, ruta, hojas, formaInvalida);
    } else {
      formaInvalida.push(ruta);
    }
  }
}

function esObjetoPlano(valor) {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function main() {
  const es = leerDiccionario(RUTA_ES);
  const en = leerDiccionario(RUTA_EN);

  const hojasEs = new Map();
  const hojasEn = new Map();
  const formaInvalidaEs = [];
  const formaInvalidaEn = [];
  aplanar(es, '', hojasEs, formaInvalidaEs);
  aplanar(en, '', hojasEn, formaInvalidaEn);

  const problemas = [];

  for (const ruta of formaInvalidaEs) {
    problemas.push(`es.json: "${ruta}" no es ni un objeto anidado ni una cadena (¿un array?).`);
  }
  for (const ruta of formaInvalidaEn) {
    problemas.push(`en.json: "${ruta}" no es ni un objeto anidado ni una cadena (¿un array?).`);
  }

  const clavesEs = new Set(hojasEs.keys());
  const clavesEn = new Set(hojasEn.keys());

  const faltanEnEn = [...clavesEs].filter((clave) => !clavesEn.has(clave)).sort();
  const faltanEnEs = [...clavesEn].filter((clave) => !clavesEs.has(clave)).sort();

  for (const clave of faltanEnEn) {
    problemas.push(`Falta en en.json: "${clave}"`);
  }
  for (const clave of faltanEnEs) {
    problemas.push(`Falta en es.json: "${clave}" (sobra en en.json)`);
  }

  for (const [clave, valor] of hojasEs) {
    if (valor.trim() === '') {
      problemas.push(`es.json: "${clave}" es una cadena vacía.`);
    }
  }
  for (const [clave, valor] of hojasEn) {
    if (valor.trim() === '') {
      problemas.push(`en.json: "${clave}" es una cadena vacía.`);
    }
  }

  if (problemas.length > 0) {
    console.error(`i18n-paridad: ${problemas.length} problema(s) entre es.json y en.json.\n`);
    for (const problema of problemas) {
      console.error(`  - ${problema}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `i18n-paridad: OK — ${clavesEs.size} claves, el mismo árbol en es.json y en.json, sin valores vacíos.`
  );
}

main();
