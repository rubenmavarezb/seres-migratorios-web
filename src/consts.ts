/**
 * Site-wide constants that are not interface copy: CLAUDE.md ("No se
 * traducen") lists proper names, handles, "Seres Migratorios", "¡Aguante la
 * fotografía!" and FAMILIA / RESILIENCIA / EXILIO as values that never vary
 * by language. `Nav.astro` and `Pie.astro` still route their own
 * not-translated strings through `t()` (identical value duplicated in
 * `es.json`/`en.json`) because those components already take an `idioma`
 * prop for the rest of their copy. `PalabrasClave.astro`'s prop list
 * (PLAN.md §5, this ticket's tech-lead instructions) has no `idioma` prop at
 * all — the three words truly cannot vary by language — so its default lives
 * here instead of forcing an unused dictionary lookup.
 */

/**
 * The three words of the brand mark, always in this fixed order
 * (design-system.md §7, item 10 "Palabras clave"; design/ds/canvas/Elementos.dc.html,
 * block "PALABRASCLAVE"). Written with real capitalization — `PalabrasClave.astro`
 * applies `uppercase` visually, this array is not the display casing.
 */
export const PALABRAS_CLAVE: readonly [string, string, string] = [
  'Familia',
  'Resiliencia',
  'Exilio',
];
