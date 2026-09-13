/**
 * Content-derived fixtures for the e2e specs (SM-059).
 *
 * Reads `src/content/artistas` and `src/content/ediciones` directly with
 * `node:fs` instead of `astro:content` (unavailable outside the Astro build)
 * and instead of hardcoding a slug: CLAUDE.md forbids inventing data, and a
 * literal slug copied into a spec can silently drift from the collection.
 * Only the handful of frontmatter fields each helper needs are read, with a
 * small regex reader — good enough for this repo's flat YAML values, not a
 * general YAML parser.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const CARPETA_ARTISTAS = fileURLToPath(new URL('../../src/content/artistas/', import.meta.url));
const CARPETA_EDICIONES = fileURLToPath(new URL('../../src/content/ediciones/', import.meta.url));

function archivosMarkdown(carpeta: string): string[] {
  return readdirSync(carpeta).filter((archivo) => archivo.endsWith('.md'));
}

/** Reads a single top-level `campo: valor` line, unquoted. */
function leerCampo(frontmatter: string, campo: string): string {
  const coincidencia = frontmatter.match(new RegExp(`^${campo}:\\s*(.+)$`, 'm'));
  return (coincidencia?.[1] ?? '').trim().replace(/^['"]|['"]$/g, '');
}

export interface ArtistaDeContenido {
  slug: string;
  nombre: string;
  fotos: number;
}

function leerArtista(archivo: string): ArtistaDeContenido {
  const contenido = readFileSync(`${CARPETA_ARTISTAS}${archivo}`, 'utf8');
  // Every entry of `obra` starts with `- image:`; nothing else in the
  // artistas schema does, so counting that line is enough to know the
  // gallery's size without parsing YAML.
  const fotos = (contenido.match(/^\s*-\s+image:/gm) ?? []).length;
  return {
    slug: leerCampo(contenido, 'slug'),
    nombre: leerCampo(contenido, 'nombre'),
    fotos,
  };
}

/**
 * The published artist with the largest `obra` gallery. Whoever it is, a
 * gallery of 3+ photos keeps the lightbox's `ArrowRight` spec unambiguous
 * (SM-059: "lightbox ... navegación con flechas"), and picking the maximum
 * rather than a fixed slug means the spec keeps working if the content
 * changes.
 */
export function artistaConGaleria(): ArtistaDeContenido {
  const candidatos = archivosMarkdown(CARPETA_ARTISTAS)
    .map(leerArtista)
    .filter((artista) => artista.slug !== '' && artista.fotos >= 3);
  if (candidatos.length === 0) {
    throw new Error(
      'Ningún artista publicado en src/content/artistas tiene 3 o más fotos en `obra`; ajustá el fixture de tests/e2e/contenido.ts.'
    );
  }
  return candidatos.reduce((mejor, actual) => (actual.fotos > mejor.fotos ? actual : mejor));
}

export interface EdicionDeContenido {
  slug: string;
  nombre: string;
}

/** The one real edition of the collection (there is exactly one today). */
export function edicionExistente(): EdicionDeContenido {
  const archivos = archivosMarkdown(CARPETA_EDICIONES);
  if (archivos.length === 0) {
    throw new Error('No hay ninguna edición en src/content/ediciones.');
  }
  const contenido = readFileSync(`${CARPETA_EDICIONES}${archivos[0]}`, 'utf8');
  return { slug: leerCampo(contenido, 'slug'), nombre: leerCampo(contenido, 'nombre') };
}
