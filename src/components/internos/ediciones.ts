/**
 * Pure formatting helpers shared by `/ediciones` and `/ediciones/[slug]`.
 *
 * They live under `components/internos/` because CLAUDE.md reserves that folder
 * for "los helpers ajenos al design system" and the repo's documented `src/`
 * tree has no other slot for shared logic (no `lib/`, no `utils/`). Nothing
 * here imports Astro, `astro:content` or a dictionary: the module is plain
 * TypeScript so `node --test` can execute it through Node's type stripping,
 * exactly like `src/i18n/rutas.ts`.
 *
 * No library is used for dates (CLAUDE.md: "Dependencias: ninguna sin
 * preguntar antes"), and every read of a `Date` goes through its UTC getters.
 * That is load-bearing, not a style choice: `content.config.ts` parses
 * `fecha: 2026-08-08` with `z.coerce.date()`, which yields the UTC midnight of
 * that day. Read with local getters in Buenos Aires (UTC-3) the same instant is
 * the 7th at 21:00, so `08.08.2026` would ship as `07.08.2026`.
 */

/** Two-digit zero-padded number, for `dd.mm.aaaa` and ISO 8601 alike. */
function dosDigitos(valor: number): string {
  return String(valor).padStart(2, '0');
}

/**
 * `dd.mm.aaaa` — the date format every approved screen uses inside a
 * `BloqueFicha` ("08.08.2026", `design/Edicion.dc.html`). `BloqueFicha` never
 * formats a date itself, so this is what the caller passes it.
 */
export function fechaCorta(fecha: Date): string {
  const dia = dosDigitos(fecha.getUTCDate());
  const mes = dosDigitos(fecha.getUTCMonth() + 1);
  return `${dia}.${mes}.${fecha.getUTCFullYear()}`;
}

/** `aaaa-mm-dd` of a calendar date, the date half of an ISO 8601 timestamp. */
export function fechaIso(fecha: Date): string {
  const mes = dosDigitos(fecha.getUTCMonth() + 1);
  const dia = dosDigitos(fecha.getUTCDate());
  return `${fecha.getUTCFullYear()}-${mes}-${dia}`;
}

/**
 * Buenos Aires' UTC offset, written as an ISO 8601 designator. Argentina has
 * observed UTC-3 year-round since 2009 (no DST), so a fixed offset is correct
 * for the dates this site publishes; it is spelled out here instead of being
 * derived from the build machine's clock, which would make the output depend on
 * where the build runs.
 */
export const ZONA_BUENOS_AIRES = '-03:00';

/**
 * ISO 8601 timestamp for schema.org's `startDate` / `endDate`: the edition's
 * calendar date plus one of its `horario` times, in Buenos Aires' offset.
 *
 * `hora` arrives in the `HH:MM` shape the `ediciones` schema already enforces
 * (`/^\d{2}:\d{2}$/`), so it is concatenated as-is rather than re-parsed.
 */
export function fechaHoraIso(fecha: Date, hora: string): string {
  return `${fechaIso(fecha)}T${hora}:00${ZONA_BUENOS_AIRES}`;
}

/** Em dash used by the `nombre` of an edition ("Edición 01 — Buenos Aires"). */
const SEPARADOR_NOMBRE = '—';

/**
 * Short label of an edition: the part of `nombre` before its em dash
 * ("Edición 01 — Buenos Aires" -> "Edición 01"), which is what the approved
 * lamina overlays on the `BloqueFicha` as a handwritten annotation and what its
 * "Exposición · Edición 01" caption reads.
 *
 * A `nombre` without the separator is returned whole — this only ever trims a
 * real value, it never composes a new one (CLAUDE.md, "No inventar datos").
 */
export function etiquetaCortaDeEdicion(nombre: string): string {
  const [primeraParte] = nombre.split(SEPARADOR_NOMBRE);
  const recortada = primeraParte.trim();
  return recortada === '' ? nombre : recortada;
}

/**
 * `lugar.direccion` without the city tail it already carries. The content of
 * edición 01 stores "Humberto Primo 3032, Buenos Aires, ARG" while the approved
 * `BloqueFicha` prints the street, the venue and the city on three separate
 * lines — passing the field as-is would repeat the city twice in the same
 * block.
 *
 * OBSERVACIÓN: the duplication is in the content, not in the design. This
 * trims the rendered line instead of editing `src/content/ediciones/*.md`,
 * which is shared with the other Fase 2 branches.
 */
export function direccionSinCiudad(direccion: string, ciudad: string): string {
  const corte = direccion.indexOf(`, ${ciudad}`);
  if (corte === -1) return direccion;
  const recortada = direccion.slice(0, corte).trim();
  return recortada === '' ? direccion : recortada;
}

/**
 * First and last set number of the people who shoot an edition, for the
 * "Fotean · Sets 001 – 007" caption of `design/Edicion.dc.html`. Returns `null`
 * when nobody carries a `numero` (it is optional in the `artistas` schema), so
 * the caller can drop the range from the caption instead of printing an
 * invented one.
 */
export function rangoDeSets(numeros: readonly (string | undefined)[]): {
  desde: string;
  hasta: string;
} | null {
  const presentes = numeros.filter((numero): numero is string => numero !== undefined).sort();
  if (presentes.length === 0) return null;
  return { desde: presentes[0], hasta: presentes[presentes.length - 1] };
}

/**
 * Portrait box for `FichaFotografo`, derived from the scan's own aspect ratio
 * so no portrait is ever cropped or stretched by `object-cover`.
 *
 * `design/Edicion.dc.html`'s `renderVals()` hardcodes the two cases it needs —
 * `retratoChico: [72, 90]` for the tall scans and `retratoCuadrado: [72, 72]`
 * for Pati Caro's square 114×114 — which this reproduces exactly (262×327 and
 * its siblings round to 90; 114×114 to 72) without keeping a per-person list in
 * the page.
 */
export function retratoTamano(ancho: number, alto: number): [number, number] {
  const ANCHO = 72;
  if (ancho <= 0 || alto <= 0) return [ANCHO, 90];
  return [ANCHO, Math.round((ANCHO * alto) / ancho)];
}

/** A bracket placeholder ("[HANDLE MAVAREZ]") is valid content but never a usable link. */
export function esPlaceholder(valor: string | undefined): boolean {
  return valor === undefined || /^\[[^\]]+\]$/.test(valor);
}

/** Public profile URL from a handle written with the at sign ("@rawmses"). */
export function urlDeInstagram(handleConArroba: string): string {
  return `https://www.instagram.com/${handleConArroba.slice(1)}/`;
}
