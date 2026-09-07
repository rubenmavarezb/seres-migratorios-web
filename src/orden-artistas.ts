/**
 * Ordering of the `artistas` collection, shared by `/artistas` and
 * `/artistas/[slug]` (SM-036, SM-037).
 *
 * It lives in a module of its own — next to `consts.ts` and
 * `content.config.ts`, the two other plain modules at the root of `src/` —
 * because both pages need the SAME order: SM-036 asks for "el orden es estable
 * entre builds" and SM-037 for a previous/next navigation that follows "el
 * mismo orden del índice". Duplicating the comparators in two `.astro`
 * frontmatters would let those two orders drift apart.
 *
 * The order the approved design asks for (design/Artistas.dc.html, "NOTA PARA
 * DESARROLLO": "fotean 001–007, luego exponen en el orden de la pieza
 * original"; design/Artista.dc.html: "anterior/siguiente por el orden del
 * índice /artistas (001–007, luego exponen sin repetir), cíclico") is:
 *
 * 1. `fotean`: everyone whose `roles` include 'fotea', by `numero` (001-007).
 * 2. `exponen`: everyone whose `roles` include 'expone', in the order of the
 *    featured edition's own `exponen` list — that list IS "la pieza original"
 *    (`src/content/ediciones/buenos-aires-2026.md`), and reproducing it from
 *    the `artistas` collection alone is not possible: the seven people who only
 *    exhibit carry no `numero` and no `orden`. Anyone holding the role but
 *    absent from that list is appended afterwards, sorted by `orden` and then
 *    by `nombre`, so a new entry never disappears from the index.
 *
 * Every comparator is total and reads only committed content, so two builds of
 * the same commit produce the same order (SM-036's acceptance criterion).
 * `getCollection()`'s own order is never relied upon.
 */
import type { CollectionEntry } from 'astro:content';

import type { Rol } from './content.config.ts';

export type Artista = CollectionEntry<'artistas'>;
export type Edicion = CollectionEntry<'ediciones'>;

/** The two role groups the approved index is split into. */
export type Seccion = Extract<Rol, 'fotea' | 'expone'>;

/** Sorts last: `numero` and `orden` are both optional in the schema. */
const AL_FINAL = Number.MAX_SAFE_INTEGER;

/**
 * `numero` first (a three-digit string, so a plain comparison is also the
 * numeric one), then the manual `orden`, then `nombre` — the fallback
 * `content.config.ts` documents for `orden` ("when missing, entries are sorted
 * by `numero` and then by name"). Whoever has no `numero` goes after everyone
 * who has one.
 */
function porNumeroOrdenNombre(a: Artista, b: Artista): number {
  const numeroA = a.data.numero;
  const numeroB = b.data.numero;
  if (numeroA !== numeroB) {
    if (numeroA === undefined) return 1;
    if (numeroB === undefined) return -1;
    return numeroA < numeroB ? -1 : 1;
  }
  const ordenA = a.data.orden ?? AL_FINAL;
  const ordenB = b.data.orden ?? AL_FINAL;
  if (ordenA !== ordenB) return ordenA - ordenB;
  return a.data.nombre.localeCompare(b.data.nombre, 'es');
}

/** Drops the drafts. `borrador` defaults to `false` in the schema. */
export function publicados(artistas: Artista[]): Artista[] {
  return artistas.filter((artista) => !artista.data.borrador);
}

/**
 * Edition the index is scoped to: the one marked `proxima` (there is only ever
 * one, per CLAUDE.md) or, failing that, the most recent `pasada`. Its `nombre`
 * is the mono subtitle of the index and its `exponen` list sets the order of
 * the second group.
 */
export function edicionDestacada(ediciones: Edicion[]): Edicion | undefined {
  const proxima = ediciones.find((edicion) => edicion.data.estado === 'proxima');
  if (proxima !== undefined) return proxima;
  return [...ediciones]
    .sort((a, b) => b.data.fecha.getTime() - a.data.fecha.getTime())
    .find((edicion) => edicion.data.estado === 'pasada');
}

/** Everyone holding `rol`, unordered. */
function conRol(artistas: Artista[], rol: Rol): Artista[] {
  return artistas.filter((artista) => artista.data.roles.includes(rol));
}

/**
 * The two groups of the index. `edicion` only orders the second one; without it
 * (no edition in the collection) `exponen` falls back to `orden` / `nombre`.
 */
export function grupos(artistas: Artista[], edicion?: Edicion): Record<Seccion, Artista[]> {
  const disponibles = publicados(artistas);

  const fotean = conRol(disponibles, 'fotea').sort(porNumeroOrdenNombre);

  // `reference('artistas')` resolves to `{ collection, id }`, and the glob
  // loader's `id` is the file name without its extension — the same value as
  // the entry's own `slug` field.
  const orden = (edicion?.data.exponen ?? []).map((referencia) => referencia.id);
  const exponen = conRol(disponibles, 'expone').sort((a, b) => {
    const posicionA = orden.indexOf(a.id);
    const posicionB = orden.indexOf(b.id);
    if (posicionA !== posicionB) {
      if (posicionA === -1) return 1;
      if (posicionB === -1) return -1;
      return posicionA - posicionB;
    }
    return porNumeroOrdenNombre(a, b);
  });

  return { fotea: fotean, expone: exponen };
}

/**
 * Reading order of the whole index: the `fotean` group and then the `exponen`
 * one, without repeating whoever does both (Angela Pérez, Leo Simmons). This is
 * the list the profile's previous/next navigation walks.
 */
export function ordenDelIndice(artistas: Artista[], edicion?: Edicion): Artista[] {
  const { fotea, expone } = grupos(artistas, edicion);
  const vistos = new Set(fotea.map((artista) => artista.id));
  return [...fotea, ...expone.filter((artista) => !vistos.has(artista.id))];
}

/**
 * Previous and next entry around `id`, cyclically: the design shows both links
 * on every profile, and the first one's "previous" is the last of the index
 * (design/Artista.dc.html: "cíclico"; Herick, first of the index, links back to
 * Gustavo Sánchez, the last). With a single entry both are that entry;
 * `undefined` when `id` is not in the list.
 */
export function vecinos(
  orden: Artista[],
  id: string
): { anterior: Artista; siguiente: Artista } | undefined {
  const posicion = orden.findIndex((artista) => artista.id === id);
  if (posicion === -1) return undefined;
  const total = orden.length;
  return {
    anterior: orden[(posicion - 1 + total) % total],
    siguiente: orden[(posicion + 1) % total],
  };
}

/**
 * Roles to spell out in a row of `seccion`, that section's own role first:
 * "Fotea · Set 003 · Expone" in the `fotean` group and "Expone · Fotea" in the
 * `exponen` one (design/Artistas.dc.html `renderVals()`). Only the two roles
 * the index has a group for are listed — the approved screen shows neither
 * Film nor Música in this column, even for Carlos Vázquez (fotea, film), Naia
 * Guanipa (fotea, música) or Leo Simmons (fotea, expone, film).
 */
export function rolesDeSeccion(artista: Artista, seccion: Seccion): Seccion[] {
  const otra: Seccion = seccion === 'fotea' ? 'expone' : 'fotea';
  return artista.data.roles.includes(otra) ? [seccion, otra] : [seccion];
}
