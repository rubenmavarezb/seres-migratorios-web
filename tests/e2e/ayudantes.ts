/**
 * Shared assertions for the e2e specs (SM-059, extended by SM-060 with the
 * WCAG contrast helpers below).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { expect, type Page } from '@playwright/test';

const CARPETA_ARTISTAS = fileURLToPath(new URL('../../src/content/artistas/', import.meta.url));

/**
 * The published artist whose `instagram` is still a bracket placeholder
 * (`Artistas.astro`'s own `esPlaceholder`, mirrored here rather than
 * imported: this file lives outside `astro:content`, same reasoning as
 * `contenido.ts`'s `artistaConGaleria`). Placed in `ayudantes.ts` — this
 * ticket's ownership list names it explicitly for helpers, unlike
 * `contenido.ts`, which SM-059 owns — rather than hardcoding a slug: CLAUDE.md
 * forbids inventing data, and a literal slug can silently drift from the
 * collection.
 */
export function artistaConHandlePendiente(): { slug: string; nombre: string } {
  const archivos = readdirSync(CARPETA_ARTISTAS).filter((archivo) => archivo.endsWith('.md'));
  for (const archivo of archivos.sort()) {
    const frontmatter = readFileSync(`${CARPETA_ARTISTAS}${archivo}`, 'utf8');
    const instagram = (frontmatter.match(/^instagram:\s*(.+)$/m)?.[1] ?? '')
      .trim()
      .replace(/^['"]|['"]$/g, '');
    if (/^\[[^\]]+\]$/.test(instagram)) {
      const slug = (frontmatter.match(/^slug:\s*(.+)$/m)?.[1] ?? '').trim();
      const nombre = (frontmatter.match(/^nombre:\s*(.+)$/m)?.[1] ?? '').trim();
      if (slug !== '') return { slug, nombre };
    }
  }
  throw new Error(
    'Ningún artista publicado en src/content/artistas tiene un handle placeholder ("[...]"); ajustá el fixture de tests/e2e/ayudantes.ts.'
  );
}

/**
 * Parses a computed `rgb(r, g, b)` / `rgba(r, g, b, a)` string (what
 * `getComputedStyle` always returns for a resolved color, regardless of how
 * it was authored) into its channels. Never receives a token name or hex —
 * only the browser's own serialization.
 */
function canalesDeColor(rgb: string): [number, number, number] {
  const coincidencia = rgb.match(/rgba?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)/);
  if (!coincidencia) {
    throw new Error(`No se pudo interpretar el color "${rgb}" (se esperaba rgb()/rgba()).`);
  }
  return [Number(coincidencia[1]), Number(coincidencia[2]), Number(coincidencia[3])];
}

/** WCAG relative luminance (2.x formula) of an sRGB triplet. */
function luminanciaRelativa([r, g, b]: [number, number, number]): number {
  const canal = (valor: number) => {
    const c = valor / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

/**
 * WCAG contrast ratio between two computed colors, both read from the live
 * DOM with `getComputedStyle` (never from the token hex directly): this is
 * what actually reaches the screen for a given state (`:hover`, `:focus`,
 * `prefers-reduced-motion`), not just the resting-state pairing axe already
 * checks.
 */
export function ratioDeContraste(colorTexto: string, colorFondo: string): number {
  const l1 = luminanciaRelativa(canalesDeColor(colorTexto));
  const l2 = luminanciaRelativa(canalesDeColor(colorFondo));
  const [claro, oscuro] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (claro + 0.05) / (oscuro + 0.05);
}

/**
 * Asserts a text/background pair meets AA (backlog SM-060: "todo texto
 * cumple AA"). `esGrande` follows WCAG's large-text definition (≥ 24px, or
 * ≥ 18.66px bold) — the caller measures the computed size/weight and passes
 * the right threshold, this helper does not re-derive it.
 */
export function esperarContrasteAA(
  colorTexto: string,
  colorFondo: string,
  esGrande: boolean,
  mensaje: string
): void {
  const ratio = ratioDeContraste(colorTexto, colorFondo);
  const minimo = esGrande ? 3 : 4.5;
  expect(
    ratio,
    `${mensaje} (ratio ${ratio.toFixed(2)}:1, mínimo AA ${minimo}:1)`
  ).toBeGreaterThanOrEqual(minimo);
}

/**
 * SM-064's rule, as a reusable assertion: canonical and `og:url` must always
 * point at the public domain (`Seo.astro`, `astro.config.mjs`), never at the
 * internal `seres-migratorios.netlify.app` preview host.
 */
export async function sinNetlifyEnMetadatos(page: Page): Promise<void> {
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
  expect(canonical, 'falta <link rel="canonical">').not.toBeNull();
  expect(canonical).not.toContain('netlify.app');
  expect(ogUrl, 'falta <meta property="og:url">').not.toBeNull();
  expect(ogUrl).not.toContain('netlify.app');
}
