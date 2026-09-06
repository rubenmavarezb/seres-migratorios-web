/**
 * Single entry point of the i18n layer (PLAN.md §6): the dictionary lookup
 * `t()` plus every route helper, re-exported so a component only ever imports
 * from `../i18n/utils.ts`.
 *
 * The route helpers live in `./rutas.ts`, which imports nothing and can be run
 * by `node --test`; this file cannot, because it imports JSON and reads
 * `import.meta.env`.
 */
import { type Idioma } from './rutas.ts';
import en from './en.json';
import es from './es.json';

export * from './rutas.ts';

/** `es.json` is the reference tree; `en.json` may lag behind it. */
const DICCIONARIOS = { es, en };

/**
 * Every leaf of a dictionary tree as a dot-separated path (`'nav.manifiesto'`).
 * Recursive on purpose: a key that does not exist in `es.json` is a compile
 * error at the call site, not a blank string at render time.
 */
type ClavesDe<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${ClavesDe<T[K]>}`;
}[keyof T & string];

/** Valid key of `t()`, derived from the shape of `es.json`. */
export type ClaveDeTexto = ClavesDe<typeof es>;

/** Narrows an unknown JSON node to an indexable branch. */
function esRama(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null;
}

/** Walks a dot-separated path down a dictionary tree. */
function buscar(arbol: unknown, clave: string): string | undefined {
  let actual: unknown = arbol;
  for (const parte of clave.split('.')) {
    if (!esRama(actual)) return undefined;
    actual = actual[parte];
  }
  return typeof actual === 'string' ? actual : undefined;
}

/**
 * Interface string for `idioma`. When the key is missing from the requested
 * dictionary it falls back to the Spanish value and warns during development,
 * which is preferable to shipping an empty label (CLAUDE.md, "Bilingüe
 * siempre").
 */
export function t(idioma: Idioma, clave: ClaveDeTexto): string {
  const traduccion = buscar(DICCIONARIOS[idioma], clave);
  if (traduccion !== undefined) return traduccion;

  if (import.meta.env.DEV) {
    console.warn(`[i18n] falta "${clave}" en ${idioma}.json; se usa el valor de es.json`);
  }

  // `clave` is derived from the `es.json` tree, so this always resolves for a
  // type-checked caller; returning the key keeps `t()` total regardless.
  return buscar(es, clave) ?? clave;
}
